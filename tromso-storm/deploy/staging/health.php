<?php

define('SHORTINIT', true);
require __DIR__ . '/wp-load.php';

global $wpdb;

if (!$wpdb || (string) $wpdb->get_var('SELECT 1') !== '1') {
    http_response_code(503);
    exit;
}

header('Content-Type: text/plain; charset=utf-8');
echo "ok\n";
