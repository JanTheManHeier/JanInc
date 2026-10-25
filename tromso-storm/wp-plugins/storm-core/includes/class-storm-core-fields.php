<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Fields
{
    private const NONCE_ACTION = 'storm_core_save_fields';
    private const NONCE_NAME = 'storm_core_fields_nonce';

    /**
     * @var array<string, array<string, string|list<string>>>
     */
    private static array $relations = array(
        'storm_game' => array(
            'storm_season_id' => 'storm_season',
        ),
        'storm_roster_entry' => array(
            'storm_season_id' => 'storm_season',
            'storm_person_id' => array('storm_player', 'storm_staff'),
        ),
        'storm_sponsor_deal' => array(
            'storm_sponsor_id' => 'storm_sponsor',
            'storm_season_id'  => 'storm_season',
        ),
        'storm_training' => array(
            'storm_season_id' => 'storm_season',
        ),
    );

    /**
     * @var array<string, list<string>>
     */
    private static array $required = array(
        'storm_season'       => array('storm_season_start_year', 'storm_season_end_year'),
        'storm_game'         => array('storm_season_id', 'storm_starts_at', 'storm_home_team', 'storm_away_team', 'storm_game_status'),
        'storm_roster_entry' => array('storm_season_id', 'storm_person_id', 'storm_person_type'),
        'storm_sponsor_deal' => array('storm_sponsor_id', 'storm_season_id', 'storm_level'),
        'storm_training'     => array('storm_season_id', 'storm_team', 'storm_weekday', 'storm_starts_time', 'storm_ends_time', 'storm_venue'),
        'storm_social'       => array('storm_platform', 'storm_source_url'),
    );

    public static function register_meta_boxes(): void
    {
        foreach (Storm_Core_Meta::definitions() as $post_type => $fields) {
            if ($fields === array()) {
                continue;
            }

            remove_meta_box('postcustom', $post_type, 'normal');
            add_meta_box(
                'storm-core-details',
                self::box_title($post_type),
                array(__CLASS__, 'render_meta_box'),
                $post_type,
                'normal',
                'high'
            );
        }
    }

    public static function enqueue_assets(string $hook_suffix): void
    {
        if (!in_array($hook_suffix, array('post.php', 'post-new.php'), true)) {
            return;
        }

        $screen = get_current_screen();
        if (!$screen || !array_key_exists($screen->post_type, Storm_Core_Meta::definitions())) {
            return;
        }

        wp_enqueue_style(
            'storm-core-admin',
            plugins_url('assets/admin.css', STORM_CORE_FILE),
            array(),
            STORM_CORE_VERSION
        );
    }

    public static function render_meta_box(WP_Post $post): void
    {
        $all_fields = Storm_Core_Meta::definitions();
        $fields = $all_fields[$post->post_type] ?? array();

        wp_nonce_field(self::NONCE_ACTION, self::NONCE_NAME);
        echo '<div class="storm-core-fields">';

        foreach ($fields as $meta_key => $field) {
            if ($post->post_type === 'storm_season' && $meta_key === 'storm_is_active') {
                echo '<p>Aktiv sesong endres under <a href="' . esc_url(admin_url('admin.php?page=storm-seasons')) . '">Storm → Sesongskifte</a>, etter innholdskontroll.</p>';
                continue;
            }
            self::render_field($post, $meta_key, $field);
        }

        echo '</div>';
    }

    /**
     * @param array<string, mixed> $field
     */
    private static function render_field(WP_Post $post, string $meta_key, array $field): void
    {
        $has_value = metadata_exists('post', $post->ID, $meta_key);
        $value = $has_value ? get_post_meta($post->ID, $meta_key, true) : ($field['default'] ?? '');
        $required = self::is_required($post->post_type, $meta_key);
        $input_id = 'storm-core-' . str_replace('_', '-', $meta_key);
        $name = 'storm_core_meta[' . $meta_key . ']';
        $label = rtrim((string) $field['description'], '.');

        echo '<div class="storm-core-field storm-core-field--' . esc_attr((string) $field['type']) . '">';
        echo '<label for="' . esc_attr($input_id) . '"><strong>' . esc_html($label) . '</strong>';
        if ($required) {
            echo ' <span class="storm-core-required" aria-hidden="true">*</span>';
            echo '<span class="screen-reader-text"> ' . esc_html__('Obligatorisk', 'storm-core') . '</span>';
        }
        echo '</label>';

        $relation_types = self::$relations[$post->post_type][$meta_key] ?? null;
        if ($relation_types !== null) {
            self::render_relation_select($input_id, $name, (int) $value, $relation_types, $required);
        } elseif ($post->post_type === 'storm_training' && $meta_key === 'storm_weekday') {
            self::render_weekday_select($input_id, $name, (int) $value, $required);
        } elseif ($field['type'] === 'enum') {
            self::render_enum_select($input_id, $name, (string) $value, $field['allowed'], $required);
        } elseif ($field['type'] === 'boolean') {
            self::render_checkbox($input_id, $name, (bool) $value);
        } elseif ($field['type'] === 'textarea') {
            echo '<textarea class="widefat" rows="4" id="' . esc_attr($input_id) . '" name="' . esc_attr($name) . '">';
            echo esc_textarea((string) $value);
            echo '</textarea>';
        } else {
            $input_type = self::html_input_type((string) $field['type']);
            $display_value = self::display_value((string) $field['type'], $value);
            $attributes = $required ? ' required' : '';
            if ($input_type === 'number') {
                $attributes .= ' min="0" step="1"';
            }

            echo '<input class="widefat" type="' . esc_attr($input_type) . '" id="' . esc_attr($input_id) . '" name="' . esc_attr($name) . '" value="' . esc_attr($display_value) . '"' . $attributes . '>';
        }

        echo '<p class="description"><code>' . esc_html($meta_key) . '</code></p>';
        echo '</div>';
    }

    /**
     * @param string|list<string> $post_types
     */
    private static function render_relation_select(string $input_id, string $name, int $selected, string|array $post_types, bool $required): void
    {
        $types = (array) $post_types;
        $posts = get_posts(
            array(
                'post_type'      => $types,
                'post_status'    => array('publish', 'draft', 'pending', 'private'),
                'posts_per_page' => -1,
                'orderby'        => 'title',
                'order'          => 'ASC',
                'no_found_rows'  => true,
            )
        );

        echo '<select class="widefat" id="' . esc_attr($input_id) . '" name="' . esc_attr($name) . '"' . ($required ? ' required' : '') . '>';
        echo '<option value="">' . esc_html__('Velg …', 'storm-core') . '</option>';
        foreach ($posts as $related_post) {
            $type_object = get_post_type_object($related_post->post_type);
            $type_label = $type_object ? $type_object->labels->singular_name : $related_post->post_type;
            $option_label = sprintf('%s — %s', $related_post->post_title ?: __('Uten tittel', 'storm-core'), $type_label);
            echo '<option value="' . esc_attr((string) $related_post->ID) . '"' . selected($selected, $related_post->ID, false) . '>';
            echo esc_html($option_label);
            echo '</option>';
        }
        echo '</select>';
    }

    /**
     * @param list<string> $allowed
     */
    private static function render_enum_select(string $input_id, string $name, string $selected_value, array $allowed, bool $required): void
    {
        echo '<select class="widefat" id="' . esc_attr($input_id) . '" name="' . esc_attr($name) . '"' . ($required ? ' required' : '') . '>';
        if (!$required) {
            echo '<option value="">' . esc_html__('Ikke valgt', 'storm-core') . '</option>';
        }
        foreach ($allowed as $value) {
            echo '<option value="' . esc_attr($value) . '"' . selected($selected_value, $value, false) . '>';
            echo esc_html(self::enum_label($value));
            echo '</option>';
        }
        echo '</select>';
    }

    private static function render_weekday_select(string $input_id, string $name, int $selected_value, bool $required): void
    {
        $weekdays = array(
            1 => 'Mandag',
            2 => 'Tirsdag',
            3 => 'Onsdag',
            4 => 'Torsdag',
            5 => 'Fredag',
            6 => 'Lørdag',
            7 => 'Søndag',
        );

        echo '<select class="widefat" id="' . esc_attr($input_id) . '" name="' . esc_attr($name) . '"' . ($required ? ' required' : '') . '>';
        echo '<option value="">' . esc_html__('Velg ukedag …', 'storm-core') . '</option>';
        foreach ($weekdays as $value => $label) {
            echo '<option value="' . esc_attr((string) $value) . '"' . selected($selected_value, $value, false) . '>';
            echo esc_html($label);
            echo '</option>';
        }
        echo '</select>';
    }

    private static function render_checkbox(string $input_id, string $name, bool $checked): void
    {
        echo '<input type="hidden" name="' . esc_attr($name) . '" value="0">';
        echo '<label class="storm-core-checkbox" for="' . esc_attr($input_id) . '">';
        echo '<input type="checkbox" id="' . esc_attr($input_id) . '" name="' . esc_attr($name) . '" value="1"' . checked($checked, true, false) . '>';
        echo '<span>' . esc_html__('Ja', 'storm-core') . '</span>';
        echo '</label>';
    }

    public static function save(int $post_id, WP_Post $post): void
    {
        if (
            wp_is_post_autosave($post_id)
            || wp_is_post_revision($post_id)
            || !array_key_exists($post->post_type, Storm_Core_Meta::definitions())
            || !isset($_POST[self::NONCE_NAME])
            || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST[self::NONCE_NAME])), self::NONCE_ACTION)
            || !current_user_can('edit_post', $post_id)
        ) {
            return;
        }

        $submitted = isset($_POST['storm_core_meta']) && is_array($_POST['storm_core_meta'])
            ? wp_unslash($_POST['storm_core_meta'])
            : array();
        $errors = array();
        $validated = array();

        foreach (Storm_Core_Meta::definitions()[$post->post_type] as $meta_key => $field) {
            if ($post->post_type === 'storm_season' && $meta_key === 'storm_is_active') {
                $validated[$meta_key] = (bool) get_post_meta($post_id, $meta_key, true);
                continue;
            }
            $raw_value = $submitted[$meta_key] ?? '';
            $result = self::validate_value($post->post_type, $meta_key, $field, $raw_value);

            if (is_wp_error($result)) {
                $errors[] = $result->get_error_message();
                continue;
            }

            $validated[$meta_key] = $result;
        }

        $errors = array_merge($errors, self::validate_record($post->post_type, $validated));
        if ($errors !== array()) {
            set_transient(self::error_key($post_id), array_values(array_unique($errors)), 5 * MINUTE_IN_SECONDS);
            return;
        }

        foreach (Storm_Core_Meta::definitions()[$post->post_type] as $meta_key => $field) {
            $value = $validated[$meta_key] ?? '';
            if ($value === '' && $field['type'] !== 'boolean') {
                delete_post_meta($post_id, $meta_key);
                continue;
            }

            update_post_meta($post_id, $meta_key, $value);
        }

        delete_transient(self::error_key($post_id));
        self::update_generated_title($post_id, $post);
    }

    public static function validate_post(int $id): array
    {
        $post = get_post($id);
        if (!$post || !isset(Storm_Core_Meta::definitions()[$post->post_type])) {
            return array('Ugyldig Storm-innhold.');
        }
        $errors = array();
        $values = array();
        foreach (Storm_Core_Meta::definitions()[$post->post_type] as $key => $field) {
            $raw = metadata_exists('post', $id, $key) ? get_post_meta($id, $key, true) : ($field['default'] ?? '');
            $value = self::validate_value($post->post_type, $key, $field, is_bool($raw) ? (int) $raw : $raw);
            if (is_wp_error($value)) {
                $errors[] = $value->get_error_message();
            } else {
                $values[$key] = $value;
            }
        }
        if (trim($post->post_title) === '') {
            $errors[] = 'Tittel eller navn mangler.';
        }
        return array_merge($errors, self::validate_record($post->post_type, $values));
    }

    public static function validate_submission(string $type, array $submitted): array
    {
        $values = array();
        $errors = array();
        foreach (Storm_Core_Meta::definitions()[$type] ?? array() as $key => $field) {
            $value = self::validate_value($type, $key, $field, $submitted[$key] ?? ($field['default'] ?? ''));
            if (is_wp_error($value)) {
                $errors[] = $value->get_error_message();
            } else {
                $values[$key] = $value;
            }
        }
        if ($type === 'storm_social' && (empty($values['storm_rights_confirmed']) || empty($values['storm_image_alt']))) {
            $errors[] = 'Bekreft publiseringsrett/samtykke og fyll inn alternativtekst før SOME-kort publiseres.';
        }
        return array_merge($errors, self::validate_record($type, $values));
    }

    /**
     * @param array<string, mixed> $field
     * @return mixed|WP_Error
     */
    private static function validate_value(string $post_type, string $meta_key, array $field, mixed $raw_value): mixed
    {
        $raw_value = is_scalar($raw_value) ? trim((string) $raw_value) : '';
        $label = rtrim((string) $field['description'], '.');

        if ($raw_value === '') {
            if (self::is_required($post_type, $meta_key)) {
                return new WP_Error('storm_required', sprintf('%s er obligatorisk.', $label));
            }

            return $field['type'] === 'boolean' ? false : '';
        }

        if ($field['type'] === 'integer' && !preg_match('/^\d+$/', $raw_value)) {
            return new WP_Error('storm_integer', sprintf('%s må være et heltall som er null eller større.', $label));
        }

        $relation_types = self::$relations[$post_type][$meta_key] ?? null;
        if ($relation_types !== null) {
            $related_id = absint($raw_value);
            if ($related_id < 1 || !in_array(get_post_type($related_id), (array) $relation_types, true)) {
                return new WP_Error('storm_relation', sprintf('%s peker ikke til gyldig innhold.', $label));
            }

            return $related_id;
        }

        if ($post_type === 'storm_training' && $meta_key === 'storm_weekday') {
            $weekday = (int) $raw_value;
            if ($weekday < 1 || $weekday > 7) {
                return new WP_Error('storm_weekday', 'Ukedag må være mellom mandag og søndag.');
            }

            return $weekday;
        }

        if ($field['type'] === 'enum' && !in_array($raw_value, $field['allowed'], true)) {
            return new WP_Error('storm_enum', sprintf('%s har en ugyldig verdi.', $label));
        }

        $sanitized = sanitize_meta($meta_key, $raw_value, 'post', $post_type);
        if ($sanitized === '' && $raw_value !== '') {
            return new WP_Error('storm_invalid', sprintf('%s har ugyldig format.', $label));
        }

        return $sanitized;
    }

    /**
     * @param array<string, mixed> $values
     * @return list<string>
     */
    private static function validate_record(string $post_type, array $values): array
    {
        $errors = array();

        if ($post_type === 'storm_season') {
            $start_year = (int) ($values['storm_season_start_year'] ?? 0);
            $end_year = (int) ($values['storm_season_end_year'] ?? 0);
            if ($start_year < 1900 || $start_year > 2200 || $end_year < 1901 || $end_year > 2201) {
                $errors[] = 'Velg gyldige sesongår mellom 1900 og 2201.';
            }
            if ($start_year > 0 && $end_year > 0 && $end_year <= $start_year) {
                $errors[] = 'Sesongens sluttår må være senere enn startåret.';
            }
            self::validate_date_range($values, 'storm_season_starts_at', 'storm_season_ends_at', 'Sesongens sluttdato', $errors);
        }

        if ($post_type === 'storm_game') {
            $home = trim((string) ($values['storm_home_team'] ?? ''));
            $away = trim((string) ($values['storm_away_team'] ?? ''));
            if ($home !== '' && $away !== '' && strcasecmp($home, $away) === 0) {
                $errors[] = 'Hjemmelag og bortelag kan ikke være samme lag.';
            }
        }

        if ($post_type === 'storm_roster_entry') {
            $person_id = (int) ($values['storm_person_id'] ?? 0);
            $person_type = (string) ($values['storm_person_type'] ?? '');
            $expected_post_type = $person_type === 'staff' ? 'storm_staff' : 'storm_player';
            if ($person_id > 0 && get_post_type($person_id) !== $expected_post_type) {
                $errors[] = 'Valgt persontype samsvarer ikke med spilleren eller støtteapparatet.';
            }
        }

        if ($post_type === 'storm_sponsor_deal') {
            self::validate_date_range($values, 'storm_valid_from', 'storm_valid_to', 'Avtalens sluttdato', $errors);
        }

        if ($post_type === 'storm_training') {
            self::validate_date_range($values, 'storm_valid_from', 'storm_valid_to', 'Treningstidens sluttdato', $errors);
            $starts = (string) ($values['storm_starts_time'] ?? '');
            $ends = (string) ($values['storm_ends_time'] ?? '');
            if ($starts !== '' && $ends !== '' && $ends <= $starts) {
                $errors[] = 'Treningens sluttid må være senere enn starttiden.';
            }
        }

        return $errors;
    }

    /**
     * @param array<string, mixed> $values
     * @param list<string> $errors
     */
    private static function validate_date_range(array $values, string $start_key, string $end_key, string $end_label, array &$errors): void
    {
        $start = (string) ($values[$start_key] ?? '');
        $end = (string) ($values[$end_key] ?? '');
        if ($start !== '' && $end !== '' && $end < $start) {
            $errors[] = sprintf('%s kan ikke være før startdatoen.', $end_label);
        }
    }

    private static function update_generated_title(int $post_id, WP_Post $post): void
    {
        $always_generate = in_array($post->post_type, array('storm_roster_entry', 'storm_sponsor_deal', 'storm_training'), true);
        if (!$always_generate && trim($post->post_title) !== '') {
            return;
        }

        $title = self::generated_title($post_id, $post->post_type);
        if ($title === '') {
            return;
        }

        remove_action('save_post', array(__CLASS__, 'save'), 10);
        wp_update_post(array('ID' => $post_id, 'post_title' => $title));
        add_action('save_post', array(__CLASS__, 'save'), 10, 2);
    }

    private static function generated_title(int $post_id, string $post_type): string
    {
        if ($post_type === 'storm_season') {
            $start = (int) get_post_meta($post_id, 'storm_season_start_year', true);
            $end = (int) get_post_meta($post_id, 'storm_season_end_year', true);

            return $start > 0 && $end > 0 ? sprintf('%d/%d', $start, $end) : '';
        }

        if ($post_type === 'storm_game') {
            $home = (string) get_post_meta($post_id, 'storm_home_team', true);
            $away = (string) get_post_meta($post_id, 'storm_away_team', true);

            return $home !== '' && $away !== '' ? $home . ' – ' . $away : '';
        }

        if ($post_type === 'storm_roster_entry') {
            return self::relation_title($post_id, 'storm_person_id') . ' — ' . self::relation_title($post_id, 'storm_season_id');
        }

        if ($post_type === 'storm_sponsor_deal') {
            return self::relation_title($post_id, 'storm_sponsor_id') . ' — ' . self::relation_title($post_id, 'storm_season_id');
        }

        if ($post_type === 'storm_training') {
            $team = (string) get_post_meta($post_id, 'storm_team', true);
            $time = (string) get_post_meta($post_id, 'storm_starts_time', true);

            return trim($team . ($time !== '' ? ' — ' . $time : ''));
        }

        return '';
    }

    private static function relation_title(int $post_id, string $meta_key): string
    {
        $related_id = (int) get_post_meta($post_id, $meta_key, true);
        $title = $related_id > 0 ? get_the_title($related_id) : '';

        return is_string($title) ? $title : '';
    }

    public static function render_validation_notice(): void
    {
        if (!isset($_GET['post'])) {
            return;
        }

        $post_id = absint($_GET['post']);
        if ($post_id < 1 || !current_user_can('edit_post', $post_id)) {
            return;
        }

        $errors = get_transient(self::error_key($post_id));
        if (!is_array($errors) || $errors === array()) {
            return;
        }

        delete_transient(self::error_key($post_id));
        echo '<div class="notice notice-error"><p><strong>' . esc_html__('Storm-feltene ble ikke fullstendig lagret:', 'storm-core') . '</strong></p><ul>';
        foreach ($errors as $error) {
            echo '<li>' . esc_html((string) $error) . '</li>';
        }
        echo '</ul></div>';
    }

    private static function error_key(int $post_id): string
    {
        return 'storm_core_errors_' . get_current_user_id() . '_' . $post_id;
    }

    private static function is_required(string $post_type, string $meta_key): bool
    {
        return in_array($meta_key, self::$required[$post_type] ?? array(), true);
    }

    private static function box_title(string $post_type): string
    {
        $titles = array(
            'storm_season'       => 'Sesongdetaljer',
            'storm_game'         => 'Kampdetaljer',
            'storm_player'       => 'Spillerprofil',
            'storm_staff'        => 'Persondetaljer',
            'storm_roster_entry' => 'Stalltilknytning',
            'storm_sponsor'      => 'Sponsordetaljer',
            'storm_sponsor_deal' => 'Avtaledetaljer',
            'storm_training'     => 'Treningstid',
            'storm_social'       => 'SOME-detaljer',
        );

        return $titles[$post_type] ?? 'Storm-detaljer';
    }

    private static function html_input_type(string $field_type): string
    {
        return match ($field_type) {
            'integer'  => 'number',
            'date'     => 'date',
            'datetime' => 'datetime-local',
            'time'     => 'time',
            'url'      => 'url',
            'email'    => 'email',
            default    => 'text',
        };
    }

    private static function display_value(string $field_type, mixed $value): string
    {
        if ($field_type !== 'datetime' || !is_string($value) || $value === '') {
            return (string) $value;
        }

        try {
            return (new DateTimeImmutable($value))->setTimezone(wp_timezone())->format('Y-m-d\TH:i');
        } catch (Exception) {
            return '';
        }
    }

    private static function enum_label(string $value): string
    {
        $labels = array(
            'scheduled' => 'Planlagt',
            'pre'       => 'Starter snart',
            'live'      => 'Live',
            'finished'  => 'Ferdig',
            'postponed' => 'Utsatt',
            'cancelled' => 'Avlyst',
            'manual'    => 'Manuell',
            'nif'       => 'NIF',
            'legacy'    => 'Legacy',
            'player'    => 'Spiller',
            'staff'     => 'Trener/støtteapparat',
            'main'      => 'Hovedsamarbeidspartner',
            'partner'   => 'Samarbeidspartner',
            'supporter' => 'Øvrig samarbeidspartner',
            'member'    => 'Støttemedlem',
            'business'  => 'Bedrift',
            'person'    => 'Person',
            'facebook'  => 'Facebook',
            'instagram' => 'Instagram',
        );

        return $labels[$value] ?? ucfirst($value);
    }
}
