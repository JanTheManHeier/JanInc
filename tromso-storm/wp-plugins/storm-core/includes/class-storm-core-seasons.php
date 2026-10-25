<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Seasons
{
    private const COPY_TYPES = array('storm_roster_entry', 'storm_sponsor_deal', 'storm_training');
    private const SEASON_TYPES = array('storm_roster_entry', 'storm_sponsor_deal', 'storm_training', 'storm_game');

    public static function register_hooks(): void
    {
        add_action('admin_menu', static function (): void {
            add_submenu_page('storm-club', 'Sesongskifte', 'Sesongskifte', 'publish_storm_records', 'storm-seasons', array(__CLASS__, 'render'));
        });
        add_action('admin_post_storm_season_prepare', array(__CLASS__, 'handle_prepare'));
        add_action('admin_post_storm_season_activate', array(__CLASS__, 'handle_activate'));
        add_action('admin_post_storm_season_nif', array(__CLASS__, 'handle_nif'));
    }

    private static function permitted(): bool
    {
        return current_user_can('publish_storm_records') && current_user_can('edit_others_storm_records');
    }

    private static function lock(): bool
    {
        global $wpdb;
        return (int) $wpdb->get_var($wpdb->prepare(
            'SELECT GET_LOCK(%s, 0)', 'storm_season_' . md5(DB_NAME . $wpdb->prefix)
        )) === 1;
    }

    private static function unlock(): void
    {
        global $wpdb;
        $wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)', 'storm_season_' . md5(DB_NAME . $wpdb->prefix)));
    }

    private static function transactional_storage(): bool
    {
        global $wpdb;
        foreach (array($wpdb->posts, $wpdb->postmeta, $wpdb->options) as $table) {
            $engine = $wpdb->get_var($wpdb->prepare(
                'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s',
                $table
            ));
            if (strtolower((string) $engine) !== 'innodb') {
                return false;
            }
        }
        return true;
    }

    public static function prepare(int $source, int $year, array $copy_types): int|WP_Error
    {
        if (!self::permitted()) {
            return new WP_Error('storm_forbidden', 'Du har ikke tilgang til sesongskifte.');
        }
        if ($year < 1900 || $year > 2200 || ($source && (get_post_type($source) !== 'storm_season' || !current_user_can('edit_post', $source)))) {
            return new WP_Error('storm_season', 'Velg gyldig sesong og startår.');
        }
        if (!self::lock()) {
            return new WP_Error('storm_busy', 'Et annet sesongskifte pågår. Prøv igjen når det er ferdig.');
        }
        try {
            $existing = get_posts(array(
                'post_type' => 'storm_season', 'post_status' => array('draft', 'publish', 'pending', 'private'),
                'posts_per_page' => 2, 'meta_key' => 'storm_season_start_year', 'meta_value' => $year,
            ));
            if ($existing && (count($existing) !== 1 || !metadata_exists('post', $existing[0]->ID, '_storm_prepared_from')
                || (int) get_post_meta($existing[0]->ID, '_storm_prepared_from', true) !== $source
                || $existing[0]->post_status !== 'draft')) {
                return new WP_Error('storm_exists', 'Dette sesongåret finnes allerede. Åpne den eksisterende sesongen.');
            }
            $id = $existing ? $existing[0]->ID : wp_insert_post(array(
                'post_type' => 'storm_season', 'post_status' => 'draft',
                'post_title' => sprintf('%d/%d', $year, $year + 1),
                'meta_input' => array(
                    'storm_season_start_year' => $year, 'storm_season_end_year' => $year + 1,
                    'storm_season_starts_at' => $year . '-07-01', 'storm_season_ends_at' => ($year + 1) . '-06-30',
                    'storm_is_active' => false, '_storm_prepared_from' => $source,
                ),
            ), true);
            if (is_wp_error($id)) {
                return $id;
            }
            foreach (array_intersect(self::COPY_TYPES, $copy_types) as $type) {
                $records = get_posts(array(
                    'post_type' => $type, 'post_status' => 'publish', 'posts_per_page' => -1,
                    'meta_key' => 'storm_season_id', 'meta_value' => $source,
                ));
                foreach ($records as $record) {
                    $key = $record->ID . ':' . $id;
                    if (get_posts(array('post_type' => $type, 'post_status' => array('draft', 'publish', 'pending', 'private'), 'meta_key' => '_storm_copy_key', 'meta_value' => $key, 'posts_per_page' => 1))) {
                        continue;
                    }
                    $meta = array('_storm_copy_key' => $key, 'storm_season_id' => $id);
                    foreach (Storm_Core_Meta::definitions()[$type] as $name => $definition) {
                        if ($name !== 'storm_season_id' && metadata_exists('post', $record->ID, $name)) {
                            $meta[$name] = get_post_meta($record->ID, $name, true);
                        }
                    }
                    unset($meta['storm_valid_from'], $meta['storm_valid_to']);
                    $copied = wp_insert_post(array(
                        'post_type' => $type, 'post_status' => 'draft',
                        'post_title' => $record->post_title . ' — ' . get_the_title($id),
                        'post_content' => $record->post_content, 'meta_input' => $meta,
                    ), true);
                    if (is_wp_error($copied)) {
                        return $copied;
                    }
                }
            }
            return (int) $id;
        } finally {
            self::unlock();
        }
    }

    public static function activate(int $id): true|WP_Error
    {
        if (!self::permitted() || !current_user_can('edit_post', $id)) {
            return new WP_Error('storm_forbidden', 'Du har ikke tilgang til å aktivere denne sesongen.');
        }
        if (get_post_type($id) !== 'storm_season' || !in_array(get_post_status($id), array('draft', 'pending', 'publish'), true)) {
            return new WP_Error('storm_season', 'Velg en gyldig sesong.');
        }
        if (!self::transactional_storage()) {
            return new WP_Error('storm_storage', 'Sesongskifte krever InnoDB for WordPress-tabellene. Kontakt teknisk ansvarlig før aktivering.');
        }
        if (!self::lock()) {
            return new WP_Error('storm_busy', 'Et annet sesongskifte pågår. Prøv igjen når det er ferdig.');
        }
        global $wpdb;
        $ids = array($id);
        $seasons = array();
        $transaction_open = false;
        try {
            $records = get_posts(array(
                'post_type' => self::SEASON_TYPES, 'post_status' => array('draft', 'pending', 'publish'),
                'posts_per_page' => -1, 'meta_key' => 'storm_season_id', 'meta_value' => $id,
            ));
            foreach ($records as $record) {
                $ids[] = $record->ID;
                $relation = $record->post_type === 'storm_roster_entry' ? 'storm_person_id'
                    : ($record->post_type === 'storm_sponsor_deal' ? 'storm_sponsor_id' : '');
                if ($relation !== '') {
                    $ids[] = (int) get_post_meta($record->ID, $relation, true);
                }
            }
            $ids = array_values(array_unique($ids));
            foreach ($ids as $post_id) {
                if (!current_user_can('edit_post', $post_id) || !in_array(get_post_status($post_id), array('draft', 'pending', 'publish'), true)) {
                    return new WP_Error('storm_private', 'En tilknyttet profil er privat, slettet eller ikke tilgjengelig. Kontroller sesonginnholdet.');
                }
                $errors = Storm_Core_Fields::validate_post($post_id);
                if ($errors) {
                    return new WP_Error('storm_invalid', get_the_title($post_id) . ': ' . implode(' ', $errors));
                }
            }
            if ($wpdb->query('START TRANSACTION') === false) {
                return new WP_Error('storm_database', 'Kunne ikke starte sesongbyttet.');
            }
            $transaction_open = true;
            $seasons = get_posts(array('post_type' => 'storm_season', 'post_status' => 'any', 'posts_per_page' => -1, 'fields' => 'ids'));
            foreach ($ids as $post_id) {
                $result = wp_update_post(array('ID' => $post_id, 'post_status' => 'publish'), true);
                if (is_wp_error($result)) {
                    return $result;
                }
            }
            foreach ($seasons as $season) {
                $active = (int) $season === $id;
                update_post_meta((int) $season, 'storm_is_active', $active);
                if ((bool) get_post_meta((int) $season, 'storm_is_active', true) !== $active) {
                    return new WP_Error('storm_database', 'Aktiv sesong kunne ikke lagres. Ingen sesongendringer er beholdt.');
                }
            }
            update_post_meta($id, 'storm_is_active', true);
            update_option('storm_core_public_content', true, false);
            if (!get_option('storm_core_public_content')) {
                return new WP_Error('storm_database', 'Publiseringsvalget kunne ikke lagres. Ingen sesongendringer er beholdt.');
            }
            if ($wpdb->query('COMMIT') === false) {
                return new WP_Error('storm_database', 'Sesongbyttet kunne ikke lagres.');
            }
            $transaction_open = false;
            flush_rewrite_rules(false);
            return true;
        } finally {
            if ($transaction_open) {
                $wpdb->query('ROLLBACK');
            }
            foreach (array_unique(array_merge($ids, $seasons)) as $post_id) {
                clean_post_cache($post_id);
            }
            wp_cache_delete('storm_core_public_content', 'options');
            wp_cache_delete('alloptions', 'options');
            wp_cache_delete('notoptions', 'options');
            self::unlock();
        }
    }

    private static function authorize(string $action): void
    {
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !self::permitted()) {
            wp_die('Ingen tilgang.', '', array('response' => 403));
        }
        check_admin_referer($action);
    }

    private static function finish(int|true|WP_Error $result): never
    {
        if (is_wp_error($result)) {
            wp_die(esc_html($result->get_error_message()), 'Sesongskifte', array('back_link' => true));
        }
        wp_safe_redirect(admin_url('admin.php?page=storm-seasons&saved=1'));
        exit;
    }

    public static function handle_prepare(): void
    {
        self::authorize('storm_season_prepare');
        self::finish(self::prepare(
            absint($_POST['source'] ?? 0), absint($_POST['start_year'] ?? 0),
            array_map('sanitize_key', (array) ($_POST['copy'] ?? array()))
        ));
    }

    public static function handle_activate(): void
    {
        self::authorize('storm_season_activate');
        if (empty($_POST['reviewed'])) {
            wp_die('Bekreft at sesongen og innholdet er gjennomgått.');
        }
        self::finish(self::activate(absint($_POST['season'] ?? 0)));
    }

    public static function handle_nif(): void
    {
        self::authorize('storm_season_nif');
        $result = Storm_Core_Nif::sync(true, '', 'draft', absint($_POST['season'] ?? 0));
        self::finish(is_wp_error($result) ? $result : true);
    }

    public static function render(): void
    {
        if (!self::permitted()) {
            wp_die('Ingen tilgang.');
        }
        $seasons = get_posts(array('post_type' => 'storm_season', 'post_status' => array('publish', 'draft', 'pending'), 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'DESC'));
        echo '<div class="wrap"><h1>Sesongskifte</h1><p>1. Klargjør som utkast. 2. Gjennomgå stall, avtaler, treningstider og kamper. 3. Aktiver når alt er klart. Den gamle sesongen slettes aldri.</p>';
        if (isset($_GET['saved'])) {
            echo '<div class="notice notice-success"><p>Handlingen er fullført. Kontroller innholdet nedenfor.</p></div>';
        }
        echo '<h2>1. Klargjør ny sesong</h2><form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
        wp_nonce_field('storm_season_prepare');
        echo '<input type="hidden" name="action" value="storm_season_prepare"><p><label>Startår <input type="number" name="start_year" min="1900" max="2200" required value="' . esc_attr(wp_date('Y') + 1) . '"></label></p>';
        echo '<p><label>Kopier fra <select name="source"><option value="0">Ingen – tom sesong</option>';
        foreach ($seasons as $season) {
            echo '<option value="' . esc_attr((string) $season->ID) . '">' . esc_html($season->post_title) . '</option>';
        }
        echo '</select></label></p>';
        foreach (array('storm_roster_entry' => 'Stall og trenerteam', 'storm_sponsor_deal' => 'Sponsoravtaler', 'storm_training' => 'Treningstider') as $type => $label) {
            echo '<p><label><input type="checkbox" name="copy[]" value="' . esc_attr($type) . '" checked> ' . esc_html($label) . '</label></p>';
        }
        echo '<p>Person- og sponsorprofiler gjenbrukes. Tilknytningene kopieres som utkast. Kamper og gamle avtaledatoer kopieres ikke. Kontroller vilkår og perioder før publisering.</p>';
        submit_button('Klargjør sesong som utkast');
        echo '</form><h2>2. Gjennomgå sesongene</h2><table class="widefat striped"><thead><tr><th>Sesong</th><th>Status</th><th>Innhold</th></tr></thead><tbody>';
        foreach ($seasons as $season) {
            echo '<tr><td><a href="' . esc_url(get_edit_post_link($season->ID)) . '">' . esc_html($season->post_title) . '</a></td><td>' . esc_html($season->post_status) . (Storm_Core_Content::active_season() === $season->ID ? ' – aktiv' : '') . '</td><td>';
            foreach (self::SEASON_TYPES as $type) {
                $definition = Storm_Core_Post_Types::definitions()[$type];
                echo '<a href="' . esc_url(admin_url('edit.php?post_type=' . $type . '&storm_season=' . $season->ID)) . '">' . esc_html($definition['plural']) . '</a> · ';
            }
            echo '</td></tr>';
        }
        echo '</tbody></table><h2>Hent terminliste</h2><p>Import gir utkast. Manuelle overstyringer beholdes. Uten prosjektets NIF-tilgang må kamper legges inn manuelt.</p>';
        self::season_form('storm_season_nif', $seasons, 'Hent NIF-kamper som utkast');
        echo '<h2>3. Publiser og aktiver gjennomgått sesong</h2><p>Publiserer sesongens klargjorte kamper, stalltilknytninger, sponsoravtaler og treningstider, samt tilhørende offentlige/utkast-profiler. Private profiler publiseres aldri av veiviseren. Forrige sesong beholdes som historikk. Dette bytter også fra legacy-tabellene til Storm-innhold for den offentlige visningen.</p>';
        self::season_form('storm_season_activate', $seasons, 'Publiser gjennomgått innhold og aktiver', true);
        echo '</div>';
    }

    private static function season_form(string $action, array $seasons, string $label, bool $review = false): void
    {
        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
        wp_nonce_field($action);
        echo '<input type="hidden" name="action" value="' . esc_attr($action) . '"><p><label>Sesong <select name="season" required>';
        foreach ($seasons as $season) {
            echo '<option value="' . esc_attr((string) $season->ID) . '">' . esc_html($season->post_title) . '</option>';
        }
        echo '</select></label></p>';
        if ($review) {
            echo '<p><label><input type="checkbox" name="reviewed" value="1" required> Jeg har gjennomgått ALLE utkast i denne sesongen, bilder, avtaler og publiseringsrettigheter.</label></p>';
        }
        submit_button($label);
        echo '</form>';
    }
}
