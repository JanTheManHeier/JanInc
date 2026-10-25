#!/usr/bin/env python3
import os
import subprocess
import tempfile
import unittest
from pathlib import Path


class BackupArchiveTests(unittest.TestCase):
    def run_backup(self, behavior):
        with tempfile.TemporaryDirectory(prefix="storm-backup-test-") as directory:
            root = Path(directory)
            for name in ("commands", "state", "backups", "config"):
                (root / name).mkdir()
            (root / "config" / "rclone.conf").write_text("[test]\ntype = local\n")
            (root / "password").write_text("test-only-not-a-real-password")
            commands = {
                "mariadb-dump": "#!/bin/sh\nprintf 'SELECT 1;\\n'\n",
                "rclone": '#!/bin/sh\nif [ "$1" = copy ]; then touch /state/uploaded; fi\n',
                "tar": r"""#!/bin/sh
count=0
test ! -f /state/attempts || count="$(cat /state/attempts)"
count=$((count + 1))
echo "$count" >/state/attempts
case "$FAKE_TAR_BEHAVIOR" in
    fatal) exit 2 ;;
    changing) exit 1 ;;
    transient) test "$count" -gt 1 || exit 1 ;;
esac
while [ "$#" -gt 0 ]; do
    if [ "$1" = -czf ]; then shift; printf 'test archive' >"$1"; exit 0; fi
    shift
done
exit 2
""",
            }
            for name, contents in commands.items():
                path = root / "commands" / name
                path.write_text(contents)
                path.chmod(0o755)
            image = os.environ.get("STORM_BACKUP_TEST_IMAGE", "tromsostorm-staging-backup")
            command = [
                "docker", "run", "--rm", "--network", "none",
                "--user", f"{os.getuid()}:{os.getgid()}",
                "--mount", f"type=bind,src={root / 'commands'},dst=/test-commands,readonly",
                "--mount", f"type=bind,src={root / 'state'},dst=/state",
                "--mount", f"type=bind,src={root / 'backups'},dst=/backups",
                "--mount", f"type=bind,src={root / 'config'},dst=/config/rclone,readonly",
                "--mount", f"type=bind,src={root / 'password'},dst=/test-password,readonly",
                "--mount", f"type=bind,src={Path(__file__).resolve().parent.parent / 'backup' / 'backup.sh'},dst=/test-backup.sh,readonly",
                "-e", "PATH=/test-commands:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "-e", "DB_HOST=test", "-e", "DB_NAME=test", "-e", "DB_USER=test",
                "-e", "DB_PASSWORD_FILE=/test-password", "-e", "BACKUP_RUN_ONCE=1",
                "-e", "RCLONE_REMOTE=test", "-e", "RCLONE_PATH=test",
                "-e", f"FAKE_TAR_BEHAVIOR={behavior}",
                "--entrypoint", "/bin/sh", image, "/test-backup.sh",
            ]
            result = subprocess.run(command, capture_output=True, text=True, timeout=45)
            attempts = int((root / "state" / "attempts").read_text())
            uploaded = (root / "state" / "uploaded").exists()
            return result, attempts, uploaded

    def test_transient_change_is_retried_before_upload(self):
        result, attempts, uploaded = self.run_backup("transient")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(attempts, 2)
        self.assertTrue(uploaded)

    def test_continuously_changing_content_is_not_uploaded(self):
        result, attempts, uploaded = self.run_backup("changing")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(attempts, 3)
        self.assertFalse(uploaded)

    def test_fatal_archive_error_is_not_retried_or_uploaded(self):
        result, attempts, uploaded = self.run_backup("fatal")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(attempts, 1)
        self.assertFalse(uploaded)


if __name__ == "__main__":
    unittest.main()
