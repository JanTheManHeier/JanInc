# Tromsø Storm deployment

Production-oriented WordPress deployment for the rebuild. It preserves the existing
WordPress database and URL structure while moving the site away from CentOS 7, PHP 7.4 and
same-disk backups.

## Safety properties

- HTTPS is provisioned before traffic reaches WordPress.
- `www.tromsostorm.no` redirects permanently to the canonical apex host.
- The legacy `/Storm-lagbilde-2008.gif` redirect is retained.
- MariaDB is available only on the private Docker network.
- The backup service also has a dedicated outbound network for external rclone storage;
  it publishes no ports and does not join Traefik's web network.
- The historical `/Storm/` archive is served by a separate static container; legacy PHP is never executed.
- WordPress theme/plugin editing from wp-admin is disabled.
- Database credentials, the dump, media and rclone configuration are excluded from git.
- Only the bespoke `Storm*` plugins are copied from the handover; obsolete vendored plugins
  and archives are not exposed on the new server.
- The versioned `storm-core` domain plugin is mounted read-only from `wp-plugins/storm-core`
  and activated by the idempotent WordPress bootstrap.
- Every backup contains a transactional database dump, `wp-content`, checksums and an
  external rclone copy. The active read-only theme and domain plugin are mounted into the
  backup tree too, so the archive contains deployed code rather than stale private copies.
  Mutable WordPress tables must use InnoDB; inherited MyISAM domain tables are
  retained as read-only sources in the new editorial flows. Do not enable legacy
  table writers during an online backup; pause them for a coordinated snapshot.
  The backup container refuses to run without external storage.
  Set `BACKUP_RUN_ONCE=1` for a manual backup or restore drill; the normal service continues
  running at `BACKUP_INTERVAL_SECONDS`.
- A content archive changed during reading is retried up to three times. A fatal error or
  persistently changing content aborts the backup before any external upload.

## Server prerequisites

- Ubuntu Server 26.04 LTS with Docker Engine and Compose v2
- Minimum 8 GB RAM and 100 GB disk
- TCP ports 80 and 443 open
- DNS prepared to point both the apex and `www` host to the server
- An rclone remote created specifically for the new site
- SSH restricted to the administrator's static source IP where BedSys requires it
- Outbound SMTP relay details for WordPress notifications and contact forms

Do not reuse credentials, API keys or service registrations from the legacy installation.

## Editorial release and scheduled publishing

Storm Core 0.5 adds the [Norwegian editor handbook](../wp-plugins/storm-core/BRUKSANVISNING.md),
managed public content and the reviewed season wizard. Validate against the separate
`tromsostorm-editorial-test` project before updating active private staging. It needs
a separate database, loopback port, Compose namespace and volumes, blocked mail/indexing,
blank provider credentials and no external-backup credentials/schedule.

Before release, make an external backup and preserve deployed code/configuration for
rollback. Stop Apache while replacing mounted source to avoid mixed plugin versions.
Import as drafts without `--force`, review source/current counts and activate only
the reviewed season. Source tables and historical URLs stay unchanged; production/DNS
cutover requires separate approval.

The September handover uses MyISAM for WordPress tables. Before enabling editorial
workflows, convert every `wp_` table to InnoDB; otherwise season rollback and online
`--single-transaction` backups are not safe for mutable content. Legacy `Storm*`
domain tables remain unchanged and read-only. Season activation fails closed if
the posts, postmeta or options table is not InnoDB.

After a verified external backup/restore, stop WordPress, its scheduler and recurring
backup. Run from `deploy/` on the private staging server:

```bash
python3 scripts/prepare-editorial-storage.py
python3 scripts/prepare-editorial-storage.py --execute
```

The first command only lists pending conversions. The second refuses non-staging
configuration or running application writers, converts storage engines without
changing columns/data, and compares sorted row fingerprints and exact counts for
every database table before/after. Its private verification receipt records engines
and hashes, not row content. Keep the application stopped on any failure. Take and
restore another external backup afterward, then restart WordPress, scoped cron and
recurring backup. Do not import/revert another MyISAM dump without repeating this step.

The `wordpress-cron` service runs as UID 33 and invokes
`scripts/run-editorial-cron.php` every 60 seconds. It only processes due
`publish_future_post`, `storm_core_nif_sync` and `storm_editorial_links` jobs.
The runner explicitly excludes inherited hooks rather than enabling every imported
job. Validated hook names are passed as literal WP-CLI values; shell quotes must not
be added to the in-process command string. The integration test exercises the real
runner with an unapproved first-in-list due event.
NIF still needs project-specific credentials. Browser-triggered WP-Cron stays disabled
on staging, and the mail/noindex guards also apply to CLI.

```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d wordpress-cron
docker compose -f docker-compose.yml -f docker-compose.staging.yml --profile '*' config --format json \
  | python3 scripts/test-compose-config.py
```

The profile wildcard renders configuration for validation; it does not start profiled
services. Verify a real future-dated temporary article and that an unapproved due hook
stays pending; remove exact test resources afterward. A direct cron invocation alone
does not prove background scheduling.

`scripts/test-editorial.php` exercises publication/privacy/season/expiry/API and member
behavior, including actual rollback after publication has begun, exceptions and
failed active-flag writes. It restores options/active flags and removes its exact
test records. It refuses
to run outside staging canonical port 18093. Stop the isolated scheduler while stateful
integration tests change the active season.

For exact backup/restore row-count comparisons, stop the scheduler and avoid editor/HTTP
writes during the snapshot and comparison. Resume only after verification. External
backup includes content plus the mounted active plugin/theme code.

### Verified private release, October 24, 2026

Storm Core 0.5 is installed in `tromsostorm-staging-sep23`, with active season
10713. The repeatable import created 1,721 normalized records without conflicts;
all 94 legacy domain tables retain their data. All 34 WordPress tables are InnoDB,
with identical before/after row fingerprints for all 128 database tables.
The isolated suite passed 57 editorial assertions and 12 Compose checks.

Encrypted snapshot `20261024T095324Z` was downloaded and restored separately:
all 128 table counts/engines and active code matched, and restored WordPress
rendered with staging mail/indexing safeguards. Scoped cron is running as UID 33
without host ports/restarts. Recurring backup completed its first new snapshot,
`20261024T095851Z`; interval is 86,400 seconds, external retention 35 days.
`EDITORIAL-OPERATIONS-VERIFIED.json` records the final checks on the server.
The isolated test project is stopped, with its data/evidence retained.

The later October 24 content review added Isac Angelsen, Gregor Heil and their
active-season entries, verified seven missing results, and expanded the two
Nidaros venue names. The active roster now contains 19 players and four staff.
Eight newer news items are explicitly labeled original summary **drafts**, not
complete original-article/media imports. They retain their canonical source URLs
and original dates without reusing production post IDs, which collide with
normalized staging entities. Existing content and all 94 legacy tables are
preserved. Missing staff portraits now use initials, and review-summary source
links remain on the current public site while ordinary legacy links still move
to the new site. The isolated suite passes 61 assertions, including both fixes.
See `CONTENT-REFRESH-20261024.json` on the server and `TASKS.md` section 7 for
the content audit, backup evidence and unresolved editorial approvals.
Post-refresh snapshot `20261024T103904Z` was downloaded and independently
restored: all 128 table counts/engines and active code matched, and the new
portrait matches the backup archive. Scoped cron resumed as UID 33; recurring
backup completed snapshot `20261024T104239Z`. Final checks passed at 10:45 UTC.

Only private staging was changed. Production, DNS, group access and personal
editor accounts require separate approval/setup. The data source is still the
approved September 23 handover; final production freshness remains a launch gate.

## English AI translation

The theme includes a Norwegian/English selector. Norwegian remains the canonical source.
English is translated on demand through OpenAI only after a visitor selects `EN`, and each
translated string is cached in WordPress for 90 days.

Set a newly created key in the ignored deployment `.env`:

```dotenv
OPENAI_API_KEY=...
STORM_TRANSLATION_MODEL=gpt-5-mini
```

If the key is absent or the translation service fails, the site keeps the Norwegian content
and displays a clear English status message. Never commit the key.

## NIF game synchronization

Create a new project-specific NIF client and keep its secret only in the ignored `.env` or
the production secret store:

```dotenv
NIF_CLIENT_ID=...
NIF_CLIENT_SECRET=...
NIF_ORG_ID=220005
```

Check configuration and preview changes before storing them:

```bash
docker compose run --rm wpcli storm nif status
docker compose run --rm wpcli storm nif sync
docker compose run --rm wpcli storm nif sync --execute --yes
```

The plugin stores the last valid NIF response persistently, records failure state without
logging credentials, protects manually overridden games and schedules hourly sync only after
credentials exist. New games are drafts by default. Published `storm_game` records become the
public fixture source; the legacy table remains the fallback when no normalized games are
published.

## Prepare

1. Copy `.env.example` to `.env` and set the real email, host and image versions.
2. Prepare the private import directory from the handover repository:

   ```powershell
   .\scripts\prepare-private-data.ps1 -HandoverPath C:\path\to\tromsostorm-handover
   ```

3. Fetch and unpack the media bundle. Pass both extracted directories:

   ```powershell
   .\scripts\prepare-private-data.ps1 `
     -HandoverPath C:\path\to\tromsostorm-handover `
     -MediaUploadsPath C:\path\to\media\extracted\uploads `
     -LegacyStormPath C:\path\to\media\extracted\storm-legacy
   ```

   The `/Storm/` tree is required because hundreds of historical posts link to files there.
4. Create `private\rclone\rclone.conf` with a new, rebuild-specific remote whose name matches
   `RCLONE_REMOTE`.

The generated database passwords and all copied production data remain under `private\`, which
is ignored by git.

Before uploading, read the handover's `SNAPSHOT.md` and compare the media archive's SHA256
with that snapshot. Confirm that `private/import/00-wordpress.sql` matches the handover
dump and that both `private/wp-content/uploads` and `private/storm-legacy` contain the
media from that archive. A prepared local copy is not necessarily current; obtain a fresh
handover before the final migration.
Some historical archive filenames use Latin-1 bytes rather than UTF-8. Preserve the intended
Norwegian characters when extracting; replacement characters in filenames will break old
image links. Verify file contents against the archive before repairing filename aliases,
and do not overwrite locally edited media as part of this check.
Windows can also merge distinct files such as `13.jpg` and `13.JPG`. Before publishing on
Linux, restore any missing exact-case paths from the original archive, preserving both files
and their original bytes. A differently sized local image can be a case collision rather
than an intentional edit; do not infer that it is safe to discard either original.

Upload only `deploy/` (excluding local backups and the downloaded/extracted media bundle),
`wp-theme/storm-arena/` and `wp-plugins/storm-core/`, preserving their relative layout.
Transfer the prepared private import, content, secrets and rclone configuration over SSH
separately from public code, and restrict their server-side permissions. Never upload the
administrator's SSH private key.

Use a separate, access-controlled test hostname before cutover. Do not change the live
apex or `www` DNS records. The current HTTPS configuration requests certificates for both
`SITE_HOST` and `www.SITE_HOST`; prepare both test DNS names or adapt the staging routing
before starting Traefik. Disable outgoing visitor/editor mail and keep staging out of search
indexes before importing data.

Validate the resolved configuration without printing environment secrets:

```bash
docker compose --profile tools config --quiet
docker compose --profile tools config --format json | python scripts/test-compose-config.py
```

These checks do not start containers. They validate the Compose model and check that backup
can use an outbound network while still reaching the isolated, unpublished database.
Actual external backup access and a restore drill must still pass before cutover.

### Refreshing the private staging snapshot

Import a replacement handover into a separate Compose project, database volume and
private content directory. Keep the current project's files, volumes and verified
external backup intact. Pin application images to the currently deployed digests
so the data refresh does not also upgrade WordPress, PHP or MariaDB.

For the September 23 handover, the isolated candidate is
`/home/janheier/tromsostorm-staging-sep23`; the previous project is
`/home/janheier/tromsostorm-staging`. The candidate initially binds its proxy to
`127.0.0.1:8092`, while both installations use the eventual canonical address
`http://127.0.0.1:18090` reached through SSH. Extract the original media archive on
Linux, retaining exact case and normalizing historical Latin-1 filename bytes.
Check every imported media file against its archive SHA256 and compare source-table
row counts before running the WordPress bootstrap.

Before switching, validate the new URL inventory, including stored hierarchical
permalinks for child pages, mail/indexing guards, and a real download and isolated
restore of the new encrypted external backup. Then stop the old proxy and backup,
move only the candidate proxy's loopback binding from 8092 to 8090, and recreate
that proxy. Keep the canonical URL and SSH tunnel unchanged. Stop the remaining
old services after successful verification; do not remove their containers or
volumes. Production DNS, public ports and the live website are outside this switch.

To roll back after this private switch, stop the candidate's proxy and backup
first, then start `db`, `wordpress`, `legacy-static`, `staging-proxy` and `backup`
in the previous project using both Compose files. Its original 8090 binding is
retained. Recheck the private site and administrator login. Do not run the two
backup schedules simultaneously or use `down --volumes` as part of rollback.
Server-local `HANDOVER-IMPORT.json`, `SOURCE-VERIFIED.json`,
`IMPORTED-DATA-VERIFIED.json`, `URLS-VERIFIED.json`, `RESTORE-VERIFIED.json` and
`DEPLOYMENT-VERIFIED.json` record the completed validation phases; a missing receipt
must not be treated as a passed check.

## Temporary encrypted OneDrive backup

A personal OneDrive account can be used as a temporary destination after the account owner
approves the OAuth consent. Rclone's OneDrive permissions can cover more than the backup
folder; a folder path is not an account-level permission boundary. Do not browse or operate
on the account root. Move to club-controlled storage when it becomes available.

Use two project-specific remotes in the ignored `private/rclone/rclone.conf`:

1. `storm-onedrive`: a new `onedrive` remote, authorized interactively by the account owner.
   Select the intended personal drive. Never paste OAuth tokens or account passwords into
   chat, commands, logs or tracked files.
2. `tromsostorm-backups`: a `crypt` remote whose backing path is
   `storm-onedrive:TromsoStorm-backup`. Enable standard filename encryption and directory
   name encryption. Generate a new strong encryption password and salt, and save both in
   an independent password manager before uploading real data.

Configure these with a local rclone installation and its interactive wizard:

```powershell
rclone config --config .\private\rclone\rclone.conf
```

Set `RCLONE_REMOTE=tromsostorm-backups` and `RCLONE_PATH=tromsostorm` in `.env`. Never point the
backup job at the unencrypted `storm-onedrive` remote. The existing daily schedule and 35-day
retention then apply only within the encrypted backup path.

The backup container needs write access to the **configuration directory** so OAuth refresh
tokens can be saved across restarts. Keep that directory restricted to the deployment owner
on the server (directory mode 700, config mode 600), and do not mount it into WordPress.
Upload only `private/rclone/rclone.conf` from the local configuration directory; do not
upload intermediate authorization state, old configuration copies or recovery-key files.
The crypt password and salt in this config are only obscured, not securely encrypted at rest;
protect the config as a secret and do not use it as the only recovery copy of the keys.

Before the first real backup, upload and download an innocuous test file through the crypt
remote and compare its SHA256. Confirm available OneDrive capacity, then perform a real
backup and restore drill. The job is not ready merely because the OAuth login succeeded.
Until these checks pass, keep the existing site untouched.

## Private staging over SSH

`docker-compose.staging.yml` overlays the production model without changing production
routing. It disables Traefik routing and exposes only the staging proxy on
`127.0.0.1:8090` on the server. The proxy also routes `/Storm/` to the static archive.
Use a distinct project directory and project network, fresh database passwords and a
staging-only `.env`. Do not upload the local `.env` or copy production service credentials.
Protect the project root and `private/` with mode 700. Inside that protected tree, the
mounted import directory needs mode 755 and its SQL file mode 644 so MariaDB's non-root
entrypoint can read it. Database password files also need container-readable permissions;
keep their host parent directory private. Keep the rclone directory at 700 and config at 600.

Set `SITE_URL=http://127.0.0.1:18090`, `TRAEFIK_NETWORK=tromsostorm-staging-web` and
`RCLONE_PATH=tromsostorm-staging`. The overlay clears NIF and translation credentials.
A staging-only must-use plugin blocks `wp_mail()` and forces search indexing off; PHP's
sendmail command is also disabled. WP-Cron is disabled. Do not connect real SMTP services.
The staging health check uses PHP's short WordPress bootstrap and `SELECT 1`, not the
login page. This checks PHP/database availability without repeatedly loading plugin hooks
that can create temporary files during a content backup. The health script is blocked
at the staging proxy and is available only to the container's own health check.

From the uploaded `deploy` directory:

```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml --profile tools --profile backup --profile production config --quiet
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d db wordpress legacy-static staging-proxy
docker compose -f docker-compose.yml -f docker-compose.staging.yml run --rm --entrypoint /bin/sh wpcli /bootstrap/bootstrap-wordpress.sh
```

Run `scripts/test-compose-config.py` against the resolved JSON model with all profiles
enabled before starting services. The tests verify localhost-only ports, disabled proxy
routing, staging safeguards and explicit backup startup in addition to backup connectivity.
Create a fresh staging administrator; all imported passwords are intentionally unusable.

Open an SSH tunnel from the administrator's PC, keeping host-key verification enabled:

```powershell
ssh -N -L 127.0.0.1:18090:127.0.0.1:8090 -i C:\path\to\private-key janheier@SERVER_IP
```

Open `http://127.0.0.1:18090` while the tunnel is running. The loopback HTTP connection is
carried over SSH; do not bind the web port or tunnel to all interfaces. No DNS change or
public certificate is required for this private staging mode.

### Password-protected group review

Verified October 25, 2026: `https://storm.janinc.no/` runs this configuration
in project `tromsostorm-staging-sep23`. Both `https://janinc.no/storm` and
`https://janinc.no/storm/` return a temporary, non-cacheable redirect there.
Only the test subdomain's DNS was added; the production domain is unchanged.
Personal Editor access and eight real Edge checks passed, including unauthorized
media/API/archive access, secure login, handbook, mobile layout and English favicon.
This is technical verification, not the editor's own acceptance test.

`docker-compose.review.yml` is an opt-in third overlay for the real WordPress
test site. It keeps staging's blocked mail, `noindex`, blank provider keys and
scoped scheduler, but adds a host-specific HTTPS route through Traefik. Basic
authentication protects every path, including uploads, the historical archive,
REST and wp-admin. Personal review passwords are separate from SSH credentials;
WordPress editing additionally requires a personal Editor account.

Before enabling it, obtain approval for the test hostname and DNS, take an
external backup, preserve configuration/code for rollback, and verify ports
80/443 with the hosting provider. Set `REVIEW_HOST=storm.janinc.no` in the
private deployment environment. Configure a real certificate contact email.
Create `private/secrets/review_users` with one `username:bcrypt-hash` per
reviewer and restrict its permissions; never put passwords or hashes in labels,
Git, command arguments or chat. Keep recovery credentials in private storage.

Always select the correct Compose project explicitly, especially in isolated
tests. Render and test both the original private configuration and this overlay:

```bash
docker compose -p YOUR_STAGING_PROJECT \
  -f docker-compose.yml -f docker-compose.staging.yml -f docker-compose.review.yml \
  --profile '*' config --format json | python3 scripts/test-compose-config.py
docker compose -p YOUR_STAGING_PROJECT \
  -f docker-compose.yml -f docker-compose.staging.yml -f docker-compose.review.yml \
  up -d db wordpress legacy-static staging-proxy wordpress-cron traefik
```

The canonical URL becomes `https://REVIEW_HOST`; the old loopback entry may
redirect there. Use all three files for subsequent application, scheduler and
backup commands. Confirm a trusted certificate, denied anonymous/incorrect-password
requests to pages/media/API/admin, successful authorized access, secure editor
login, and continued mail/indexing safeguards before sharing the link.
`janinc.no/storm/` can then redirect to this hostname; it is not an authentication
boundary or a transparent proxy. Keep the existing production domain untouched.

After bootstrap and validation, run the first backup explicitly:

```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml run --rm -e BACKUP_RUN_ONCE=1 backup
```

After building the backup image, its archive retry checks can be run on the Linux server
with `python3 scripts/test-backup.py`. They use fake database/storage commands in isolated,
network-disabled containers; they never access real credentials or external storage.

Download that exact snapshot through the crypt remote and restore its database into a
separate Docker volume and network. Check the archive checksums and recovered tables;
never import a restore drill into the running site's database. Only start the recurring
backup service after the initial backup and restore checks have passed.

## First start

Run this before DNS is changed:

```bash
docker compose --profile tools config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --no-color --tail=100 wordpress db backup
```

The SQL import runs only when the MariaDB volume is empty. To deliberately reseed a disposable
staging instance, stop it and remove only this project's database volume before starting again.
Never remove the production volume as a routine deployment step.

Use the isolated WP-CLI service for administrative operations instead of editing the database
by hand:

```bash
docker compose run --rm wpcli core update-db
docker compose run --rm wpcli plugin list
docker compose run --rm wpcli rewrite flush --hard
```

After the first database import, run the idempotent bootstrap:

```bash
docker compose run --rm wpcli --path=/var/www/html eval 'echo "WP-CLI ready\n";'
docker compose run --rm --entrypoint /bin/sh wpcli /bootstrap/bootstrap-wordpress.sh
```

## Required pre-cutover checks

1. Restore the latest external backup into an isolated test stack.
2. Compare every path in the handover's `data/urls/url-inventory.csv` with the staging site.
3. Confirm Norwegian text after removing legacy `utf8_encode()`/`utf8_decode()` compensation.
4. Confirm the apex certificate, `www` redirect, HSTS header and historical image redirect.
5. Run a final handover sync immediately before the migration freeze and import that snapshot.
6. Create fresh registrations for every external service used by the new site.
7. Verify representative `/Storm/` images and PDFs; requests for legacy `.php` and `.inc`
   files must return 404 rather than execute old code.

DNS and the production certificate cutover remain owner-operated because those credentials are
not part of the handover.

Run the URL comparison with:

```bash
python deploy/scripts/verify-urls.py \
  /path/to/tromsostorm-handover/data/urls/url-inventory.csv \
  https://staging.tromsostorm.no \
  --output url-verification.csv
```

The command exits non-zero for network errors, HTTP responses outside the 2xx/3xx range, or
redirects away from an inventory path. Use `--allow-redirects` only for diagnostic runs where
redirects are intentionally accepted.

After URL verification, crawl the rendered pages and validate referenced uploads and historical
media. Use the dedicated local legacy-static port when testing without Traefik:

```bash
python deploy/scripts/verify-media.py \
  /path/to/tromsostorm-handover/data/urls/url-inventory.csv \
  http://127.0.0.1:8090 \
  --legacy-base-url http://127.0.0.1:8091 \
  --output media-verification.csv
```

The media verifier treats referenced legacy `.php`, `.inc` and CGI-style files as safe only
when the historical static service rejects them.
