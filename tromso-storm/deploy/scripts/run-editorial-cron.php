<?php

if (!defined('ABSPATH') || !defined('WP_CLI') || !WP_CLI) {
    throw new RuntimeException('This job must run through WP-CLI.');
}

// Limit this scheduler to reviewed jobs rather than inherited plugin work.
$allowed = array('publish_future_post', 'storm_core_nif_sync', 'storm_editorial_links');
$excluded = array();
foreach ((array) _get_cron_array() as $hooks) {
    foreach (array_keys($hooks) as $hook) {
        if (in_array($hook, $allowed, true)) {
            continue;
        }
        if (!preg_match('/^[a-zA-Z0-9_.:\/-]+$/', $hook)) {
            throw new RuntimeException('An inherited cron hook cannot be excluded safely; scheduler stopped.');
        }
        $excluded[$hook] = true;
    }
}

$command = 'cron event run --due-now --quiet';
if ($excluded) {
    $command .= ' --exclude=' . implode(',', array_keys($excluded));
}
WP_CLI::runcommand($command, array('launch' => false));
