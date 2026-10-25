<?php
/**
 * Plugin Name: Storm staging safety
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('pre_wp_mail', '__return_false', PHP_INT_MAX);
add_filter('pre_option_blog_public', '__return_zero', PHP_INT_MAX);
