"""Convert legacy WordPress storage without changing row data (private staging only)."""
import argparse
import collections
import datetime
import hashlib
import json
import pathlib
import re
import subprocess

DEPLOY = pathlib.Path(__file__).resolve().parents[1]
COMPOSE = ["docker", "compose", "-f", "docker-compose.yml", "-f", "docker-compose.staging.yml"]
DATABASE = COMPOSE + [
    "exec", "-T", "db", "sh", "-c",
    'export MYSQL_PWD="$(cat /run/secrets/db_root_password)"; '
    'exec mariadb -uroot --batch --skip-column-names "$MARIADB_DATABASE"',
]


def sql(query):
    result = subprocess.run(DATABASE, cwd=DEPLOY, input=query, capture_output=True, text=True)
    if result.returncode:
        code = re.search(r"ERROR \d+", result.stderr)
        raise RuntimeError("Storage migration stopped: " + (code.group() if code else "database query failed"))
    return result.stdout


def fingerprints():
    command = COMPOSE + [
        "exec", "-T", "db", "sh", "-c",
        'export MYSQL_PWD="$(cat /run/secrets/db_root_password)"; '
        'exec mariadb-dump -uroot --single-transaction --skip-lock-tables '
        '--no-create-info --skip-extended-insert --skip-comments --skip-add-locks '
        '--skip-disable-keys --hex-blob --skip-triggers --skip-tz-utc '
        '--default-character-set=utf8mb4 "$MARIADB_DATABASE"',
    ]
    rows = collections.defaultdict(list)
    tables = sql(
        "SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA=DATABASE() "
        "AND TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME;"
    ).splitlines()
    if any(not re.fullmatch(r"[A-Za-z0-9_-]+", table) for table in tables):
        raise RuntimeError("Unexpected table identifier in handover.")
    counts = dict(line.split("\t") for line in sql(" UNION ALL ".join(
        f"SELECT '{table}',COUNT(*) FROM `{table}`" for table in tables
    ) + ";").splitlines())
    with subprocess.Popen(command, cwd=DEPLOY, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as process:
        for line in process.stdout:
            match = re.match(rb"INSERT INTO `([^`]+)` ", line)
            if match:
                rows[match[1].decode()].append(hashlib.sha256(line).digest())
        if process.wait():
            raise RuntimeError("Cannot verify row data: database dump failed.")
    if any(len(rows[table]) != int(counts[table]) for table in tables):
        raise RuntimeError("Database dump row parsing did not match actual table counts.")
    return {
        table: {"rows": len(rows[table]), "sha256": hashlib.sha256(b"".join(sorted(rows[table]))).hexdigest()}
        for table in tables
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true", help="Requires verified backup and stopped application/cron/backup services.")
    args = parser.parse_args()
    model = json.loads(subprocess.check_output(COMPOSE + ["--profile", "*", "config", "--format", "json"], cwd=DEPLOY))
    extra = model["services"]["wordpress"]["environment"].get("WORDPRESS_CONFIG_EXTRA", "")
    if not re.search(r"define\(['\"]WP_ENVIRONMENT_TYPE['\"],\s*['\"]staging['\"]\)", extra):
        raise RuntimeError("Only private staging storage may be converted by this script.")
    engines = dict(line.split("\t") for line in sql(
        "SELECT TABLE_NAME,ENGINE FROM information_schema.tables "
        "WHERE TABLE_SCHEMA=DATABASE() AND TABLE_TYPE='BASE TABLE';"
    ).splitlines())
    if not {"wp_posts", "wp_postmeta", "wp_options"} <= engines.keys():
        raise RuntimeError("Expected the handover's wp_ WordPress tables.")
    pending = [table for table, engine in engines.items() if table.startswith("wp_") and engine.lower() != "innodb"]
    if not args.execute:
        print(json.dumps({"wordpressTablesToConvert": pending}, indent=2))
        return
    running = set(subprocess.check_output(COMPOSE + ["ps", "--status", "running", "--services"], cwd=DEPLOY, text=True).splitlines())
    if running & {"wordpress", "wordpress-cron", "backup"}:
        raise RuntimeError("Stop WordPress, its scheduler and recurring backup before conversion.")
    before = fingerprints()
    for table in pending:
        sql("ALTER TABLE `" + table.replace("`", "``") + "` ENGINE=InnoDB;")
    after = fingerprints()
    if before != after:
        raise RuntimeError("Row-data fingerprints changed; keep the application stopped and restore the verified backup.")
    actual = dict(line.split("\t") for line in sql(
        "SELECT TABLE_NAME,ENGINE FROM information_schema.tables WHERE TABLE_SCHEMA=DATABASE() AND TABLE_TYPE='BASE TABLE';"
    ).splitlines())
    if any(actual[table].lower() != "innodb" for table in engines if table.startswith("wp_")):
        raise RuntimeError("Not every WordPress table is transactional.")
    report = {
        "verifiedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "converted": pending, "beforeEngines": engines, "afterEngines": actual,
        "unchangedData": before, "allRowDataIdentical": True,
    }
    output = DEPLOY / "private" / "editorial-storage-verified.json"
    output.write_text(json.dumps(report, indent=2))
    output.chmod(0o600)
    print(f"Converted {len(pending)} WordPress tables; identical row data verified in all {len(before)} tables.")


if __name__ == "__main__":
    main()
