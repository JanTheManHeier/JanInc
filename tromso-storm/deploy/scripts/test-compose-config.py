#!/usr/bin/env python3
import json
import sys
import unittest
from urllib.parse import urlsplit


class BackupNetworkTests(unittest.TestCase):
    def test_backup_has_outbound_connectivity(self):
        networks = CONFIG["networks"]
        attached = CONFIG["services"]["backup"]["networks"]
        self.assertTrue(
            any(not networks[name].get("internal", False) for name in attached),
            "Backup needs an outbound network to reach external rclone storage.",
        )

    def test_backup_can_reach_database_privately(self):
        services = CONFIG["services"]
        shared = set(services["backup"]["networks"]) & set(services["db"]["networks"])
        self.assertTrue(
            any(CONFIG["networks"][name].get("internal", False) for name in shared),
            "Backup must retain a private connection to MariaDB.",
        )

    def test_database_remains_isolated(self):
        database = CONFIG["services"]["db"]
        self.assertTrue(database["networks"])
        self.assertTrue(
            all(CONFIG["networks"][name].get("internal", False) for name in database["networks"]),
            "MariaDB must not join an outbound network.",
        )
        self.assertFalse(database.get("ports"), "MariaDB must not publish a host port.")

    def test_backup_remains_separate_from_web(self):
        services = CONFIG["services"]
        self.assertFalse(
            set(services["backup"]["networks"]) & set(services["traefik"]["networks"]),
            "Backup must not join the public-facing proxy network.",
        )
        self.assertFalse(services["backup"].get("ports"))

    def test_backup_can_persist_oauth_token_refresh(self):
        mounts = [
            mount
            for mount in CONFIG["services"]["backup"]["volumes"]
            if mount["target"] == "/config/rclone"
        ]
        self.assertEqual(len(mounts), 1)
        self.assertEqual(mounts[0]["type"], "bind")
        self.assertFalse(
            mounts[0].get("read_only", False),
            "OAuth storage needs a writable config directory to save refreshed tokens.",
        )

    def test_backup_includes_the_active_mounted_theme_and_plugin(self):
        services = CONFIG["services"]
        wordpress_mounts = {mount["target"]: mount for mount in services["wordpress"]["volumes"]}
        backup_mounts = {mount["target"]: mount for mount in services["backup"]["volumes"]}
        for relative in ("themes/storm-arena", "plugins/storm-core"):
            active = wordpress_mounts[f"/var/www/html/wp-content/{relative}"]
            backup = backup_mounts[f"/source/wp-content/{relative}"]
            self.assertEqual(backup["source"], active["source"])
            self.assertTrue(backup.get("read_only"))


class StagingIsolationTests(unittest.TestCase):
    def setUp(self):
        if "staging-proxy" not in CONFIG["services"]:
            self.skipTest("Staging override is not included.")

    def test_only_loopback_ports_are_published(self):
        review = "storm-review" in CONFIG["services"]["staging-proxy"].get("labels", {}).get(
            "traefik.http.routers.storm-review.service", ""
        )
        ports = []
        for name, service in CONFIG["services"].items():
            if review and name == "traefik":
                self.assertEqual(
                    {int(port["published"]) for port in service.get("ports", [])},
                    {80, 443},
                )
                continue
            ports.extend(service.get("ports", []))
        self.assertTrue(ports)
        self.assertTrue(all(port.get("host_ip") == "127.0.0.1" for port in ports))

    def test_staging_is_not_routed_by_traefik(self):
        services = CONFIG["services"]
        self.assertTrue(services["traefik"].get("profiles"))
        for name in ("wordpress", "legacy-static"):
            self.assertFalse(services[name].get("labels"))

    def test_staging_mail_and_indexing_safeguards_are_mounted(self):
        for name in ("wordpress", "wpcli", "wordpress-cron"):
            mounts = {mount["target"]: mount for mount in CONFIG["services"][name]["volumes"]}
            for target in (
                "/var/www/html/wp-content/mu-plugins/storm-staging-safety.php",
                "/usr/local/etc/php/conf.d/storm-staging.ini",
            ):
                self.assertTrue(mounts[target].get("read_only"))
            environment = CONFIG["services"][name]["environment"]
            url = urlsplit(environment["SITE_URL"])
            review_labels = CONFIG["services"]["staging-proxy"].get("labels", {})
            if "traefik.http.routers.storm-review.rule" in review_labels:
                self.assertEqual(url.scheme, "https")
                self.assertEqual(
                    review_labels["traefik.http.routers.storm-review.rule"],
                    f"Host(`{url.hostname}`)",
                )
                self.assertIn("define('FORCE_SSL_ADMIN', true)", environment["WORDPRESS_CONFIG_EXTRA"])
            else:
                self.assertEqual(url.scheme, "http")
                self.assertEqual(url.hostname, "127.0.0.1")
            for key in ("OPENAI_API_KEY", "NIF_CLIENT_ID", "NIF_CLIENT_SECRET"):
                self.assertFalse(environment.get(key))

    def test_scheduler_has_no_public_port_and_runs_as_wordpress_user(self):
        cron = CONFIG["services"]["wordpress-cron"]
        self.assertFalse(cron.get("ports"))
        self.assertEqual(cron["user"], "33:33")
        self.assertIn("eval-file /bootstrap/run-editorial-cron.php", " ".join(cron["command"]))
        self.assertIn("sleep 60", " ".join(cron["command"]))

    def test_backup_requires_explicit_start(self):
        self.assertTrue(CONFIG["services"]["backup"].get("profiles"))

    def test_staging_health_does_not_load_the_login_page(self):
        service = CONFIG["services"]["wordpress"]
        command = " ".join(service["healthcheck"]["test"])
        self.assertIn("/storm-staging-health.php", command)
        self.assertNotIn("/wp-login.php", command)
        mounts = {mount["target"]: mount for mount in service["volumes"]}
        self.assertTrue(mounts["/var/www/html/storm-staging-health.php"]["read_only"])


class ReviewAccessTests(unittest.TestCase):
    def setUp(self):
        self.labels = CONFIG["services"].get("staging-proxy", {}).get("labels", {})
        if "traefik.http.routers.storm-review.rule" not in self.labels:
            self.skipTest("Review override is not included.")

    def test_all_review_paths_require_authentication_and_tls(self):
        rule = self.labels["traefik.http.routers.storm-review.rule"]
        self.assertTrue(rule.startswith("Host(`"))
        self.assertNotIn("Path", rule)
        self.assertEqual(self.labels["traefik.http.routers.storm-review.tls"], "true")
        self.assertEqual(self.labels["traefik.http.routers.storm-review.entrypoints"], "websecure")
        self.assertEqual(
            self.labels["traefik.http.routers.storm-review.middlewares"],
            "storm-review-headers,storm-review-auth",
        )
        self.assertEqual(
            self.labels["traefik.http.middlewares.storm-review-auth.basicauth.removeheader"],
            "true",
        )

    def test_review_credentials_are_file_backed(self):
        self.assertEqual(
            self.labels["traefik.http.middlewares.storm-review-auth.basicauth.usersfile"],
            "/run/secrets/review_users",
        )
        self.assertNotIn("traefik.http.middlewares.storm-review-auth.basicauth.users", self.labels)
        secrets = CONFIG["services"]["traefik"]["secrets"]
        self.assertTrue(any(secret["source"] == "review_users" for secret in secrets))
        self.assertTrue(CONFIG["secrets"]["review_users"]["file"].endswith("/private/secrets/review_users"))

    def test_authenticated_content_is_not_shared_cached_or_indexed(self):
        self.assertEqual(
            self.labels["traefik.http.middlewares.storm-review-headers.headers.customresponseheaders.Cache-Control"],
            "private, no-store",
        )
        self.assertIn(
            "noindex",
            self.labels["traefik.http.middlewares.storm-review-headers.headers.customresponseheaders.X-Robots-Tag"],
        )


if __name__ == "__main__":
    CONFIG = json.load(sys.stdin)
    unittest.main()
