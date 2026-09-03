from __future__ import annotations

import argparse
import html
import re
import urllib.parse
import urllib.request
from pathlib import Path


DEFAULT_PAGES = (
    "/",
    "/kampoversikt/",
    "/spillere-trenere/",
    "/samarbeidspartnere/",
    "/hovedsamarbeidspartnere/",
    "/ovrige-samarbeidspartnere/",
    "/billettpriser/",
    "/arkiv/",
)

ASSET_ATTRIBUTES = re.compile(
    r"""(?P<prefix>\b(?:src|href)=["'])(?P<url>[^"'#]+)(?P<suffix>["'])""",
    re.IGNORECASE,
)
SRCSET_ATTRIBUTES = re.compile(
    r"""(?P<prefix>\bsrcset=["'])(?P<value>[^"']+)(?P<suffix>["'])""",
    re.IGNORECASE,
)
CSS_URL = re.compile(r"""url\((?P<quote>["']?)(?P<url>[^)"']+)(?P=quote)\)""")
QUOTED_LOCAL_URL = re.compile(r"""["'](?P<url>https?://127\.0\.0\.1:8090/[^"']+)["']""")


def request_bytes(url: str) -> tuple[bytes, str]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "TromsoStormShadowExporter/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read(), response.headers.get_content_type()


def public_url(path: str, public_prefix: str) -> str:
    normalized = "/" + path.lstrip("/")
    return f"{public_prefix.rstrip('/')}{normalized}"


def output_path(root: Path, url_path: str, content_type: str = "") -> Path:
    clean_path = urllib.parse.unquote(url_path).lstrip("/")
    if not clean_path:
        return root / "index.html"
    candidate = root / clean_path
    if url_path.endswith("/") or content_type == "text/html":
        return candidate / "index.html"
    return candidate


def is_asset_path(path: str) -> bool:
    return path.startswith("/wp-content/") or path.startswith("/wp-includes/")


def rewrite_target(
    raw_url: str,
    source_origin: str,
    public_prefix: str,
    mirrored_pages: set[str],
    live_origin: str,
) -> str:
    absolute = urllib.parse.urljoin(source_origin + "/", html.unescape(raw_url))
    parsed = urllib.parse.urlparse(absolute)
    source = urllib.parse.urlparse(source_origin)

    if parsed.netloc != source.netloc:
        return raw_url

    path = parsed.path or "/"
    suffix = ""
    if parsed.query:
        suffix += f"?{parsed.query}"
    if parsed.fragment:
        suffix += f"#{parsed.fragment}"

    if is_asset_path(path):
        return public_url(path, public_prefix) + suffix

    normalized_page = path if path.endswith("/") else f"{path}/"
    if normalized_page in mirrored_pages:
        return public_url(path, public_prefix) + suffix

    return urllib.parse.urljoin(live_origin.rstrip("/") + "/", path.lstrip("/")) + suffix


def add_preview_metadata(document: str) -> str:
    document = re.sub(
        r"""<meta\s+name=["']robots["'][^>]*>""",
        "",
        document,
        flags=re.IGNORECASE,
    )
    marker = (
        '<meta name="robots" content="noindex,nofollow,noarchive">\n'
        '<meta name="referrer" content="strict-origin-when-cross-origin">'
    )
    document = re.sub(r"</head>", marker + "\n</head>", document, count=1, flags=re.IGNORECASE)

    banner = (
        '<aside class="storm-shadow-banner" role="status">'
        "Designforhåndsvisning – innhold og funksjoner kan avvike fra produksjon."
        "</aside>"
        "<style>"
        ".storm-shadow-banner{position:relative;z-index:10000;padding:.55rem 1rem;"
        "background:#f5822b;color:#111;text-align:center;font:700 14px/1.3 Arial,sans-serif}"
        "</style>"
    )
    return re.sub(r"<body([^>]*)>", r"<body\1>" + banner, document, count=1, flags=re.IGNORECASE)


def collect_asset_urls(document: str, source_origin: str) -> set[str]:
    source = urllib.parse.urlparse(source_origin)
    urls: set[str] = set()

    for match in ASSET_ATTRIBUTES.finditer(document):
        absolute = urllib.parse.urljoin(source_origin + "/", html.unescape(match.group("url")))
        parsed = urllib.parse.urlparse(absolute)
        if parsed.netloc == source.netloc and is_asset_path(parsed.path):
            urls.add(urllib.parse.urlunparse(parsed._replace(fragment="")))

    for match in SRCSET_ATTRIBUTES.finditer(document):
        for candidate in match.group("value").split(","):
            raw_url = candidate.strip().split(" ", 1)[0]
            absolute = urllib.parse.urljoin(source_origin + "/", html.unescape(raw_url))
            parsed = urllib.parse.urlparse(absolute)
            if parsed.netloc == source.netloc and is_asset_path(parsed.path):
                urls.add(urllib.parse.urlunparse(parsed._replace(fragment="")))

    for match in QUOTED_LOCAL_URL.finditer(document):
        parsed = urllib.parse.urlparse(html.unescape(match.group("url")))
        if parsed.netloc == source.netloc and is_asset_path(parsed.path):
            urls.add(urllib.parse.urlunparse(parsed._replace(fragment="")))

    return urls


def rewrite_document(
    document: str,
    source_origin: str,
    public_prefix: str,
    mirrored_pages: set[str],
    live_origin: str,
) -> str:
    def replace_attribute(match: re.Match[str]) -> str:
        rewritten = rewrite_target(
            match.group("url"),
            source_origin,
            public_prefix,
            mirrored_pages,
            live_origin,
        )
        return f"{match.group('prefix')}{rewritten}{match.group('suffix')}"

    def replace_srcset(match: re.Match[str]) -> str:
        rewritten_candidates = []
        for candidate in match.group("value").split(","):
            parts = candidate.strip().split(" ", 1)
            rewritten = rewrite_target(
                parts[0],
                source_origin,
                public_prefix,
                mirrored_pages,
                live_origin,
            )
            rewritten_candidates.append(
                f"{rewritten} {parts[1]}" if len(parts) == 2 else rewritten
            )
        return f"{match.group('prefix')}{', '.join(rewritten_candidates)}{match.group('suffix')}"

    document = ASSET_ATTRIBUTES.sub(replace_attribute, document)
    document = SRCSET_ATTRIBUTES.sub(replace_srcset, document)
    document = document.replace(source_origin, public_prefix.rstrip("/"))
    document = add_preview_metadata(document)
    return "\n".join(line.rstrip() for line in document.splitlines()) + "\n"


def mirror_asset(
    asset_url: str,
    source_origin: str,
    output_root: Path,
    queued: set[str],
) -> None:
    parsed = urllib.parse.urlparse(asset_url)
    data, content_type = request_bytes(asset_url)
    destination = output_path(output_root, parsed.path, content_type)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(data)

    if content_type == "text/css":
        stylesheet = data.decode("utf-8", errors="replace")
        source = urllib.parse.urlparse(source_origin)
        for match in CSS_URL.finditer(stylesheet):
            raw_url = match.group("url").strip()
            if raw_url.startswith("data:"):
                continue
            absolute = urllib.parse.urljoin(asset_url, raw_url)
            target = urllib.parse.urlparse(absolute)
            if target.netloc == source.netloc and is_asset_path(target.path):
                queued.add(urllib.parse.urlunparse(target._replace(query="", fragment="")))


def export_shadow(
    source_origin: str,
    output_root: Path,
    public_prefix: str,
    live_origin: str,
) -> None:
    mirrored_pages = set(DEFAULT_PAGES)
    queued_assets: set[str] = set()

    for page in DEFAULT_PAGES:
        source_url = urllib.parse.urljoin(source_origin.rstrip("/") + "/", page.lstrip("/"))
        data, content_type = request_bytes(source_url)
        document = data.decode("utf-8", errors="replace")
        queued_assets.update(collect_asset_urls(document, source_origin))
        rewritten = rewrite_document(
            document,
            source_origin,
            public_prefix,
            mirrored_pages,
            live_origin,
        )
        destination = output_path(output_root, page, content_type)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(rewritten, encoding="utf-8", newline="\n")
        print(f"page  {page} -> {destination}")

    mirrored_assets: set[str] = set()
    while queued_assets:
        asset_url = queued_assets.pop()
        normalized = urllib.parse.urlunparse(
            urllib.parse.urlparse(asset_url)._replace(query="", fragment="")
        )
        if normalized in mirrored_assets:
            continue
        mirror_asset(normalized, source_origin, output_root, queued_assets)
        mirrored_assets.add(normalized)

    print(f"Exported {len(DEFAULT_PAGES)} pages and {len(mirrored_assets)} assets.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Export local Storm WordPress design preview.")
    parser.add_argument("--source", default="http://127.0.0.1:8090")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1],
    )
    parser.add_argument("--public-prefix", default="/tromso-storm")
    parser.add_argument("--live-origin", default="https://tromsostorm.no")
    args = parser.parse_args()

    export_shadow(
        args.source.rstrip("/"),
        args.output.resolve(),
        args.public_prefix,
        args.live_origin,
    )


if __name__ == "__main__":
    main()
