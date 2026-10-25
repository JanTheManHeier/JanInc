<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Meta
{
    /**
     * @return array<string, array<string, array<string, mixed>>>
     */
    public static function definitions(): array
    {
        return array(
            'storm_season' => array(
                'storm_season_start_year' => self::field('integer', 'Første kalenderår i sesongen.'),
                'storm_season_end_year'   => self::field('integer', 'Siste kalenderår i sesongen.'),
                'storm_season_starts_at'  => self::field('date', 'Sesongens startdato.'),
                'storm_season_ends_at'    => self::field('date', 'Sesongens sluttdato.'),
                'storm_is_active'         => self::field('boolean', 'Om dette er aktiv sesong.', array(), false),
                'storm_nif_season_id'     => self::field('string', 'Sesongidentifikator hos NIF.'),
                'storm_nif_standings_id'  => self::field('integer', 'Valgfri NIF-turnerings-ID for tabellen i akkurat denne sesongen.'),
            ),
            'storm_game' => array(
                'storm_season_id'        => self::field('integer', 'WordPress-ID for sesongen.'),
                'storm_external_id'      => self::field('string', 'Stabil ID hos ekstern kampdatakilde.'),
                'storm_starts_at'        => self::field('datetime', 'Kampstart i RFC 3339-format.'),
                'storm_home_team'        => self::field('string', 'Hjemmelag.'),
                'storm_away_team'        => self::field('string', 'Bortelag.'),
                'storm_home_score'       => self::field('integer', 'Hjemmelagets poeng.', array(), 0),
                'storm_away_score'       => self::field('integer', 'Bortelagets poeng.', array(), 0),
                'storm_home_fouls'       => self::field('integer', 'Hjemmelagets lagfeil.', array(), 0),
                'storm_away_fouls'       => self::field('integer', 'Bortelagets lagfeil.', array(), 0),
                'storm_period'           => self::field('integer', 'Aktiv omgang.', array(), 0),
                'storm_clock_seconds'    => self::field('integer', 'Gjenstående tid i sekunder.', array(), 0),
                'storm_venue'            => self::field('string', 'Kamparena.'),
                'storm_game_status'      => self::field('enum', 'Kampstatus.', array('scheduled', 'pre', 'live', 'finished', 'postponed', 'cancelled'), 'scheduled'),
                'storm_data_source'      => self::field('enum', 'Autoritativ kilde for raden.', array('manual', 'nif', 'legacy'), 'manual'),
                'storm_source_updated_at'=> self::field('datetime', 'Siste observerte endring hos kilden.'),
                'storm_manual_override'  => self::field('boolean', 'Om redaktørens verdier skal overstyre import.', array(), false),
                'storm_stats_url'        => self::field('url', 'Kampstatistikk hos ekstern kilde.'),
                'storm_ticket_url'       => self::field('url', 'Godkjent billettlenke for denne kampen.'),
                'storm_hidden'           => self::field('boolean', 'Skjul kampen fra offentlig terminliste.', array(), false),
                'storm_mygame_url'       => self::field('url', 'MyGame-lenke.'),
                'storm_direktesport_url' => self::field('url', 'Direktesport-lenke.'),
            ),
            'storm_player' => array(
                'storm_first_name'     => self::field('string', 'Fornavn.'),
                'storm_last_name'      => self::field('string', 'Etternavn.'),
                'storm_birth_date'     => self::field('date', 'Fødselsdato.'),
                'storm_birth_year'     => self::field('integer', 'Fødselsår som kan vises offentlig.'),
                'storm_weight_kg'      => self::field('integer', 'Vekt i kilo.'),
                'storm_elite_years'    => self::field('integer', 'Antall år i eliteserien.'),
                'storm_nationality'    => self::field('string', 'Nasjonalitet.'),
                'storm_height_cm'      => self::field('integer', 'Høyde i centimeter.'),
                'storm_former_clubs'   => self::field('textarea', 'Tidligere klubber.'),
                'storm_instagram_url'  => self::field('url', 'Instagram-profil.'),
                'storm_video_url'      => self::field('url', 'Profilvideo.'),
                'storm_external_id'    => self::field('string', 'Stabil spiller-ID hos ekstern datakilde.'),
            ),
            'storm_staff' => array(
                'storm_staff_role'    => self::field('string', 'Rolle i trener- eller støtteapparatet.'),
                'storm_email'         => self::field('email', 'Offentlig kontaktadresse.'),
                'storm_phone'         => self::field('string', 'Offentlig telefonnummer.'),
                'storm_external_id'   => self::field('string', 'Stabil person-ID hos ekstern datakilde.'),
            ),
            'storm_roster_entry' => array(
                'storm_season_id'   => self::field('integer', 'WordPress-ID for sesongen.'),
                'storm_person_id'   => self::field('integer', 'WordPress-ID for spiller eller ansatt.'),
                'storm_person_type' => self::field('enum', 'Om tilknytningen gjelder spiller eller støtteapparat.', array('player', 'staff'), 'player'),
                'storm_jersey_number'=> self::field('integer', 'Draktnummer.'),
                'storm_position'    => self::field('string', 'Posisjon eller rolle i denne sesongen.'),
                'storm_is_captain'  => self::field('boolean', 'Om spilleren er kaptein.', array(), false),
                'storm_sort_order'  => self::field('integer', 'Manuell sorteringsrekkefølge.', array(), 0),
                'storm_is_active'   => self::field('boolean', 'Om tilknytningen er aktiv.', array(), true),
                'storm_featured'    => self::field('boolean', 'Fremhev spilleren på forsiden.', array(), false),
            ),
            'storm_sponsor' => array(
                'storm_website_url' => self::field('url', 'Sponsorens nettsted.'),
                'storm_org_number'  => self::field('string', 'Organisasjonsnummer.'),
                'storm_member_kind' => self::field('enum', 'Støttemedlemstype, bare relevant for nivå Støttemedlem.', array('business', 'person'), 'business'),
            ),
            'storm_sponsor_deal' => array(
                'storm_sponsor_id' => self::field('integer', 'WordPress-ID for sponsoren.'),
                'storm_season_id'  => self::field('integer', 'WordPress-ID for sesongen.'),
                'storm_level'      => self::field('enum', 'Sponsornivå.', array('main', 'partner', 'supporter', 'member'), 'partner'),
                'storm_valid_from' => self::field('date', 'Første gyldighetsdato.'),
                'storm_valid_to'   => self::field('date', 'Siste gyldighetsdato.'),
                'storm_sort_order' => self::field('integer', 'Sortering innen sponsornivå.', array(), 0),
                'storm_is_active'  => self::field('boolean', 'Om avtalen skal vises.', array(), true),
            ),
            'storm_training' => array(
                'storm_season_id'   => self::field('integer', 'WordPress-ID for sesongen.'),
                'storm_team'        => self::field('string', 'Lag eller treningsgruppe.'),
                'storm_weekday'     => self::field('integer', 'Ukedag, 1 for mandag til 7 for søndag.'),
                'storm_starts_time' => self::field('time', 'Starttid i 24-timers format.'),
                'storm_ends_time'   => self::field('time', 'Sluttid i 24-timers format.'),
                'storm_venue'       => self::field('string', 'Treningssted.'),
                'storm_valid_from'  => self::field('date', 'Første gyldighetsdato.'),
                'storm_valid_to'    => self::field('date', 'Siste gyldighetsdato.'),
                'storm_sort_order'  => self::field('integer', 'Manuell sorteringsrekkefølge.', array(), 0),
            ),
            'storm_social' => array(
                'storm_platform'    => self::field('enum', 'Sosial plattform.', array('facebook', 'instagram'), 'instagram'),
                'storm_source_url'  => self::field('url', 'Lenke til originalinnlegget.'),
                'storm_published_at'=> self::field('datetime', 'Opprinnelig publiseringstidspunkt.'),
                'storm_sort_order'  => self::field('integer', 'Manuell sorteringsrekkefølge.', array(), 0),
                'storm_is_active'   => self::field('boolean', 'Om kortet skal vises.', array(), true),
                'storm_rights_confirmed' => self::field('boolean', 'Publiseringsrett og nødvendige samtykker er avklart.', array(), false),
                'storm_image_alt'   => self::field('string', 'Alternativtekst til SOME-bildet.'),
            ),
        );
    }

    public static function register(): void
    {
        foreach (self::definitions() as $post_type => $fields) {
            foreach ($fields as $meta_key => $field) {
                $rest_schema = array(
                    'type'        => self::rest_type($field['type']),
                    'description' => $field['description'],
                    'context'     => array('view', 'edit'),
                );

                if ($field['type'] === 'enum') {
                    $rest_schema['enum'] = $field['allowed'];
                }

                $args = array(
                    'object_subtype'    => $post_type,
                    'type'              => self::rest_type($field['type']),
                    'single'            => true,
                    'description'       => $field['description'],
                    'show_in_rest'      => array('schema' => $rest_schema),
                    'sanitize_callback' => self::sanitizer($field['type'], $field['allowed']),
                    'auth_callback'     => array(__CLASS__, 'can_edit_meta'),
                );

                if (array_key_exists('default', $field)) {
                    $args['default'] = $field['default'];
                }

                register_post_meta($post_type, $meta_key, $args);
            }
        }
    }

    public static function can_edit_meta(bool $allowed, string $meta_key, int $object_id): bool
    {
        unset($allowed);

        if ($meta_key === 'storm_is_active' && get_post_type($object_id) === 'storm_season') {
            return false;
        }

        return current_user_can('edit_post', $object_id);
    }

    /**
     * @param list<string> $allowed
     * @return array<string, mixed>
     */
    private static function field(string $type, string $description, array $allowed = array(), mixed $default = null): array
    {
        $field = array(
            'type'        => $type,
            'description' => $description,
            'allowed'     => $allowed,
        );

        if (func_num_args() >= 4) {
            $field['default'] = $default;
        }

        return $field;
    }

    private static function rest_type(string $type): string
    {
        return match ($type) {
            'integer' => 'integer',
            'boolean' => 'boolean',
            default   => 'string',
        };
    }

    /**
     * @param list<string> $allowed
     */
    private static function sanitizer(string $type, array $allowed): callable
    {
        return static function (mixed $value) use ($type, $allowed): mixed {
            return match ($type) {
                'integer'  => max(0, (int) $value),
                'boolean'  => rest_sanitize_boolean($value),
                'url'      => esc_url_raw((string) $value),
                'email'    => sanitize_email((string) $value),
                'textarea' => sanitize_textarea_field((string) $value),
                'date'     => self::sanitize_date((string) $value),
                'datetime' => self::sanitize_datetime((string) $value),
                'time'     => self::sanitize_time((string) $value),
                'enum'     => in_array((string) $value, $allowed, true) ? (string) $value : '',
                default    => sanitize_text_field((string) $value),
            };
        };
    }

    private static function sanitize_date(string $value): string
    {
        $value = sanitize_text_field($value);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return '';
        }

        [$year, $month, $day] = array_map('intval', explode('-', $value));

        return checkdate($month, $day, $year) ? $value : '';
    }

    private static function sanitize_datetime(string $value): string
    {
        $value = sanitize_text_field($value);
        if ($value === '') {
            return '';
        }

        try {
            $has_timezone = (bool) preg_match('/(?:Z|[+-]\d{2}:\d{2})$/', $value);
            $date = $has_timezone
                ? new DateTimeImmutable($value)
                : new DateTimeImmutable($value, wp_timezone());

            return $date->format(DATE_RFC3339);
        } catch (Exception) {
            return '';
        }
    }

    private static function sanitize_time(string $value): string
    {
        $value = sanitize_text_field($value);

        return preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $value) ? $value : '';
    }
}
