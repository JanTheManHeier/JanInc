#!/bin/sh
set -eu

: "${DB_HOST:?DB_HOST is required}"
: "${DB_NAME:?DB_NAME is required}"
: "${DB_USER:?DB_USER is required}"
: "${DB_PASSWORD_FILE:?DB_PASSWORD_FILE is required}"
: "${BACKUP_INTERVAL_SECONDS:=86400}"
: "${BACKUP_RETENTION_DAYS:=35}"
: "${BACKUP_RUN_ONCE:=0}"
: "${RCLONE_REMOTE:?RCLONE_REMOTE is required}"
: "${RCLONE_PATH:?RCLONE_PATH is required}"

if [ ! -s "$DB_PASSWORD_FILE" ]; then
    echo "Database password file is missing or empty" >&2
    exit 1
fi

if [ ! -s /config/rclone/rclone.conf ]; then
    echo "rclone.conf is missing; external backup is mandatory" >&2
    exit 1
fi

export MYSQL_PWD
MYSQL_PWD="$(cat "$DB_PASSWORD_FILE")"

run_backup() {
    timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
    target="/backups/$timestamp"
    mkdir -p "$target"

    echo "[$(date -u +%FT%TZ)] Creating database backup"
    mariadb-dump \
        --host="$DB_HOST" \
        --user="$DB_USER" \
        --single-transaction \
        --quick \
        --default-character-set=utf8mb4 \
        "$DB_NAME" >"$target/database.sql"
    gzip -9 "$target/database.sql"

    echo "[$(date -u +%FT%TZ)] Creating content backup"
    attempt=1
    while true; do
        if tar -C /source -czf "$target/site-content.tar.gz" wp-content storm-legacy; then
            break
        else
            status=$?
        fi
        if [ "$status" -ne 1 ] || [ "$attempt" -ge 3 ]; then
            echo "Content archive failed; refusing to upload an incomplete backup" >&2
            return "$status"
        fi
        echo "Content changed during archiving; retrying ($attempt/3)" >&2
        attempt=$((attempt + 1))
        sleep 2
    done

    (
        cd "$target"
        sha256sum database.sql.gz site-content.tar.gz >SHA256SUMS
    )

    echo "[$(date -u +%FT%TZ)] Uploading backup to external storage"
    rclone copy "$target" "${RCLONE_REMOTE}:${RCLONE_PATH}/${timestamp}" \
        --config /config/rclone/rclone.conf \
        --checksum \
        --immutable

    rclone delete "${RCLONE_REMOTE}:${RCLONE_PATH}" \
        --config /config/rclone/rclone.conf \
        --min-age "${BACKUP_RETENTION_DAYS}d"

    rclone rmdirs "${RCLONE_REMOTE}:${RCLONE_PATH}" \
        --config /config/rclone/rclone.conf \
        --leave-root

    find /backups -mindepth 1 -maxdepth 1 -type d -mtime "+${BACKUP_RETENTION_DAYS}" -exec rm -rf -- {} \;
    echo "[$(date -u +%FT%TZ)] Backup completed"
}

run_backup

if [ "$BACKUP_RUN_ONCE" = "1" ]; then
    exit 0
fi

while true; do
    sleep "$BACKUP_INTERVAL_SECONDS"
    run_backup
done
