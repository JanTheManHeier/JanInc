<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Migration
{
    private static bool $registered = false;

    public static function register_command(): void
    {
        if (self::$registered || !class_exists('WP_CLI')) {
            return;
        }

        WP_CLI::add_command('storm migrate', 'Storm_Core_Migration_Command');
        self::$registered = true;
    }
}

/**
 * Reports how legacy Tromsø Storm content maps into Storm Core.
 *
 * ## OPTIONS
 *
 * [--domain=<domain>]
 * : Limit the report to content, seasons, games, players, staff, sponsors or training.
 *
 * [--format=<format>]
 * : Output format. Accepted values: table, json, csv. Default: table.
 *
 * [--fail-on-invalid]
 * : Exit non-zero when any source rows cannot be mapped safely.
 *
 * [--execute]
 * : Write mapped records. Without this flag the command is always read-only.
 *
 * [--status=<status>]
 * : Status for newly imported records. Accepted values: draft, publish. Default: draft.
 *
 * [--force]
 * : Replace records changed after an earlier import. Without this flag they are conflicts.
 *
 * [--yes]
 * : Confirm the write operation non-interactively.
 *
 * [--verbose]
 * : Log each created, updated, conflicted or skipped record.
 */
final class Storm_Core_Migration_Command
{
    /**
     * @var array<int, int>
     */
    private array $season_ids = array();
    private bool $verbose = false;

    /**
     * @param list<string> $args
     * @param array<string, mixed> $assoc_args
     */
    public function __invoke(array $args, array $assoc_args): void
    {
        unset($args);
        $this->verbose = isset($assoc_args['verbose']);

        $format = isset($assoc_args['format']) ? sanitize_key((string) $assoc_args['format']) : 'table';
        if (!in_array($format, array('table', 'json', 'csv'), true)) {
            WP_CLI::error('Format must be table, json or csv.');
        }

        $domain = isset($assoc_args['domain']) ? sanitize_key((string) $assoc_args['domain']) : '';
        $allowed_domains = array('content', 'seasons', 'games', 'players', 'staff', 'sponsors', 'training');
        if ($domain !== '' && !in_array($domain, $allowed_domains, true)) {
            WP_CLI::error('Unknown domain. Use content, seasons, games, players, staff, sponsors or training.');
        }

        if (isset($assoc_args['execute'])) {
            $status = isset($assoc_args['status']) ? sanitize_key((string) $assoc_args['status']) : 'draft';
            if (!in_array($status, array('draft', 'publish'), true)) {
                WP_CLI::error('Import status must be draft or publish.');
            }

            WP_CLI::confirm(
                sprintf('Import legacy Storm data as %s records?', $status),
                $assoc_args
            );

            $fixture_tables = $this->find_tables('/^Storm_Terminliste(?:_\d{4})?$/');
            $season_map = $this->season_map($fixture_tables);
            $results = $this->execute_import(
                $domain,
                $status,
                isset($assoc_args['force']),
                $fixture_tables,
                $season_map
            );
            WP_CLI\Utils\format_items(
                $format,
                $results,
                array('domain', 'created', 'updated', 'unchanged', 'conflicts', 'skipped')
            );

            $conflicts = array_sum(array_map(static fn(array $row): int => (int) $row['conflicts'], $results));
            if ($conflicts > 0) {
                WP_CLI::warning(sprintf('%d records were not overwritten because they contain changes made after import.', $conflicts));
            }
            WP_CLI::success('Storm import completed. Source tables were not changed.');
            return;
        }

        $rows = $this->build_report($domain);
        WP_CLI\Utils\format_items(
            $format,
            $rows,
            array('domain', 'source', 'season', 'rows', 'valid', 'invalid', 'target', 'notes')
        );

        $invalid = array_sum(array_map(static fn(array $row): int => (int) $row['invalid'], $rows));
        WP_CLI::log(sprintf('Report only: %d source rows require manual handling. No data was changed.', $invalid));

        if (isset($assoc_args['fail-on-invalid']) && $invalid > 0) {
            WP_CLI::halt(2);
        }
    }

        /**
         * @param list<string> $fixture_tables
         * @param array<string, int> $season_map
         * @return list<array<string, int|string>>
         */
        private function execute_import(string $domain, string $status, bool $force, array $fixture_tables, array $season_map): array
        {
            $results = array();
            $requires_seasons = $domain === '' || in_array($domain, array('seasons', 'games', 'players', 'staff', 'sponsors', 'training'), true);

            if ($domain === '' || $domain === 'content') {
                $count = array_sum(array_map(static fn(array $row): int => (int) $row['rows'], $this->content_report()));
                $results[] = $this->import_result('content', 0, 0, 0, 0, $count);
            }

            if ($requires_seasons) {
                $results[] = $this->import_seasons($season_map, $status, $force);
            }

            if ($domain === '' || $domain === 'games') {
                $results[] = $this->import_games($fixture_tables, $season_map, $status, $force);
            }
            if ($domain === '' || $domain === 'players') {
                $results[] = $this->import_people('players', 'Storm_Spillere', 'storm_player', 'player', $season_map, $status, $force);
            }
            if ($domain === '' || $domain === 'staff') {
                $results[] = $this->import_people('staff', 'Storm_Trenere', 'storm_staff', 'staff', $season_map, $status, $force);
            }
            if ($domain === '' || $domain === 'sponsors') {
                $results[] = $this->import_sponsors($status, $force);
            }
            if ($domain === '' || $domain === 'training') {
                $results[] = $this->import_training($status, $force);
            }

            return $results;
        }

        /**
         * @param array<string, int> $season_map
         * @return array<string, int|string>
         */
        private function import_seasons(array $season_map, string $status, bool $force): array
        {
            $result = $this->import_result('seasons');
            $starts = array_values(array_unique(array_values($season_map)));
            sort($starts);
            foreach ($starts as $start_year) {
                $source_key = 'season:' . $start_year;
                $operation = $this->upsert_record(
                    'storm_season',
                    $source_key,
                    array(
                        'post_title'   => $this->season_label($start_year),
                        'post_content' => '',
                        'meta'         => array(
                            'storm_season_start_year' => $start_year,
                            'storm_season_end_year'   => $start_year + 1,
                            'storm_season_starts_at'  => sprintf('%d-07-01', $start_year),
                            'storm_season_ends_at'    => sprintf('%d-06-30', $start_year + 1),
                            'storm_is_active'         => false,
                            'storm_nif_standings_id'  => $start_year === 2026 ? 449378 : 0,
                        ),
                    ),
                    $status,
                    $force
                );
                $this->increment_result($result, $operation);

                $season_id = $this->find_record('storm_season', '_storm_legacy_key', $source_key);
                if ($season_id > 0) {
                    $this->season_ids[$start_year] = $season_id;
                }
            }

            return $result;
        }

        /**
         * @param list<string> $tables
         * @param array<string, int> $season_map
         * @return array<string, int|string>
         */
        private function import_games(array $tables, array $season_map, string $status, bool $force): array
        {
            $result = $this->import_result('games');

            foreach ($tables as $table) {
                $season_start = $season_map[$table] ?? 0;
                $season_id = $this->season_ids[$season_start] ?? 0;
                if ($season_id < 1) {
                    WP_CLI::error('No imported season exists for ' . $table . '.');
                }

                foreach ($this->table_rows($table) as $row) {
                    $date = $this->normalize_source_date((string) ($row->Dato ?? ''));
                    $time = $this->normalize_source_time((string) ($row->Tid ?? ''));
                    if ($date === null || $time === null) {
                        $this->increment_result($result, 'skipped');
                        continue;
                    }

                    $home = trim((string) ($row->Hjemmelag ?? ''));
                    $away = trim((string) ($row->Bortelag ?? ''));
                    if ($home === '' || $away === '') {
                        $this->increment_result($result, 'skipped');
                        continue;
                    }

                    $starts_at = (new DateTimeImmutable($date . ' ' . $time, wp_timezone()))->format(DATE_RFC3339);
                    $home_score = max(0, (int) ($row->Resultat_hjemmelag ?? 0));
                    $away_score = max(0, (int) ($row->Resultat_bortelag ?? 0));
                    $source_key = $table . ':' . (int) $row->ID;
                    $operation = $this->upsert_record(
                        'storm_game',
                        $source_key,
                        array(
                            'post_title'   => $home . ' – ' . $away,
                            'post_content' => '',
                            'meta'         => array(
                                'storm_season_id'        => $season_id,
                                'storm_external_id'      => 'legacy:' . $source_key,
                                'storm_starts_at'        => $starts_at,
                                'storm_home_team'        => $home,
                                'storm_away_team'        => $away,
                                'storm_home_score'       => $home_score,
                                'storm_away_score'       => $away_score,
                                'storm_home_fouls'       => 0,
                                'storm_away_fouls'       => 0,
                                'storm_period'           => 0,
                                'storm_clock_seconds'    => 0,
                                'storm_venue'            => trim((string) ($row->Sted ?? '')),
                                'storm_game_status'      => ($home_score > 0 || $away_score > 0) ? 'finished' : 'scheduled',
                                'storm_data_source'      => 'legacy',
                                'storm_manual_override'  => false,
                                'storm_stats_url'        => esc_url_raw((string) ($row->Link_statistikk ?? '')),
                                '_storm_source_order'    => max(0, (int) ($row->Rekkefolge ?? 0)),
                            ),
                        ),
                        $status,
                        $force
                    );
                    $this->increment_result($result, $operation);
                }
            }

            return $result;
        }

        /**
         * @param array<string, int> $season_map
         * @return array<string, int|string>
         */
        private function import_people(
            string $domain,
            string $base_table,
            string $profile_post_type,
            string $person_type,
            array $season_map,
            string $status,
            bool $force
        ): array {
            $result = $this->import_result($domain);
            $tables = $this->find_tables('/^' . preg_quote($base_table, '/') . '(?:_\d{4})?$/');

            foreach ($tables as $table) {
                $season_start = $this->season_for_people_table($table, $base_table, $season_map);
                $season_id = $this->season_ids[$season_start] ?? 0;
                if ($season_id < 1) {
                    WP_CLI::error('No imported season exists for ' . $table . '.');
                }
                $source_rank = $this->source_rank($table, $base_table, $season_start);

                foreach ($this->table_rows($table) as $row) {
                    $name = trim((string) ($row->Navn ?? ''));
                    if ($name === '') {
                        $this->increment_result($result, 'skipped');
                        continue;
                    }

                    $identity_key = $person_type . ':' . sanitize_title(remove_accents($name));
                    $profile_meta = array(
                        'storm_external_id'   => 'legacy-name:' . $identity_key,
                        '_storm_legacy_image' => trim((string) ($row->Bilde ?? '')),
                        '_storm_source_rank'  => $source_rank,
                    );
                    if ($person_type === 'player') {
                        $profile_meta['storm_height_cm'] = max(0, (int) ($row->Hoyde ?? 0));
                        $profile_meta['storm_weight_kg'] = max(0, (int) ($row->Vekt ?? 0));
                        $profile_meta['storm_elite_years'] = max(0, (int) ($row->Antall_aar ?? 0));
                        $profile_meta['_storm_birth_year'] = trim((string) ($row->Fodt ?? ''));
                        $profile_meta['storm_birth_year'] = preg_match('/^\d{4}$/', $profile_meta['_storm_birth_year'])
                            ? (int) $profile_meta['_storm_birth_year'] : 0;
                    } else {
                        $profile_meta['storm_staff_role'] = trim((string) ($row->Oppgave ?? ''));
                    }

                    $profile_operation = $this->upsert_record(
                        $profile_post_type,
                        $table . ':' . (int) $row->ID,
                        array(
                            'post_title'   => $name,
                            'post_content' => wp_kses_post((string) ($row->Diverse ?? '')),
                            'meta'         => $profile_meta,
                        ),
                        $status,
                        $force,
                        $identity_key,
                        $source_rank
                    );
                    $this->increment_result($result, $profile_operation);

                    $profile_id = $this->find_record($profile_post_type, '_storm_identity_key', $identity_key);
                    if ($profile_id < 1) {
                        $this->increment_result($result, 'skipped');
                        continue;
                    }

                    $position = $person_type === 'player'
                        ? trim((string) ($row->Posisjon ?? ''))
                        : trim((string) ($row->Oppgave ?? ''));
                    $roster_key = 'roster:' . $table . ':' . (int) $row->ID;
                    $roster_meta = array(
                        'storm_season_id' => $season_id, 'storm_person_id' => $profile_id,
                        'storm_person_type' => $person_type, 'storm_position' => $position,
                        'storm_is_captain' => false,
                        'storm_sort_order' => max(0, (int) ($row->Sort_ID ?? $row->ID ?? 0)),
                        'storm_is_active' => true,
                    );
                    if ($person_type === 'player' && isset($row->Drakt_nummer) && trim((string) $row->Drakt_nummer) !== '') {
                        $roster_meta['storm_jersey_number'] = max(0, (int) $row->Drakt_nummer);
                    }
                    $roster_operation = $this->upsert_record(
                        'storm_roster_entry',
                        $roster_key,
                        array(
                            'post_title'   => $name . ' — ' . $this->season_label($season_start),
                            'post_content' => '',
                            'meta'         => $roster_meta,
                        ),
                        $status,
                        $force
                    );
                    $this->increment_result($result, $roster_operation);
                }
            }

            return $result;
        }

        /**
         * @return array<string, int|string>
         */
        private function import_sponsors(string $status, bool $force): array
        {
            $result = $this->import_result('sponsors');
            $season_start = $this->current_season_start();
            $season_id = $this->season_ids[$season_start] ?? 0;
            if ($season_id < 1) {
                WP_CLI::error('No active season exists for sponsor import.');
            }

            foreach ($this->table_rows('Storm_Sponsor') as $row) {
                $name = trim((string) ($row->Navn ?? ''));
                $level = $this->sponsor_level((string) ($row->Sponsortype ?? ''));
                if ($name === '' || $level === '') {
                    $this->increment_result($result, 'skipped');
                    continue;
                }

                $identity_key = 'sponsor:' . sanitize_title(remove_accents($name));
                $profile_operation = $this->upsert_record(
                    'storm_sponsor',
                    'Storm_Sponsor:' . (int) $row->ID,
                    array(
                        'post_title'   => $name,
                        'post_content' => wp_kses_post((string) ($row->Tekst ?? '')),
                        'meta'         => array(
                            'storm_website_url'   => esc_url_raw((string) ($row->Link ?? '')),
                            '_storm_legacy_image' => trim((string) ($row->Bilde ?? '')),
                            '_storm_source_rank'  => 9999,
                        ),
                    ),
                    $status,
                    $force,
                    $identity_key,
                    9999
                );
                $this->increment_result($result, $profile_operation);

                $sponsor_id = $this->find_record('storm_sponsor', '_storm_identity_key', $identity_key);
                if ($sponsor_id < 1) {
                    $this->increment_result($result, 'skipped');
                    continue;
                }

                $deal_operation = $this->upsert_record(
                    'storm_sponsor_deal',
                    'sponsor-deal:Storm_Sponsor:' . (int) $row->ID . ':' . $season_start,
                    array(
                        'post_title'   => $name . ' — ' . $this->season_label($season_start),
                        'post_content' => '',
                        'meta'         => array(
                            'storm_sponsor_id' => $sponsor_id,
                            'storm_season_id'  => $season_id,
                            'storm_level'      => $level,
                            'storm_sort_order' => max(0, (int) ($row->Sort_ID ?? 0)),
                            'storm_is_active'  => true,
                        ),
                    ),
                    $status,
                    $force
                );
                $this->increment_result($result, $deal_operation);
            }

            foreach (array('Storm_Stottemedlem_Bed_Pic' => 'business', 'Storm_Stottemedlem_Pers' => 'person') as $table => $kind) {
                if (!$this->table_exists($table)) {
                    continue;
                }
                foreach ($this->table_rows($table) as $row) {
                    $name = trim((string) ($row->Navn ?? ''));
                    if ($name === '' || (int) ($row->ID ?? 0) < 1) {
                        $this->increment_result($result, 'skipped');
                        continue;
                    }
                    $source_key = $table . ':' . (int) $row->ID;
                    $identity = 'member:' . $source_key;
                    $operation = $this->upsert_record('storm_sponsor', $source_key, array(
                        'post_title' => $name, 'post_content' => '',
                        'meta' => array(
                            'storm_member_kind' => $kind,
                            'storm_website_url' => esc_url_raw((string) ($row->Link ?? '')),
                            '_storm_legacy_image' => trim((string) ($row->BildePlassering ?? '')),
                        ),
                    ), $status, $force, $identity);
                    $this->increment_result($result, $operation);
                    $profile_id = $this->find_record('storm_sponsor', '_storm_identity_key', $identity);
                    if (!$profile_id) {
                        $this->increment_result($result, 'skipped');
                        continue;
                    }
                    $operation = $this->upsert_record('storm_sponsor_deal', 'member-deal:' . $source_key . ':' . $season_start, array(
                        'post_title' => $name . ' — ' . $this->season_label($season_start), 'post_content' => '',
                        'meta' => array('storm_sponsor_id' => $profile_id, 'storm_season_id' => $season_id, 'storm_level' => 'member', 'storm_is_active' => true),
                    ), $status, $force);
                    $this->increment_result($result, $operation);
                }
            }

            return $result;
        }

        /**
         * @return array<string, int|string>
         */
        private function import_training(string $status, bool $force): array
        {
            $result = $this->import_result('training');
            $season_start = $this->current_season_start();
            $season_id = $this->season_ids[$season_start] ?? 0;
            if ($season_id < 1) {
                WP_CLI::error('No active season exists for training import.');
            }

            foreach ($this->table_rows('Storm_Treningstider') as $row) {
                $weekday = $this->weekday_number((string) ($row->Dag ?? ''));
                $times = $this->parse_time_range((string) ($row->Tid ?? ''));
                $venue = trim((string) ($row->Sted ?? ''));
                if ($weekday === 0 || $times === null || $venue === '') {
                    $this->increment_result($result, 'skipped');
                    continue;
                }

                $source_key = 'Storm_Treningstider:' . (int) $row->ID;
                $operation = $this->upsert_record(
                    'storm_training',
                    $source_key,
                    array(
                        'post_title'   => 'Tromsø Storm herrer — ' . $times[0],
                        'post_content' => '',
                        'meta'         => array(
                            'storm_season_id'   => $season_id,
                            'storm_team'        => 'Tromsø Storm herrer',
                            'storm_weekday'     => $weekday,
                            'storm_starts_time' => $times[0],
                            'storm_ends_time'   => $times[1],
                            'storm_venue'       => $venue,
                            'storm_sort_order'  => max(0, (int) ($row->ID ?? 0)),
                        ),
                    ),
                    $status,
                    $force
                );
                $this->increment_result($result, $operation);
            }

            return $result;
        }

        /**
         * @param array{post_title: string, post_content: string, meta: array<string, mixed>} $payload
         */
        private function upsert_record(
            string $post_type,
            string $source_key,
            array $payload,
            string $status,
            bool $force,
            string $identity_key = '',
            int $source_rank = 0
        ): string {
            $lookup_key = $identity_key !== '' ? '_storm_identity_key' : '_storm_legacy_key';
            $lookup_value = $identity_key !== '' ? $identity_key : $source_key;
            $post_id = $this->find_record($post_type, $lookup_key, $lookup_value);
            $source_hash = hash('sha256', (string) wp_json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

            if ($post_id > 0 && $post_type === 'storm_game' && get_post_meta($post_id, 'storm_manual_override', true)) {
                $this->log_operation('skipped', $post_type, $source_key, $post_id);
                return 'skipped';
            }

            if ($post_id > 0 && $identity_key !== '') {
                $stored_rank = (int) get_post_meta($post_id, '_storm_source_rank', true);
                if ($stored_rank > $source_rank) {
                    $this->add_legacy_source($post_id, $source_key);
                    return 'unchanged';
                }
            }

            $changed_since_import = $post_id > 0 && $this->record_changed_since_import($post_id, $payload);
            if ($post_id > 0 && !$force && $changed_since_import) {
                $this->log_operation('conflict', $post_type, $source_key, $post_id);
                return 'conflict';
            }

            if ($post_id > 0 && !$changed_since_import && hash_equals((string) get_post_meta($post_id, '_storm_import_hash', true), $source_hash)) {
                $this->add_legacy_source($post_id, $source_key);
                return 'unchanged';
            }

            $post_data = array(
                'post_type'    => $post_type,
                'post_status'  => $post_id > 0 ? get_post_status($post_id) : $status,
                'post_title'   => $payload['post_title'],
                'post_content' => $payload['post_content'],
            );
            if ($post_id > 0) {
                $post_data['ID'] = $post_id;
            }

            $saved_id = wp_insert_post(wp_slash($post_data), true);
            if (is_wp_error($saved_id)) {
                WP_CLI::error(sprintf('Could not save %s %s: %s', $post_type, $source_key, $saved_id->get_error_message()));
            }
            $post_id = (int) $saved_id;

            foreach ($payload['meta'] as $meta_key => $value) {
                if ($value === '') {
                    delete_post_meta($post_id, $meta_key);
                } else {
                    update_post_meta($post_id, $meta_key, $value);
                }
            }

            if ($identity_key !== '') {
                update_post_meta($post_id, '_storm_identity_key', $identity_key);
                update_post_meta($post_id, '_storm_source_rank', $source_rank);
                $this->add_legacy_source($post_id, $source_key);
            } else {
                update_post_meta($post_id, '_storm_legacy_key', $source_key);
            }

            update_post_meta($post_id, '_storm_import_hash', $source_hash);
            update_post_meta($post_id, '_storm_imported_at', current_time('mysql', true));
            update_post_meta(
                $post_id,
                '_storm_import_snapshot',
                wp_slash(
                    wp_json_encode(
                        $this->capture_state($post_id, array_keys($payload['meta'])),
                        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                    )
                )
            );

            $operation = isset($post_data['ID']) ? 'updated' : 'created';
            $this->log_operation($operation, $post_type, $source_key, $post_id);

            return $operation;
        }

        /**
         * @param array{post_title: string, post_content: string, meta: array<string, mixed>} $payload
         */
        private function record_changed_since_import(int $post_id, array $payload): bool
        {
            $snapshot_json = (string) get_post_meta($post_id, '_storm_import_snapshot', true);
            if ($snapshot_json === '') {
                return true;
            }

            $snapshot = json_decode($snapshot_json, true);
            if (!is_array($snapshot)) {
                return true;
            }

            if (!isset($snapshot['meta']) || !is_array($snapshot['meta'])) {
                return true;
            }
            foreach (array_keys($payload['meta']) as $key) {
                if (!array_key_exists($key, $snapshot['meta']) && metadata_exists('post', $post_id, $key)) {
                    return true;
                }
            }
            return $snapshot !== $this->capture_state($post_id, array_keys($snapshot['meta']));
        }

        /**
         * @param list<string> $meta_keys
         * @return array<string, mixed>
         */
        private function capture_state(int $post_id, array $meta_keys): array
        {
            $post = get_post($post_id);
            $meta = array();
            foreach ($meta_keys as $meta_key) {
                $meta[$meta_key] = get_post_meta($post_id, $meta_key, true);
            }

            return array(
                'post_title'   => $post instanceof WP_Post ? $post->post_title : '',
                'post_content' => $post instanceof WP_Post ? $post->post_content : '',
                'meta'         => $meta,
            );
        }

        private function add_legacy_source(int $post_id, string $source_key): void
        {
            $sources = get_post_meta($post_id, '_storm_legacy_source', false);
            if (!in_array($source_key, $sources, true)) {
                add_post_meta($post_id, '_storm_legacy_source', $source_key);
            }
        }

        private function log_operation(string $operation, string $post_type, string $source_key, int $post_id): void
        {
            if (!$this->verbose) {
                return;
            }

            WP_CLI::log(sprintf('%s %s #%d from %s', strtoupper($operation), $post_type, $post_id, $source_key));
        }

        private function find_record(string $post_type, string $meta_key, string $meta_value): int
        {
            $ids = get_posts(
                array(
                    'post_type'      => $post_type,
                    'post_status'    => 'any',
                    'posts_per_page' => 2,
                    'fields'         => 'ids',
                    'meta_key'       => $meta_key,
                    'meta_value'     => $meta_value,
                    'no_found_rows'  => true,
                )
            );

            if (count($ids) > 1) {
                WP_CLI::error(sprintf('Duplicate %s value %s for %s.', $meta_key, $meta_value, $post_type));
            }

            return isset($ids[0]) ? (int) $ids[0] : 0;
        }

        /**
         * @return array<string, int|string>
         */
        private function import_result(
            string $domain,
            int $created = 0,
            int $updated = 0,
            int $unchanged = 0,
            int $conflicts = 0,
            int $skipped = 0
        ): array {
            return compact('domain', 'created', 'updated', 'unchanged', 'conflicts', 'skipped');
        }

        /**
         * @param array<string, int|string> $result
         */
        private function increment_result(array &$result, string $operation): void
        {
            $key = $operation === 'conflict' ? 'conflicts' : $operation;
            if (!array_key_exists($key, $result)) {
                WP_CLI::error('Unknown migration operation: ' . $operation);
            }

            $result[$key] = (int) $result[$key] + 1;
        }

    /**
     * @return list<array<string, int|string>>
     */
    private function build_report(string $domain): array
    {
        $rows = array();

        if ($domain === '' || $domain === 'content') {
            $rows = array_merge($rows, $this->content_report());
        }

        $fixture_tables = $this->find_tables('/^Storm_Terminliste(?:_\d{4})?$/');
        $season_map = $this->season_map($fixture_tables);

        if ($domain === '' || $domain === 'seasons') {
            $rows = array_merge($rows, $this->season_report($season_map));
        }
        if ($domain === '' || $domain === 'games') {
            $rows = array_merge($rows, $this->games_report($fixture_tables, $season_map));
        }
        if ($domain === '' || $domain === 'players') {
            $rows = array_merge($rows, $this->people_report('players', 'Storm_Spillere', 'storm_player + storm_roster_entry', $season_map));
        }
        if ($domain === '' || $domain === 'staff') {
            $rows = array_merge($rows, $this->people_report('staff', 'Storm_Trenere', 'storm_staff + storm_roster_entry', $season_map));
        }
        if ($domain === '' || $domain === 'sponsors') {
            $rows = array_merge($rows, $this->sponsor_report());
        }
        if ($domain === '' || $domain === 'training') {
            $rows = array_merge($rows, $this->training_report());
        }

        return $rows;
    }

    /**
     * @return list<array<string, int|string>>
     */
    private function content_report(): array
    {
        $rows = array();
        $definitions = array(
            'post'       => 'WordPress-innlegg',
            'page'       => 'WordPress-sider',
            'attachment' => 'Mediebibliotek',
        );

        foreach ($definitions as $post_type => $label) {
            $counts = wp_count_posts($post_type);
            $count = 0;
            if ($counts instanceof stdClass) {
                foreach (get_object_vars($counts) as $status => $status_count) {
                    if ($status !== 'trash' && $status !== 'auto-draft') {
                        $count += (int) $status_count;
                    }
                }
            }

            $rows[] = $this->row(
                'content',
                $label,
                'Alle',
                $count,
                $count,
                0,
                $post_type,
                $post_type === 'attachment'
                    ? 'Filer og gamle URL-er må kontrolleres separat mot mediebundle.'
                    : 'Finnes allerede i WordPress-databasen; skal URL-verifiseres, ikke dupliseres.'
            );
        }

        return $rows;
    }

    /**
     * @param array<string, int> $season_map
     * @return list<array<string, int|string>>
     */
    private function season_report(array $season_map): array
    {
        $starts = array_values(array_unique(array_values($season_map)));
        sort($starts);
        $rows = array();

        foreach ($starts as $start_year) {
            $rows[] = $this->row(
                'seasons',
                'Utledet fra terminlister',
                $this->season_label($start_year),
                1,
                1,
                0,
                'storm_season',
                'Stabil nøkkel: season:' . $start_year
            );
        }

        return $rows;
    }

    /**
     * @param list<string> $tables
     * @param array<string, int> $season_map
     * @return list<array<string, int|string>>
     */
    private function games_report(array $tables, array $season_map): array
    {
        $report = array();

        foreach ($tables as $table) {
            $source_rows = $this->table_rows($table);
            $valid = 0;
            $invalid = 0;
            $invalid_reasons = array();

            foreach ($source_rows as $source_row) {
                $date = $this->normalize_source_date((string) ($source_row->Dato ?? ''));
                $time = $this->normalize_source_time((string) ($source_row->Tid ?? ''));
                $home = trim((string) ($source_row->Hjemmelag ?? ''));
                $away = trim((string) ($source_row->Bortelag ?? ''));

                if ($date === null) {
                    $invalid++;
                    $invalid_reasons['dato'] = true;
                    continue;
                }
                if ($time === null) {
                    $invalid++;
                    $invalid_reasons['tid'] = true;
                    continue;
                }
                if ($home === '' || $away === '' || strcasecmp($home, $away) === 0) {
                    $invalid++;
                    $invalid_reasons['lag'] = true;
                    continue;
                }

                $valid++;
            }

            $notes = 'Stabil nøkkel: ' . $table . ':ID';
            if ($invalid_reasons !== array()) {
                $notes .= '; ugyldig ' . implode('/', array_keys($invalid_reasons));
            }

            $report[] = $this->row(
                'games',
                $table,
                isset($season_map[$table]) ? $this->season_label($season_map[$table]) : 'Ukjent',
                count($source_rows),
                $valid,
                $invalid,
                'storm_game',
                $notes
            );
        }

        return $report;
    }

    /**
     * @param array<string, int> $season_map
     * @return list<array<string, int|string>>
     */
    private function people_report(string $domain, string $base_table, string $target, array $season_map): array
    {
        $tables = $this->find_tables('/^' . preg_quote($base_table, '/') . '(?:_\d{4})?$/');
        $report = array();

        foreach ($tables as $table) {
            $source_rows = $this->table_rows($table);
            $valid = 0;
            $invalid = 0;
            foreach ($source_rows as $source_row) {
                if (trim((string) ($source_row->Navn ?? '')) === '') {
                    $invalid++;
                } else {
                    $valid++;
                }
            }

            $season_start = $this->season_for_people_table($table, $base_table, $season_map);
            $report[] = $this->row(
                $domain,
                $table,
                $season_start > 0 ? $this->season_label($season_start) : 'Ukjent',
                count($source_rows),
                $valid,
                $invalid,
                $target,
                'Profilidentitet normaliseres fra navn; stallnøkkel: ' . $table . ':ID'
            );
        }

        return $report;
    }

    /**
     * @return list<array<string, int|string>>
     */
    private function sponsor_report(): array
    {
        $table = 'Storm_Sponsor';
        if (!$this->table_exists($table)) {
            return array($this->row('sponsors', $table, 'Aktiv', 0, 0, 1, 'storm_sponsor + storm_sponsor_deal', 'Kildetabellen mangler.'));
        }

        $source_rows = $this->table_rows($table);
        $valid = 0;
        $invalid = 0;
        $unknown_levels = array();
        foreach ($source_rows as $source_row) {
            $name = trim((string) ($source_row->Navn ?? ''));
            $level = $this->sponsor_level((string) ($source_row->Sponsortype ?? ''));
            if ($name === '' || $level === '') {
                $invalid++;
                if ($level === '') {
                    $unknown_levels[] = trim((string) ($source_row->Sponsortype ?? ''));
                }
            } else {
                $valid++;
            }
        }

        $notes = 'Sponsoridentitet fra normalisert navn; avtalen gjelder aktiv sesong.';
        if ($unknown_levels !== array()) {
            $notes .= ' Ukjente nivåer: ' . implode(', ', array_unique($unknown_levels));
        }

        $report = array(
            $this->row(
                'sponsors',
                $table,
                $this->season_label($this->current_season_start()),
                count($source_rows),
                $valid,
                $invalid,
                'storm_sponsor + storm_sponsor_deal',
                $notes
            ),
        );
        foreach (array('Storm_Stottemedlem_Bed_Pic', 'Storm_Stottemedlem_Pers') as $member_table) {
            if (!$this->table_exists($member_table)) {
                continue;
            }
            $members = $this->table_rows($member_table);
            $valid = count(array_filter($members, static fn(object $row): bool => trim((string) ($row->Navn ?? '')) !== '' && (int) ($row->ID ?? 0) > 0));
            $report[] = $this->row('sponsors', $member_table, $this->season_label($this->current_season_start()), count($members), $valid, count($members) - $valid, 'storm_sponsor + storm_sponsor_deal', 'Støttemedlem som person/bedrift, med sesongtilknytning. Identitet bevares per kildetabell og rad-ID.');
        }
        return $report;
    }

    /**
     * @return list<array<string, int|string>>
     */
    private function training_report(): array
    {
        $table = 'Storm_Treningstider';
        if (!$this->table_exists($table)) {
            return array($this->row('training', $table, 'Aktiv', 0, 0, 1, 'storm_training', 'Kildetabellen mangler.'));
        }

        $source_rows = $this->table_rows($table);
        $valid = 0;
        $invalid = 0;
        foreach ($source_rows as $source_row) {
            $weekday = $this->weekday_number((string) ($source_row->Dag ?? ''));
            $time_range = $this->parse_time_range((string) ($source_row->Tid ?? ''));
            $venue = trim((string) ($source_row->Sted ?? ''));
            if ($weekday === 0 || $time_range === null || $venue === '') {
                $invalid++;
            } else {
                $valid++;
            }
        }

        return array(
            $this->row(
                'training',
                $table,
                $this->season_label($this->current_season_start()),
                count($source_rows),
                $valid,
                $invalid,
                'storm_training',
                'Tid normaliseres fra HH.MM - HH.MM; lag mangler i kilden og må avklares.'
            ),
        );
    }

    /**
     * @param list<string> $fixture_tables
     * @return array<string, int>
     */
    private function season_map(array $fixture_tables): array
    {
        $map = array();
        foreach ($fixture_tables as $table) {
            $starts = array();
            foreach ($this->table_rows($table) as $row) {
                $explicit_season = isset($row->sesong_id) ? (int) $row->sesong_id : 0;
                if ($explicit_season >= 2000 && $explicit_season <= 2100) {
                    $starts[$explicit_season] = ($starts[$explicit_season] ?? 0) + 1;
                    continue;
                }

                $date = $this->normalize_source_date((string) ($row->Dato ?? ''));
                if ($date === null) {
                    continue;
                }

                $year = (int) substr($date, 0, 4);
                $month = (int) substr($date, 5, 2);
                $start = $month >= 7 ? $year : $year - 1;
                $starts[$start] = ($starts[$start] ?? 0) + 1;
            }

            if ($starts !== array()) {
                arsort($starts);
                $map[$table] = (int) array_key_first($starts);
            } elseif ($table === 'Storm_Terminliste') {
                $map[$table] = $this->current_season_start();
            } elseif (preg_match('/_(\d{4})$/', $table, $matches)) {
                $map[$table] = (int) $matches[1] - 1;
            }
        }

        return $map;
    }

    /**
     * @param array<string, int> $season_map
     */
    private function season_for_people_table(string $table, string $base_table, array $season_map): int
    {
        if ($table === $base_table) {
            return $season_map['Storm_Terminliste'] ?? $this->current_season_start();
        }

        if (preg_match('/_(\d{4})$/', $table, $matches)) {
            $fixture_table = 'Storm_Terminliste_' . $matches[1];

            return $season_map[$fixture_table] ?? ((int) $matches[1] - 1);
        }

        return 0;
    }

    private function source_rank(string $table, string $base_table, int $season_start): int
    {
        if ($table === $base_table) {
            return 999999;
        }

        if (preg_match('/_(\d{4})$/', $table, $matches)) {
            return (int) $matches[1];
        }

        return $season_start;
    }

    /**
     * @return list<string>
     */
    private function find_tables(string $pattern): array
    {
        global $wpdb;

        $tables = $wpdb->get_col("SHOW TABLES LIKE 'Storm\\_%'") ?: array();
        $tables = array_values(
            array_filter(
                array_map('strval', $tables),
                static fn(string $table): bool => (bool) preg_match($pattern, $table)
            )
        );
        natsort($tables);

        return array_values($tables);
    }

    private function table_exists(string $table): bool
    {
        return in_array($table, $this->find_tables('/^' . preg_quote($table, '/') . '$/'), true);
    }

    /**
     * @return list<object>
     */
    private function table_rows(string $table): array
    {
        if (!preg_match('/^Storm_[A-Za-z0-9_]+$/', $table)) {
            return array();
        }

        global $wpdb;

        return $wpdb->get_results("SELECT * FROM `$table` ORDER BY ID") ?: array();
    }

    private function current_season_start(): int
    {
        $year = (int) wp_date('Y');
        $month = (int) wp_date('n');

        return $month >= 7 ? $year : $year - 1;
    }

    private function season_label(int $start_year): string
    {
        return sprintf('%d/%d', $start_year, $start_year + 1);
    }

    private function normalize_source_date(string $value): ?string
    {
        $value = trim($value);
        $formats = array('!Y-m-d', '!d.m.Y');

        foreach ($formats as $format) {
            $date = DateTimeImmutable::createFromFormat($format, $value, wp_timezone());
            $errors = DateTimeImmutable::getLastErrors();
            $has_errors = is_array($errors) && ($errors['warning_count'] > 0 || $errors['error_count'] > 0);
            if ($date instanceof DateTimeImmutable && !$has_errors) {
                return $date->format('Y-m-d');
            }
        }

        return null;
    }

    private function valid_time(string $value): bool
    {
        return (bool) preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/', $value);
    }

    private function normalize_source_time(string $value): ?string
    {
        $value = str_replace('.', ':', trim($value));
        if (!$this->valid_time($value)) {
            return null;
        }

        return strlen($value) === 5 ? $value . ':00' : $value;
    }

    private function sponsor_level(string $value): string
    {
        $normalized = strtolower(remove_accents(trim($value)));
        $levels = array(
            'hovedsamarbeidspartnere' => 'main',
            'samarbeidspartnere'       => 'partner',
            'ovrige'                   => 'supporter',
        );

        return $levels[$normalized] ?? '';
    }

    private function weekday_number(string $value): int
    {
        $normalized = strtolower(remove_accents(trim($value)));
        $weekdays = array(
            'mandag'  => 1,
            'tirsdag' => 2,
            'onsdag'  => 3,
            'torsdag' => 4,
            'fredag'  => 5,
            'lordag'  => 6,
            'sondag'  => 7,
        );

        return $weekdays[$normalized] ?? 0;
    }

    /**
     * @return array{0: string, 1: string}|null
     */
    private function parse_time_range(string $value): ?array
    {
        if (!preg_match('/(\d{1,2})[.:](\d{2})\s*-\s*(\d{1,2})[.:](\d{2})/', trim($value), $matches)) {
            return null;
        }

        $start = sprintf('%02d:%02d', (int) $matches[1], (int) $matches[2]);
        $end = sprintf('%02d:%02d', (int) $matches[3], (int) $matches[4]);
        if (!$this->valid_time($start) || !$this->valid_time($end) || $end <= $start) {
            return null;
        }

        return array($start, $end);
    }

    /**
     * @return array<string, int|string>
     */
    private function row(
        string $domain,
        string $source,
        string $season,
        int $rows,
        int $valid,
        int $invalid,
        string $target,
        string $notes
    ): array {
        return compact('domain', 'source', 'season', 'rows', 'valid', 'invalid', 'target', 'notes');
    }
}
