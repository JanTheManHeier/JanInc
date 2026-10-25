#!/usr/bin/env python3
import argparse
import csv
import html
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path


USER_AGENT = "TromsoStormMediaVerifier/1.0"
CSS_URL_PATTERN = re.compile(r"""url\(\s*(['"]?)(.*?)\1\s*\)""", re.IGNORECASE)
BLOCKED_SUFFIXES = (".php", ".php3", ".php4", ".php5", ".phtml", ".inc", ".cgi", ".pl")


class MediaReferenceParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references = set()

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if not value:
                continue
            if name in {"src", "href", "poster"}:
                self.references.add(value)
            elif name == "srcset":
                for candidate in value.split(","):
                    url = candidate.strip().split(" ", 1)[0]
                    if url:
                        self.references.add(url)
            elif name == "style":
                for match in CSS_URL_PATTERN.finditer(value):
                    if match.group(2):
                        self.references.add(match.group(2))


def parse_args():
    parser = argparse.ArgumentParser(
        description="Crawl public pages and verify migrated upload and /Storm/ media references."
    )
    parser.add_argument("inventory", type=Path)
    parser.add_argument("base_url")
    parser.add_argument("--legacy-base-url")
    parser.add_argument("--output", type=Path, default=Path("media-verification.csv"))
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--timeout", type=float, default=20)
    parser.add_argument("--limit", type=int)
    return parser.parse_args()


def request_url(url, timeout, method="GET"):
    request = urllib.request.Request(url, method=method, headers={"User-Agent": USER_AGENT})
    return urllib.request.urlopen(request, timeout=timeout)


def fetch_page(base_url, row, timeout):
    target_url = urllib.parse.urljoin(base_url.rstrip("/") + "/", row["url"].lstrip("/"))
    try:
        with request_url(target_url, timeout) as response:
            content_type = response.headers.get_content_type()
            if content_type not in {"text/html", "application/xhtml+xml"}:
                return row["url"], set(), f"Unexpected page content type: {content_type}"
            body = response.read().decode(response.headers.get_content_charset() or "utf-8", "replace")
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as error:
        return row["url"], set(), str(error)

    parser = MediaReferenceParser()
    parser.feed(body)
    references = set(parser.references)

    media_paths = set()
    for reference in references:
        decoded = html.unescape(reference.strip())
        absolute = urllib.parse.urljoin(target_url, decoded)
        parsed = urllib.parse.urlsplit(absolute)
        path = urllib.parse.unquote(parsed.path)
        if "*" in path or path.endswith("/"):
            continue
        if path.lower().startswith("/wp-content/uploads/") or path.lower().startswith("/storm/"):
            media_paths.add(path)

    return row["url"], media_paths, ""


def check_media(path, base_url, legacy_base_url, timeout):
    is_legacy = path.lower().startswith("/storm/")
    origin = legacy_base_url if is_legacy and legacy_base_url else base_url
    encoded_path = urllib.parse.quote(path, safe="/:@")
    target_url = urllib.parse.urljoin(origin.rstrip("/") + "/", encoded_path.lstrip("/"))
    blocked = path.lower().endswith(BLOCKED_SUFFIXES)

    try:
        response = request_url(target_url, timeout, method="HEAD")
    except urllib.error.HTTPError as error:
        if error.code == 405:
            try:
                response = request_url(target_url, timeout, method="GET")
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as retry_error:
                status = retry_error.code if isinstance(retry_error, urllib.error.HTTPError) else 0
                return path, target_url, status, "", blocked, str(retry_error)
        else:
            return path, target_url, error.code, error.headers.get("Content-Type", ""), blocked, ""
    except (urllib.error.URLError, TimeoutError) as error:
        return path, target_url, 0, "", blocked, str(error)

    with response:
        return (
            path,
            target_url,
            response.status,
            response.headers.get("Content-Type", ""),
            blocked,
            "",
        )


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

    references_by_path = {}
    page_errors = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        page_results = executor.map(
            lambda row: fetch_page(args.base_url, row, args.timeout),
            rows,
        )
        for source_path, media_paths, error in page_results:
            if error:
                page_errors.append((source_path, error))
            for media_path in media_paths:
                references_by_path.setdefault(media_path, set()).add(source_path)

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        media_results = list(
            executor.map(
                lambda path: check_media(
                    path,
                    args.base_url,
                    args.legacy_base_url,
                    args.timeout,
                ),
                sorted(references_by_path),
            )
        )

    failures = 0
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8", newline="") as destination:
        fieldnames = [
            "path",
            "target_url",
            "status",
            "content_type",
            "expected_blocked",
            "reference_count",
            "sample_source",
            "error",
        ]
        writer = csv.DictWriter(destination, fieldnames=fieldnames)
        writer.writeheader()

        for path, target_url, status, content_type, blocked, error in media_results:
            valid = status == 404 if blocked else 200 <= status < 400
            if not valid:
                failures += 1
            sources = sorted(references_by_path[path])
            writer.writerow(
                {
                    "path": path,
                    "target_url": target_url,
                    "status": status,
                    "content_type": content_type,
                    "expected_blocked": "yes" if blocked else "no",
                    "reference_count": len(sources),
                    "sample_source": sources[0] if sources else "",
                    "error": error,
                }
            )

    print(
        f"Crawled {len(rows)} pages: {len(page_errors)} page errors, "
        f"{len(media_results)} media references, {failures} media failures. "
        f"Report: {args.output}"
    )
    if page_errors:
        for source_path, error in page_errors[:10]:
            print(f"Page error {source_path}: {error}", file=sys.stderr)

    return 1 if failures or page_errors else 0


if __name__ == "__main__":
    sys.exit(main())
