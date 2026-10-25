#!/bin/sh
set -eu

wp_cmd() {
    wp --path=/var/www/html --skip-plugins --skip-themes "$@"
}

echo "Updating the WordPress database"
wp_cmd core update-db

echo "Removing references to plugins that are not present"
wp_cmd eval '
$active = get_option("active_plugins", array());
$installed = array_values(array_filter($active, static function ($plugin) {
    return is_string($plugin) && is_file(WP_PLUGIN_DIR . "/" . $plugin);
}));
update_option("active_plugins", $installed);
'

for plugin in captcha akismet; do
    if wp_cmd plugin is-active "$plugin"; then
        echo "Deactivating $plugin until a supported replacement or fresh registration is configured"
        wp_cmd plugin deactivate "$plugin"
    fi
done

echo "Applying canonical site settings"
wp_cmd option update blogname "Tromsø Storm"
wp_cmd option update blogdescription "uvær fra nord"
wp_cmd option update show_on_front posts
wp_cmd option update page_on_front 0
wp_cmd option update page_for_posts 0
wp_cmd option update posts_per_page 5
wp_cmd option update timezone_string "Europe/Oslo"
wp_cmd option update uploads_use_yearmonth_folders 1
wp_cmd rewrite structure '/%year%/%monthnum%/%day%/%postname%/' --hard

echo "Installing supported editorial plugins"
wp_cmd plugin install all-in-one-seo-pack --force
wp_cmd plugin install classic-editor --force
wp_cmd plugin install classic-widgets --force
wp_cmd plugin activate storm-core all-in-one-seo-pack classic-editor classic-widgets

echo "Activating storm-arena theme"
wp_cmd theme activate storm-arena
wp_cmd eval-file /bootstrap/migrate-core-pages.php
wp_cmd rewrite flush --hard

echo "WordPress bootstrap completed"
