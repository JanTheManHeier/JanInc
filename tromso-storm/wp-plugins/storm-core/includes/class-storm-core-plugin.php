<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Plugin
{
    public static function boot(): void
    {
        if (defined('WP_CLI') && WP_CLI) {
            Storm_Core_Migration::register_command();
            Storm_Core_Nif::register_command();
        }

        add_action('init', array(__CLASS__, 'maybe_upgrade'), 1);
        Storm_Core_Nif::register_hooks();
        add_action('init', array('Storm_Core_Post_Types', 'register'));
        add_action('init', array('Storm_Core_Meta', 'register'), 20);
        add_action('add_meta_boxes', array('Storm_Core_Fields', 'register_meta_boxes'));
        add_action('save_post', array('Storm_Core_Fields', 'save'), 10, 2);
        add_action('admin_enqueue_scripts', array('Storm_Core_Fields', 'enqueue_assets'));
        add_action('admin_notices', array('Storm_Core_Fields', 'render_validation_notice'));
        add_action('admin_menu', array('Storm_Core_Admin', 'register_menu'));
        add_action('admin_notices', array('Storm_Core_Admin', 'render_schema_notice'));
        Storm_Core_Seasons::register_hooks();
        Storm_Core_Editorial::register_hooks();
    }

    public static function activate(): void
    {
        Storm_Core_Post_Types::register();
        Storm_Core_Meta::register();

        update_option('storm_core_schema_version', STORM_CORE_SCHEMA_VERSION, true);
        update_option('storm_core_plugin_version', STORM_CORE_VERSION, true);
        self::grant_capabilities();
        Storm_Core_Nif::maybe_schedule();
        flush_rewrite_rules();
    }

    public static function deactivate(): void
    {
        Storm_Core_Nif::unschedule();
        wp_clear_scheduled_hook('storm_editorial_links');
        flush_rewrite_rules();
    }

    public static function maybe_upgrade(): void
    {
        if ((string) get_option('storm_core_plugin_version', '') === STORM_CORE_VERSION) {
            return;
        }

        self::grant_capabilities();
        update_option('storm_core_plugin_version', STORM_CORE_VERSION, true);
        update_option('storm_core_schema_version', STORM_CORE_SCHEMA_VERSION, true);
    }

    private static function grant_capabilities(): void
    {
        $capabilities = array(
            'edit_storm_records',
            'edit_others_storm_records',
            'edit_private_storm_records',
            'edit_published_storm_records',
            'publish_storm_records',
            'read_private_storm_records',
            'delete_storm_records',
            'delete_private_storm_records',
            'delete_published_storm_records',
            'delete_others_storm_records',
        );

        foreach (array('administrator', 'editor') as $role_name) {
            $role = get_role($role_name);
            if (!$role) {
                continue;
            }

            foreach ($capabilities as $capability) {
                $role->add_cap($capability);
            }
        }
    }
}
