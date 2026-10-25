<?php
/**
 * Plugin Name: Storm Core
 * Description: Owns Tromsø Storm's seasons, games, people, sponsors, training times and curated social content.
 * Version: 0.5.0
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author: Tromsø Storm
 * Text Domain: storm-core
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('STORM_CORE_VERSION', '0.5.0');
define('STORM_CORE_SCHEMA_VERSION', '3');
define('STORM_CORE_FILE', __FILE__);
define('STORM_CORE_PATH', plugin_dir_path(__FILE__));

require_once STORM_CORE_PATH . 'includes/class-storm-core-post-types.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-meta.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-fields.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-admin.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-migration.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-nif.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-plugin.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-content.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-seasons.php';
require_once STORM_CORE_PATH . 'includes/class-storm-core-editorial.php';

register_activation_hook(STORM_CORE_FILE, array('Storm_Core_Plugin', 'activate'));
register_deactivation_hook(STORM_CORE_FILE, array('Storm_Core_Plugin', 'deactivate'));

Storm_Core_Plugin::boot();
