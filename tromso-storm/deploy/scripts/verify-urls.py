#!/usr/bin/env python3
import argparse
import csv
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


USER_AGENT = "TromsoStormMigrationVerifier/1.0"


def check_url(base_url, row, timeout):
    source_path = row["url"]
    target_url = urllib.parse.urljoin(base_url.rstrip("/") + "/", source_path.lstrip("/"))
    request = urllib.request.Request(target_url, method="HEAD", headers={"User-Agent": USER_AGENT})

    try:
        response = urllib.request.urlopen(request, timeout=timeout)
    except urllib.error.HTTPError as error:
        if error.code != 405:
            return row, target_url, error.code, error.geturl(), str(error)
        request = urllib.request.Request(target_url, method="GET", headers={"User-Agent": USER_AGENT})
        try:
            response = urllib.request.urlopen(request, timeout=timeout)
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as retry_error:
            status = retry_error.code if isinstance(retry_error, urllib.error.HTTPError) else 0
            final_url = retry_error.geturl() if isinstance(retry_error, urllib.error.HTTPError) else ""
            return row, target_url, status, final_url, str(retry_error)
    except (urllib.error.URLError, TimeoutError) as error:
        return row, target_url, 0, "", str(error)

    with response:
        return row, target_url, response.status, response.geturl(), ""


def parse_args():
    parser = argparse.ArgumentParser(
        description="Verify the handover URL inventory against a staging or production origin."
    )
    parser.add_argument("inventory", type=Path, help="Path to data/urls/url-inventory.csv")
    parser.add_argument("base_url", help="Origin to test, for example https://staging.example.no")
    parser.add_argument("--output", type=Path, default=Path("url-verification.csv"))
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--timeout", type=float, default=20)
    parser.add_argument("--limit", type=int)
    parser.add_argument(
        "--allow-redirects",
        action="store_true",
        help="Do not fail when an inventory URL redirects to another path.",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    if not args.inventory.is_file():
        raise SystemExit(f"Inventory not found: {args.inventory}")
    if args.workers < 1:
        raise SystemExit("--workers must be at least 1")

    with args.inventory.open(encoding="utf-8-sig", newline="") as source:
        rows = list(csv.DictReader(source))

    if args.limit is not None:
        rows = rows[: args.limit]

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        results = list(
            executor.map(lambda row: check_url(args.base_url, row, args.timeout), rows)
        )

    failures = 0
    redirects = 0
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8", newline="") as destination:
        fieldnames = ["id", "type", "title", "source_path", "target_url", "status", "final_url", "error"]
        writer = csv.DictWriter(destination, fieldnames=fieldnames)
        writer.writeheader()

        for row, target_url, status, final_url, error in results:
            if status < 200 or status >= 400:
                failures += 1
            if final_url and final_url.rstrip("/") != target_url.rstrip("/"):
                redirects += 1
            writer.writerow(
                {
                    "id": row["id"],
                    "type": row["type"],
                    "title": row["title"],
                    "source_path": row["url"],
                    "target_url": target_url,
                    "status": status,
                    "final_url": final_url,
                    "error": error,
                }
            )

    print(
        f"Checked {len(results)} URLs: {failures} failures, {redirects} redirects. "
        f"Report: {args.output}"
    )
    return 1 if failures or (redirects and not args.allow_redirects) else 0


if __name__ == "__main__":
    sys.exit(main())
