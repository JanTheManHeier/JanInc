# Storm Core

Versioned WordPress domain plugin for Tromsø Storm.

It owns the normalized content types for:

- seasons and games;
- player and staff profiles with season-specific roster entries;
- sponsors with season-specific agreements;
- training times;
- curated Facebook and Instagram posts.

All registered metadata is typed, sanitized and exposed through WordPress REST API schemas.
Draft and private content remains protected by WordPress permissions. The plugin deliberately
does not read legacy `Storm_*` tables; migration into this model is handled separately.

## Bulk content reads

Season relations load their published sponsor/person profiles and metadata in
batches, including thumbnail caches. Game lists likewise load post objects with
metadata rather than resolving every ID separately. The existing public methods,
REST responses and editorial storage remain unchanged; there is no additional
database, persistent result cache or dual-write model.

An isolated full-homepage profile reduced median SQL calls from 613 to 108.
All seven public API payload hashes and domain output hashes remained identical.
The editorial integration suite checks cold-cache query growth and immediate
visibility after metadata/status changes as well as existing season rollback.
These results do not justify introducing custom domain tables: evaluate those
only against a remaining measured bottleneck and their migration/synchronization
cost, not the former N+1 query count.

Purpose-built editor fields provide:

- relation selectors instead of numeric WordPress IDs;
- date, time, URL, number, checkbox and controlled status inputs;
- required-field and relationship validation with visible admin errors;
- generated titles for season, game, roster, sponsor-agreement and training records;
- responsive admin layout without exposing the raw custom-fields box.

## Editorial workflow (0.5)

The Norwegian [editorial handbook](BRUKSANVISNING.md) is available under
**Storm → Redaktørhåndbok**, including a print/PDF view. Administrators and Editors
can manage domain content; a personal Editor account is sufficient for daily work.

**Storm → Sesongskifte** prepares drafts, reuses person/sponsor profiles, copies
selected season relations idempotently, and explicitly publishes reviewed content
before changing the active season. Private related profiles block activation.
Previous published seasons remain as history. A database advisory lock serializes
operations and is released if a connection dies.

**Storm → Forsideinnhold** selects published ordinary pages for hero, community,
tickets, partners, arena and team-photo content. Page overrides are reversible.
**Storm → Innholdskontroll** lists review/expiry work and bounded external-link
checks; published historical articles are never automatically removed.

The explicit `storm_core_public_content` switch is enabled by reviewed activation.
Once enabled, empty current-season content remains empty rather than resurrecting
legacy/demo data. Sponsor agreements include business/personal supporting members.
A missing jersey number is not number zero.

`GET /wp-json/storm/v1/{seasons,games,roster,staff,sponsors,training,social}` provides
read-only published content, excluding private/draft relations. It returns 503
before managed content is activated. This does not implement the later QR-ticket API.

Link checks use safe HEAD requests, five URLs per run; a blocked HEAD request does
not necessarily mean a broken destination. Coverage is the 100 most recently
modified published posts/pages, 100 domain records and selected homepage pages,
not the complete historical archive. Internal/permalink checks remain part of
content acceptance and the URL-regression inventory.

## Migration report

The first migration phase is deliberately read-only:

```bash
wp storm migrate
wp storm migrate --domain=games --format=json
wp storm migrate --fail-on-invalid
```

The report discovers the live `Storm_*` tables, derives historical seasons from actual fixture
dates, validates rows and identifies target types and stable source keys.

After the mapping is approved, import records as drafts:

```bash
wp storm migrate --execute --yes
```

The import is idempotent and stores source keys, hashes and snapshots. It refuses to overwrite
records changed after import unless `--force` is supplied. New records remain drafts unless
`--status=publish` is explicitly selected. Legacy source tables are never changed.

## NIF synchronization

```bash
wp storm nif status
wp storm nif sync
wp storm nif sync --execute --yes
```

The NIF adapter normalizes and deduplicates scheduled matches, stores the last valid response
persistently, protects manual overrides and stops on duplicate local NIF IDs or multiple active
seasons. Hourly synchronization is scheduled only when project-specific credentials exist.
Published normalized games are preferred by the theme before transition; legacy fixtures
remain a fallback only until managed content is explicitly activated. The season wizard
can target NIF draft imports to the selected July–June season. Missing NIF credentials
do not prevent manual match entry.
