<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Admin
{
    public static function register_menu(): void
    {
        add_menu_page(
            'Tromsø Storm',
            'Storm',
            'edit_storm_records',
            'storm-club',
            array(__CLASS__, 'render_dashboard'),
            'dashicons-shield-alt',
            20
        );
    }

    public static function render_dashboard(): void
    {
        if (!current_user_can('edit_storm_records')) {
            wp_die(esc_html__('Du har ikke tilgang til denne siden.', 'storm-core'));
        }

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Tromsø Storm', 'storm-core') . '</h1>';
        echo '<p>' . esc_html__('Her administreres klubbens sesonger, kamper, personer, sponsorer, treningstider og kuraterte SOME-innlegg.', 'storm-core') . '</p>';
        echo '<table class="widefat striped" style="max-width: 760px"><thead><tr>';
        echo '<th>' . esc_html__('Innholdstype', 'storm-core') . '</th>';
        echo '<th>' . esc_html__('Antall', 'storm-core') . '</th>';
        echo '<th>' . esc_html__('Administrasjon', 'storm-core') . '</th>';
        echo '</tr></thead><tbody>';

        foreach (Storm_Core_Post_Types::definitions() as $post_type => $definition) {
            $counts = wp_count_posts($post_type);
            $total = 0;
            if ($counts instanceof stdClass) {
                foreach (get_object_vars($counts) as $status => $count) {
                    if ($status !== 'trash') {
                        $total += (int) $count;
                    }
                }
            }

            $url = admin_url('edit.php?post_type=' . rawurlencode($post_type));
            echo '<tr>';
            echo '<td>' . esc_html($definition['plural']) . '</td>';
            echo '<td>' . esc_html((string) $total) . '</td>';
            echo '<td><a href="' . esc_url($url) . '">' . esc_html__('Åpne', 'storm-core') . '</a></td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
        echo '<p><strong>' . esc_html__('Datamodell:', 'storm-core') . '</strong> ' . esc_html(STORM_CORE_SCHEMA_VERSION) . '</p>';
        echo '</div>';
    }

    public static function render_schema_notice(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $installed = (string) get_option('storm_core_schema_version', '');
        if ($installed === STORM_CORE_SCHEMA_VERSION) {
            return;
        }

        echo '<div class="notice notice-warning"><p>';
        echo esc_html__('Storm Core-datamodellen er endret. Deaktiver og aktiver pluginen på nytt før innhold importeres.', 'storm-core');
        echo '</p></div>';
    }
}
