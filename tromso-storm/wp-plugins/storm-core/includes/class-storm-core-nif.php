<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Nif
{
    private const TOKEN_URL = 'https://id.nif.no/connect/token';
    private const MATCHES_URL = 'https://data.nif.no/api/v1/ta/ScheduledMatches/club';
    private const TOKEN_SCOPE = 'data_ta_scheduledmatches_read';
    private const DEFAULT_ORG_ID = '220005';
    private const CACHE_OPTION = 'storm_nif_last_valid_payload';
    private const STATE_OPTION = 'storm_nif_sync_state';
    private const CRON_HOOK = 'storm_core_nif_sync';

    private static bool $command_registered = false;

    public static function register_hooks(): void
    {
        add_action('init', array(__CLASS__, 'maybe_schedule'), 30);
        add_action(self::CRON_HOOK, array(__CLASS__, 'cron_sync'));
        add_action('admin_menu', array(__CLASS__, 'register_admin_page'));
        add_action('admin_notices', array(__CLASS__, 'render_failure_notice'));
        add_action('admin_post_storm_nif_save_aliases', array(__CLASS__, 'save_aliases'));
    }

    public static function register_command(): void
    {
        if (self::$command_registered || !class_exists('WP_CLI')) {
            return;
        }

        WP_CLI::add_command('storm nif', 'Storm_Core_Nif_Command');
        self::$command_registered = true;
    }

    public static function maybe_schedule(): void
    {
        if (!self::is_configured() || wp_next_scheduled(self::CRON_HOOK)) {
            return;
        }

        wp_schedule_event(time() + 5 * MINUTE_IN_SECONDS, 'hourly', self::CRON_HOOK);
    }

    public static function unschedule(): void
    {
        $timestamp = wp_next_scheduled(self::CRON_HOOK);
        while ($timestamp) {
            wp_unschedule_event($timestamp, self::CRON_HOOK);
            $timestamp = wp_next_scheduled(self::CRON_HOOK);
        }
    }

    public static function cron_sync(): void
    {
        if (!self::is_configured()) {
            return;
        }

        $result = self::sync(true, '', 'draft');
        if (is_wp_error($result)) {
            error_log('Storm NIF sync failed: ' . sanitize_text_field($result->get_error_message()));
        }
    }

    public static function is_configured(): bool
    {
        $config = self::configuration();

        return $config['client_id'] !== '' && $config['client_secret'] !== '';
    }

    /**
     * @return array{client_id: string, client_secret: string, org_id: string}
     */
    private static function configuration(): array
    {
        return array(
            'client_id'     => trim((string) getenv('NIF_CLIENT_ID')),
            'client_secret' => trim((string) getenv('NIF_CLIENT_SECRET')),
            'org_id'        => trim((string) getenv('NIF_ORG_ID')) ?: self::DEFAULT_ORG_ID,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function status(): array
    {
        $config = self::configuration();
        $state = get_option(self::STATE_OPTION, array());
        $cache = get_option(self::CACHE_OPTION, array());

        return array(
            'configured'       => self::is_configured(),
            'org_id'           => $config['org_id'],
            'client_id_suffix' => $config['client_id'] !== '' ? substr($config['client_id'], -4) : '',
            'scheduled_at'     => wp_next_scheduled(self::CRON_HOOK) ?: 0,
            'last_attempt_at'  => (string) ($state['last_attempt_at'] ?? ''),
            'last_success_at'  => (string) ($state['last_success_at'] ?? ''),
            'failure_count'    => (int) ($state['failure_count'] ?? 0),
            'last_error'       => (string) ($state['last_error'] ?? ''),
            'cached_at'        => (string) ($cache['fetched_at'] ?? ''),
            'cached_matches'   => is_array($cache['payload'] ?? null) ? count($cache['payload']) : 0,
        );
    }

    /**
     * @return array<string, int|string|bool>|WP_Error
     */
    public static function sync(bool $execute, string $fixture_path = '', string $new_status = 'draft', int $target_season = 0): array|WP_Error
    {
        if (!in_array($new_status, array('draft', 'publish'), true)) {
            return new WP_Error('storm_nif_status', 'Ny kamp må opprettes som utkast eller publisert.');
        }

        $loaded = self::load_matches($fixture_path);
        if (is_wp_error($loaded)) {
            return $loaded;
        }

        $season_id = $target_season ?: self::active_season_id();
        if (is_wp_error($season_id)) {
            return $season_id;
        }
        if ($season_id < 1) {
            return new WP_Error('storm_nif_season', 'Ingen aktiv Storm-sesong er konfigurert.');
        }
        if (get_post_type($season_id) !== 'storm_season'
            || !in_array(get_post_status($season_id), array('publish', 'draft', 'pending'), true)) {
            return new WP_Error('storm_nif_season', 'Velg en gyldig Storm-sesong.');
        }

        $result = array(
            'source'     => $loaded['source'],
            'stale'      => $loaded['stale'],
            'fetched_at' => $loaded['fetched_at'],
            'received'   => count($loaded['matches']),
            'created'    => 0,
            'updated'    => 0,
            'unchanged'  => 0,
            'skipped'    => 0,
        );

        foreach ($loaded['matches'] as $match) {
            $start_year = (int) get_post_meta($season_id, 'storm_season_start_year', true);
            $match_date = new DateTimeImmutable($match['starts_at']);
            $match_date = $match_date->setTimezone(wp_timezone());
            $match_year = (int) $match_date->format('Y') - ((int) $match_date->format('n') < 7 ? 1 : 0);
            if ($match_year !== $start_year) {
                $result['skipped']++;
                continue;
            }
            $post_id = self::find_game($match, $season_id);
            if (is_wp_error($post_id)) {
                return $post_id;
            }
            if ($post_id > 0 && get_post_meta($post_id, 'storm_manual_override', true)) {
                $result['skipped']++;
                continue;
            }

            $meta = array(
                'storm_season_id'        => $season_id,
                'storm_external_id'      => 'nif:' . $match['id'],
                'storm_starts_at'        => $match['starts_at'],
                'storm_home_team'        => $match['home'],
                'storm_away_team'        => $match['away'],
                'storm_home_score'       => $match['home_score'],
                'storm_away_score'       => $match['away_score'],
                'storm_venue'            => $match['venue'],
                'storm_game_status'      => $match['status'],
                'storm_data_source'      => 'nif',
                'storm_stats_url'        => $match['url'],
            );
            $title = $match['home'] . ' – ' . $match['away'];
            $hash = hash('sha256', (string) wp_json_encode(array('title' => $title, 'meta' => $meta)));
            $existing_hash = $post_id > 0 ? (string) get_post_meta($post_id, '_storm_nif_payload_hash', true) : '';

            if ($post_id > 0 && hash_equals($existing_hash, $hash)) {
                $result['unchanged']++;
                continue;
            }

            if (!$execute) {
                $result[$post_id > 0 ? 'updated' : 'created']++;
                continue;
            }

            $post_data = array(
                'post_type'   => 'storm_game',
                'post_status' => $post_id > 0 ? get_post_status($post_id) : $new_status,
                'post_title'  => $title,
            );
            if ($post_id > 0) {
                $post_data['ID'] = $post_id;
            }

            $saved_id = wp_insert_post(wp_slash($post_data), true);
            if (is_wp_error($saved_id)) {
                return new WP_Error(
                    'storm_nif_save',
                    sprintf('Kunne ikke lagre NIF-kamp %d: %s', $match['id'], $saved_id->get_error_message())
                );
            }
            $post_id = (int) $saved_id;

            foreach ($meta as $meta_key => $value) {
                if ($value === '') {
                    delete_post_meta($post_id, $meta_key);
                } else {
                    update_post_meta($post_id, $meta_key, $value);
                }
            }
            update_post_meta($post_id, 'storm_source_updated_at', $loaded['fetched_at']);
            update_post_meta($post_id, '_storm_nif_payload_hash', $hash);
            update_post_meta($post_id, '_storm_nif_match_id', $match['id']);

            $result[isset($post_data['ID']) ? 'updated' : 'created']++;
        }

        return $result;
    }

    /**
     * @return array{source: string, stale: bool, fetched_at: string, matches: list<array<string, mixed>>}|WP_Error
     */
    private static function load_matches(string $fixture_path): array|WP_Error
    {
        if ($fixture_path !== '') {
            if (!is_readable($fixture_path)) {
                return new WP_Error('storm_nif_fixture', 'NIF-fixturen finnes ikke eller kan ikke leses.');
            }

            $payload = json_decode((string) file_get_contents($fixture_path), true);
            if (!is_array($payload)) {
                return new WP_Error('storm_nif_fixture', 'NIF-fixturen inneholder ikke gyldig JSON.');
            }

            return array(
                'source'     => 'fixture',
                'stale'      => false,
                'fetched_at' => current_time('c', true),
                'matches'    => self::normalize_matches($payload),
            );
        }

        if (!self::is_configured()) {
            return new WP_Error(
                'storm_nif_not_configured',
                'NIF_CLIENT_ID og NIF_CLIENT_SECRET mangler. Siste lokale kampdata beholdes uendret.'
            );
        }

        $fetched_at = current_time('c', true);
        $payload = self::fetch_remote_payload();
        if (is_wp_error($payload)) {
            self::record_failure($payload->get_error_message());
            $cache = get_option(self::CACHE_OPTION, array());
            if (!is_array($cache['payload'] ?? null)) {
                return $payload;
            }

            return array(
                'source'     => 'persistent-cache',
                'stale'      => true,
                'fetched_at' => (string) ($cache['fetched_at'] ?? ''),
                'matches'    => self::normalize_matches($cache['payload']),
            );
        }

        self::store_cache($payload, $fetched_at);
        self::record_success($fetched_at, count($payload));

        return array(
            'source'     => 'nif',
            'stale'      => false,
            'fetched_at' => $fetched_at,
            'matches'    => self::normalize_matches($payload),
        );
    }

    /**
     * @return list<array<string, mixed>>|WP_Error
     */
    private static function fetch_remote_payload(): array|WP_Error
    {
        $config = self::configuration();
        $token_response = wp_remote_post(
            self::TOKEN_URL,
            array(
                'timeout'     => 10,
                'redirection' => 2,
                'headers'     => array(
                    'Authorization' => 'Basic ' . base64_encode($config['client_id'] . ':' . $config['client_secret']),
                    'Content-Type'  => 'application/x-www-form-urlencoded',
                ),
                'body'        => array(
                    'grant_type' => 'client_credentials',
                    'scope'      => self::TOKEN_SCOPE,
                ),
            )
        );
        $token_body = self::decode_response($token_response, 'NIF token');
        if (is_wp_error($token_body)) {
            return $token_body;
        }

        $token = isset($token_body['access_token']) ? trim((string) $token_body['access_token']) : '';
        if ($token === '') {
            return new WP_Error('storm_nif_token', 'NIF returnerte ikke et tilgangstoken.');
        }

        $matches_response = wp_remote_get(
            self::MATCHES_URL . '/' . rawurlencode($config['org_id']),
            array(
                'timeout'     => 10,
                'redirection' => 2,
                'headers'     => array('Authorization' => 'Bearer ' . $token),
            )
        );
        $matches = self::decode_response($matches_response, 'NIF kampdata');
        if (is_wp_error($matches)) {
            return $matches;
        }

        if (!array_is_list($matches)) {
            return new WP_Error('storm_nif_shape', 'NIF kampdata hadde uventet format.');
        }

        return $matches;
    }

    /**
     * @param array<string, mixed>|WP_Error $response
     * @return array<string, mixed>|list<mixed>|WP_Error
     */
    private static function decode_response(array|WP_Error $response, string $service): array|WP_Error
    {
        if (is_wp_error($response)) {
            return new WP_Error('storm_nif_http', $service . ' kunne ikke nås: ' . $response->get_error_message());
        }

        $status = wp_remote_retrieve_response_code($response);
        if ($status < 200 || $status >= 300) {
            return new WP_Error('storm_nif_http', sprintf('%s svarte med HTTP %d.', $service, $status));
        }

        $decoded = json_decode(wp_remote_retrieve_body($response), true);
        if (!is_array($decoded)) {
            return new WP_Error('storm_nif_json', $service . ' returnerte ugyldig JSON.');
        }

        return $decoded;
    }

    /**
     * @param list<mixed> $payload
     * @return list<array<string, mixed>>
     */
    public static function normalize_matches(array $payload): array
    {
        $matches = array();

        foreach ($payload as $row) {
            if (!is_array($row)) {
                continue;
            }

            $id = absint($row['matchId'] ?? $row['id'] ?? 0);
            $date = substr(sanitize_text_field((string) ($row['matchDate'] ?? '')), 0, 10);
            $time = self::normalize_time($row['matchStartTime'] ?? '');
            $home = self::team_name((string) ($row['hometeam'] ?? ''));
            $away = self::team_name((string) ($row['awayteam'] ?? ''));
            if ($id < 1 || !self::valid_date($date) || $time === '' || $home === '' || $away === '') {
                continue;
            }

            [$home_score, $away_score] = self::scores($row);
            $matches[$id] = array(
                'id'         => $id,
                'starts_at'  => (new DateTimeImmutable($date . ' ' . $time, wp_timezone()))->format(DATE_RFC3339),
                'venue'      => sanitize_text_field((string) ($row['activityAreaName'] ?? '')),
                'home'       => $home,
                'away'       => $away,
                'status'     => self::game_status((string) ($row['statusType'] ?? ''), $home_score, $away_score),
                'home_score' => $home_score,
                'away_score' => $away_score,
                'url'        => 'https://wp.nif.no/MatchDetails?id=' . $id,
            );
        }

        $matches = array_values($matches);
        usort($matches, static fn(array $left, array $right): int => strcmp($left['starts_at'], $right['starts_at']));

        return $matches;
    }

    private static function normalize_time(mixed $value): string
    {
        $value = trim((string) $value);
        if (preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $value)) {
            return $value;
        }

        $digits = preg_replace('/\D+/', '', $value);
        if (!is_string($digits) || $digits === '') {
            return '';
        }

        $digits = str_pad($digits, 4, '0', STR_PAD_LEFT);
        $formatted = substr($digits, 0, 2) . ':' . substr($digits, 2, 2);

        return preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $formatted) ? $formatted : '';
    }

    private static function team_name(string $name): string
    {
        $name = preg_replace('/\s+-\s+MEN\s+1$/i', '', sanitize_text_field($name));
        $name = is_string($name) ? trim($name) : '';
        $aliases = array(
            'Ammerud BLNO' => 'Ammerud',
            'Tønsberg, Nøtterøy, Tjøme Basket Klubb' => 'TNT Towers',
        );
        $editor_aliases = get_option('storm_nif_team_aliases', array());
        if (is_array($editor_aliases)) {
            $aliases = array_merge($aliases, $editor_aliases);
        }

        return isset($aliases[$name]) ? sanitize_text_field((string) $aliases[$name]) : $name;
    }

    /**
     * @param array<string, mixed> $row
     * @return array{0: int, 1: int}
     */
    private static function scores(array $row): array
    {
        $home_keys = array('homeScore', 'hometeamScore', 'homeTeamScore');
        $away_keys = array('awayScore', 'awayteamScore', 'awayTeamScore');
        $home = null;
        $away = null;

        foreach ($home_keys as $key) {
            if (isset($row[$key]) && is_numeric($row[$key])) {
                $home = max(0, (int) $row[$key]);
                break;
            }
        }
        foreach ($away_keys as $key) {
            if (isset($row[$key]) && is_numeric($row[$key])) {
                $away = max(0, (int) $row[$key]);
                break;
            }
        }

        if (($home === null || $away === null) && preg_match('/(\d+)\s*[-–:]\s*(\d+)/', (string) ($row['matchResult'] ?? ''), $matches)) {
            $home = (int) $matches[1];
            $away = (int) $matches[2];
        }

        return array($home ?? 0, $away ?? 0);
    }

    private static function game_status(string $status, int $home_score, int $away_score): string
    {
        $status = strtolower(remove_accents(trim($status)));
        if (str_contains($status, 'cancel')) {
            return 'cancelled';
        }
        if (str_contains($status, 'postpon')) {
            return 'postponed';
        }
        if (str_contains($status, 'live') || str_contains($status, 'ongoing')) {
            return 'live';
        }
        if (str_contains($status, 'finish') || str_contains($status, 'complete') || $home_score > 0 || $away_score > 0) {
            return 'finished';
        }

        return 'scheduled';
    }

    private static function valid_date(string $value): bool
    {
        if (!preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $value, $matches)) {
            return false;
        }

        return checkdate((int) $matches[2], (int) $matches[3], (int) $matches[1]);
    }

    /**
     * @param array<string, mixed> $match
     */
    private static function find_game(array $match, int $season_id): int|WP_Error
    {
        $external_id = 'nif:' . $match['id'];
        $ids = get_posts(
            array(
                'post_type'      => 'storm_game',
                'post_status'    => 'any',
                'posts_per_page' => 2,
                'fields'         => 'ids',
                'meta_key'       => 'storm_external_id',
                'meta_value'     => $external_id,
                'no_found_rows'  => true,
            )
        );
        if (count($ids) > 1) {
            return new WP_Error(
                'storm_nif_duplicate',
                sprintf('Flere lokale kamper har samme NIF-ID %d. Synken ble stoppet.', $match['id'])
            );
        }
        if (isset($ids[0])) {
            return (int) $ids[0];
        }

        $candidates = get_posts(
            array(
                'post_type'      => 'storm_game',
                'post_status'    => 'any',
                'posts_per_page' => 10,
                'fields'         => 'ids',
                'meta_query'     => array(
                    'relation' => 'AND',
                    array('key' => 'storm_season_id', 'value' => $season_id),
                    array('key' => 'storm_starts_at', 'value' => $match['starts_at']),
                ),
                'no_found_rows'  => true,
            )
        );
        $matching_candidates = array();
        foreach ($candidates as $candidate_id) {
            $home = (string) get_post_meta((int) $candidate_id, 'storm_home_team', true);
            $away = (string) get_post_meta((int) $candidate_id, 'storm_away_team', true);
            if (strcasecmp(remove_accents($home), remove_accents((string) $match['home'])) === 0
                && strcasecmp(remove_accents($away), remove_accents((string) $match['away'])) === 0) {
                $matching_candidates[] = (int) $candidate_id;
            }
        }

        if (count($matching_candidates) > 1) {
            return new WP_Error(
                'storm_nif_duplicate',
                sprintf('Flere lokale kamper matcher NIF-kamp %d på tid og lag. Synken ble stoppet.', $match['id'])
            );
        }

        if (isset($matching_candidates[0])) {
            return $matching_candidates[0];
        }

        return 0;
    }

    private static function active_season_id(): int|WP_Error
    {
        $ids = get_posts(
            array(
                'post_type'      => 'storm_season',
                'post_status'    => 'any',
                'posts_per_page' => 2,
                'fields'         => 'ids',
                'meta_key'       => 'storm_is_active',
                'meta_value'     => '1',
                'no_found_rows'  => true,
            )
        );

        if (count($ids) > 1) {
            return new WP_Error('storm_nif_season', 'Flere Storm-sesonger er markert som aktive. Synken ble stoppet.');
        }

        return isset($ids[0]) ? (int) $ids[0] : 0;
    }

    /**
     * @param list<mixed> $payload
     */
    private static function store_cache(array $payload, string $fetched_at): void
    {
        $value = array(
            'schema_version' => 1,
            'fetched_at'     => $fetched_at,
            'payload'        => $payload,
        );
        if (get_option(self::CACHE_OPTION, null) === null) {
            add_option(self::CACHE_OPTION, $value, '', false);
        } else {
            update_option(self::CACHE_OPTION, $value, false);
        }
    }

    private static function record_success(string $fetched_at, int $count): void
    {
        update_option(
            self::STATE_OPTION,
            array(
                'last_attempt_at' => $fetched_at,
                'last_success_at' => $fetched_at,
                'failure_count'   => 0,
                'last_error'      => '',
                'match_count'     => $count,
            ),
            false
        );
    }

    private static function record_failure(string $message): void
    {
        $state = get_option(self::STATE_OPTION, array());
        update_option(
            self::STATE_OPTION,
            array(
                'last_attempt_at' => current_time('c', true),
                'last_success_at' => (string) ($state['last_success_at'] ?? ''),
                'failure_count'   => (int) ($state['failure_count'] ?? 0) + 1,
                'last_error'      => sanitize_text_field($message),
                'match_count'     => (int) ($state['match_count'] ?? 0),
            ),
            false
        );
    }

    public static function register_admin_page(): void
    {
        add_submenu_page(
            'storm-club',
            'NIF-synkronisering',
            'NIF-synk',
            'edit_storm_records',
            'storm-nif',
            array(__CLASS__, 'render_admin_page')
        );
    }

    public static function render_admin_page(): void
    {
        if (!current_user_can('edit_storm_records')) {
            wp_die(esc_html__('Du har ikke tilgang til denne siden.', 'storm-core'));
        }

        $status = self::status();
        echo '<div class="wrap"><h1>' . esc_html__('NIF-synkronisering', 'storm-core') . '</h1>';
        if (isset($_GET['aliases_updated'])) {
            echo '<div class="notice notice-success inline"><p>' . esc_html__('Lagnavnene er lagret.', 'storm-core') . '</p></div>';
        }
        if (isset($_GET['alias_error'])) {
            echo '<div class="notice notice-error inline"><p>' . esc_html__('Lagnavnene ble ikke lagret. Bruk formatet «Navn fra NIF=Visningsnavn», én regel per linje.', 'storm-core') . '</p></div>';
        }
        echo '<p>' . esc_html__('Kampdata lagres lokalt. Ved NIF-feil beholdes siste gyldige svar og manuelt låste kamper endres aldri.', 'storm-core') . '</p>';
        echo '<table class="widefat striped" style="max-width:760px"><tbody>';
        self::admin_row('Konfigurert', $status['configured'] ? 'Ja' : 'Nei – legitimasjon mangler');
        self::admin_row('Klubb-ID', (string) $status['org_id']);
        self::admin_row('Klient', $status['client_id_suffix'] !== '' ? '••••' . $status['client_id_suffix'] : 'Ikke satt');
        self::admin_row('Siste forsøk', (string) $status['last_attempt_at']);
        self::admin_row('Siste vellykkede synk', (string) $status['last_success_at']);
        self::admin_row('Cache', sprintf('%d kamper, hentet %s', $status['cached_matches'], $status['cached_at'] ?: 'aldri'));
        self::admin_row('Påfølgende feil', (string) $status['failure_count']);
        self::admin_row('Siste feil', (string) $status['last_error']);
        echo '</tbody></table>';
        echo '<h2>' . esc_html__('Lagnavn', 'storm-core') . '</h2>';
        echo '<p>' . esc_html__('Én regel per linje: navnet fra NIF, likhetstegn og ønsket visningsnavn.', 'storm-core') . '</p>';
        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '" style="max-width:760px">';
        echo '<input type="hidden" name="action" value="storm_nif_save_aliases">';
        wp_nonce_field('storm_nif_save_aliases');
        echo '<textarea class="large-text code" rows="8" name="aliases">' . esc_textarea(self::aliases_text()) . '</textarea>';
        submit_button(__('Lagre lagnavn', 'storm-core'));
        echo '</form>';
        echo '<p><code>wp storm nif sync</code> viser endringer uten å skrive. Bruk <code>--execute --yes</code> etter kontroll.</p>';
        echo '</div>';
    }

    private static function admin_row(string $label, string $value): void
    {
        echo '<tr><th scope="row">' . esc_html($label) . '</th><td>' . esc_html($value !== '' ? $value : '—') . '</td></tr>';
    }

    public static function save_aliases(): void
    {
        if (!current_user_can('edit_storm_records')) {
            wp_die(esc_html__('Du har ikke tilgang til denne handlingen.', 'storm-core'));
        }

        check_admin_referer('storm_nif_save_aliases');
        $text = isset($_POST['aliases']) ? sanitize_textarea_field(wp_unslash($_POST['aliases'])) : '';
        $aliases = array();

        foreach (preg_split('/\R/', $text) ?: array() as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            $parts = array_map('trim', explode('=', $line, 2));
            if (count($parts) !== 2 || $parts[0] === '' || $parts[1] === '') {
                wp_safe_redirect(add_query_arg(array('page' => 'storm-nif', 'alias_error' => 1), admin_url('admin.php')));
                exit;
            }

            $aliases[sanitize_text_field($parts[0])] = sanitize_text_field($parts[1]);
        }

        update_option('storm_nif_team_aliases', $aliases, false);
        wp_safe_redirect(add_query_arg(array('page' => 'storm-nif', 'aliases_updated' => 1), admin_url('admin.php')));
        exit;
    }

    private static function aliases_text(): string
    {
        $aliases = get_option('storm_nif_team_aliases', array());
        if (!is_array($aliases)) {
            return '';
        }

        $lines = array();
        foreach ($aliases as $source => $display) {
            $lines[] = $source . '=' . $display;
        }

        return implode("\n", $lines);
    }

    public static function render_failure_notice(): void
    {
        if (!current_user_can('edit_storm_records')) {
            return;
        }

        $state = get_option(self::STATE_OPTION, array());
        $failures = (int) ($state['failure_count'] ?? 0);
        if ($failures < 3) {
            return;
        }

        $url = admin_url('admin.php?page=storm-nif');
        echo '<div class="notice notice-warning"><p>';
        echo esc_html(sprintf('NIF-synkronisering har feilet %d ganger på rad. Siste lokale kampdata brukes fortsatt.', $failures));
        echo ' <a href="' . esc_url($url) . '">' . esc_html__('Se status', 'storm-core') . '</a>';
        echo '</p></div>';
    }
}

final class Storm_Core_Nif_Command
{
    /**
     * Shows configuration, cache and failure status without exposing secrets.
     *
     * ## OPTIONS
     *
     * [--format=<format>]
     * : table or json. Default: table.
     *
     * @param list<string> $args
     * @param array<string, mixed> $assoc_args
     */
    public function status(array $args, array $assoc_args): void
    {
        unset($args);
        $format = isset($assoc_args['format']) ? sanitize_key((string) $assoc_args['format']) : 'table';
        if (!in_array($format, array('table', 'json'), true)) {
            WP_CLI::error('Format must be table or json.');
        }

        $status = Storm_Core_Nif::status();
        $rows = array();
        foreach ($status as $key => $value) {
            $rows[] = array(
                'key'   => $key,
                'value' => is_bool($value) ? ($value ? 'yes' : 'no') : (string) $value,
            );
        }
        WP_CLI\Utils\format_items($format, $rows, array('key', 'value'));
    }

    /**
     * Fetches and compares NIF matches. It writes only with --execute.
     *
     * ## OPTIONS
     *
     * [--fixture=<path>]
     * : Read a local JSON fixture instead of contacting NIF.
     *
     * [--execute]
     * : Persist changes to local storm_game records.
     *
     * [--status=<status>]
     * : Status for new games: draft or publish. Default: draft.
     *
     * [--yes]
     * : Confirm writes non-interactively.
     *
     * [--format=<format>]
     * : table or json. Default: table.
     *
     * @param list<string> $args
     * @param array<string, mixed> $assoc_args
     */
    public function sync(array $args, array $assoc_args): void
    {
        unset($args);
        $execute = isset($assoc_args['execute']);
        $fixture = isset($assoc_args['fixture']) ? (string) $assoc_args['fixture'] : '';
        $status = isset($assoc_args['status']) ? sanitize_key((string) $assoc_args['status']) : 'draft';
        $format = isset($assoc_args['format']) ? sanitize_key((string) $assoc_args['format']) : 'table';
        if (!in_array($format, array('table', 'json'), true)) {
            WP_CLI::error('Format must be table or json.');
        }
        if ($execute) {
            WP_CLI::confirm('Store normalized NIF matches in Storm Core?', $assoc_args);
        }

        $result = Storm_Core_Nif::sync($execute, $fixture, $status);
        if (is_wp_error($result)) {
            WP_CLI::error($result->get_error_message());
        }

        $rows = array();
        foreach ($result as $key => $value) {
            $rows[] = array(
                'key'   => $key,
                'value' => is_bool($value) ? ($value ? 'yes' : 'no') : (string) $value,
            );
        }
        WP_CLI\Utils\format_items($format, $rows, array('key', 'value'));

        if (!$execute) {
            WP_CLI::log('Dry run: no storm_game records were changed.');
        } elseif ($result['stale']) {
            WP_CLI::warning('NIF was unavailable. The persistent last-valid cache was used.');
        } else {
            WP_CLI::success('NIF matches were stored locally.');
        }
    }
}
