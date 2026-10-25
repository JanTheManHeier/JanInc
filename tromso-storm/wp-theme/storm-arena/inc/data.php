<?php

function storm_arena_asset_url(string $relative_path): string
{
    return trailingslashit(get_template_directory_uri()) . ltrim($relative_path, '/');
}

function storm_arena_get_allowed_tables(): array
{
    static $tables = null;

    if ($tables !== null) {
        return $tables;
    }

    $tables = array(
        'storm-current-roster'      => 'Storm_Spillere',
        'storm-current-coaches'     => 'Storm_Trenere',
        'storm-1div-roster'         => 'Storm_Spillere_1div',
        'storm-1div-coaches'        => 'Storm_Trenere_1div',
        'storm-current-fixtures'    => 'Storm_Terminliste',
        'storm-1div-fixtures'       => 'Storm_Terminliste_1div',
        'storm-training'            => 'Storm_Treningstider',
        'storm-streetbasket'        => 'Storm_Streetbasket_baner',
        'storm-dancers'             => 'Storm_Dansere',
        'storm-supporter-business'  => 'Storm_Stottemedlem_Bed_Pic',
        'storm-supporter-people'    => 'Storm_Stottemedlem_Pers',
        'storm-sponsors'            => 'Storm_Sponsor',
        'storm-arrangement'         => 'Storm_Arrangement',
        'storm-board'               => 'Storm_Styret',
        'storm-admin'               => 'Storm_Administrasjon',
        'storm-ifokus'              => 'Storm_iFokus',
        'varden-roster'             => 'Varden_Spillere',
        'varden-coaches'            => 'Varden_Trenere',
        'varden-fixtures'           => 'Varden_Terminliste',
        'varden-training'           => 'Varden_Treningstider',
    );

    foreach (range(2002, 2025) as $season_start) {
        $tables["storm-roster-$season_start"]  = "Storm_Spillere_$season_start";
        $tables["storm-coaches-$season_start"] = "Storm_Trenere_$season_start";
    }

    foreach (range(2002, 2026) as $season_start) {
        $tables["storm-fixtures-$season_start"] = "Storm_Terminliste_$season_start";
    }

    return $tables;
}

function storm_arena_get_allowed_table(string $key): ?string
{
    $tables = storm_arena_get_allowed_tables();

    return $tables[$key] ?? null;
}

function storm_arena_table_exists(string $key): bool
{
    static $cache = array();

    if (array_key_exists($key, $cache)) {
        return $cache[$key];
    }

    $table = storm_arena_get_allowed_table($key);
    if ($table === null) {
        $cache[$key] = false;
        return false;
    }

    global $wpdb;

    $like = $wpdb->esc_like($table);
    $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $like));
    $cache[$key] = ($found === $table);

    return $cache[$key];
}

function storm_arena_get_rows(string $key, string $order_by = 'ID', string $direction = 'ASC'): array
{
    $table = storm_arena_get_allowed_table($key);
    if ($table === null || !storm_arena_table_exists($key)) {
        return array();
    }

    $allowed_columns = array('ID', 'Sort_ID', 'Drakt_nummer', 'Rekkefolge', 'Navn', 'Dato');
    $direction = strtoupper($direction) === 'DESC' ? 'DESC' : 'ASC';
    $order_sql = in_array($order_by, $allowed_columns, true) ? " ORDER BY `$order_by` $direction" : '';

    global $wpdb;

    $sql = "SELECT * FROM `$table`$order_sql";

    return $wpdb->get_results($sql) ?: array();
}

function storm_arena_normalize_url(string $url): string
{
    $url = trim($url);
    if ($url === '') {
        return '';
    }

    if (preg_match('#^https?://#i', $url)) {
        $normalized = esc_url_raw($url);

        if (preg_match('#^https?://(www\.)?tromsostorm\.no(/|$)#i', $normalized)) {
            $path = wp_parse_url($normalized, PHP_URL_PATH) ?: '/';
            $query = wp_parse_url($normalized, PHP_URL_QUERY);
            $fragment = wp_parse_url($normalized, PHP_URL_FRAGMENT);
            $local = home_url($path);

            if ($query) {
                $local .= '?' . $query;
            }

            if ($fragment) {
                $local .= '#' . $fragment;
            }

            return esc_url_raw($local);
        }

        return $normalized;
    }

    if (str_starts_with($url, '//')) {
        return esc_url_raw('https:' . $url);
    }

    if (str_starts_with($url, '/')) {
        return esc_url_raw(home_url($url));
    }

    if (preg_match('#^[a-z0-9.-]+\.[a-z]{2,}(/.*)?$#i', $url)) {
        return esc_url_raw('https://' . ltrim($url, '/'));
    }

    return '';
}

function storm_arena_is_internal_url(string $url): bool
{
    $url = storm_arena_normalize_url($url);
    if ($url === '') {
        return false;
    }

    $host = wp_parse_url($url, PHP_URL_HOST);
    $home = wp_parse_url(home_url('/'), PHP_URL_HOST);

    return $host === null || $home === $host;
}

function storm_arena_resolve_media_url(string $path, string $fallback = ''): string
{
    $path = trim($path);
    if ($path === '') {
        return $fallback;
    }

    $normalized = storm_arena_normalize_url($path);

    return $normalized !== '' ? $normalized : $fallback;
}

function storm_arena_get_month_name(int $month): string
{
    $months = array(
        1  => 'januar',
        2  => 'februar',
        3  => 'mars',
        4  => 'april',
        5  => 'mai',
        6  => 'juni',
        7  => 'juli',
        8  => 'august',
        9  => 'september',
        10 => 'oktober',
        11 => 'november',
        12 => 'desember',
    );

    return $months[$month] ?? '';
}

function storm_arena_get_day_name_short(int $weekday): string
{
    $days = array('SØN', 'MAN', 'TIR', 'ONS', 'TOR', 'FRE', 'LØR');
    return $days[$weekday] ?? '';
}

function storm_arena_get_day_name_long(int $weekday): string
{
    $days = array('Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag');
    return $days[$weekday] ?? '';
}

function storm_arena_format_short_date(DateTimeInterface $date): string
{
    return $date->format('j') . '. ' . storm_arena_get_month_name((int) $date->format('n'));
}

function storm_arena_format_long_date(DateTimeInterface $date): string
{
    return storm_arena_get_day_name_long((int) $date->format('w')) . ' ' . $date->format('j') . '. ' . storm_arena_get_month_name((int) $date->format('n')) . ' ' . $date->format('Y');
}

function storm_arena_parse_match_datetime(string $date_value, string $time_value = ''): ?DateTimeImmutable
{
    $date_value = trim($date_value);
    $time_value = trim($time_value);

    if ($date_value === '') {
        return null;
    }

    $formats = array(
        'Y-m-d H:i:s',
        'Y-m-d H:i',
        'd.m.Y H:i:s',
        'd.m.Y H:i',
        'd.m.y H:i',
        'd/m/Y H:i:s',
        'd/m/Y H:i',
    );

    $source = trim($date_value . ' ' . ($time_value !== '' ? $time_value : '00:00'));
    foreach ($formats as $format) {
        $date = DateTimeImmutable::createFromFormat($format, $source, wp_timezone());
        if ($date instanceof DateTimeImmutable) {
            return $date;
        }
    }

    $timestamp = strtotime($source);

    return $timestamp ? (new DateTimeImmutable('@' . $timestamp))->setTimezone(wp_timezone()) : null;
}

function storm_arena_get_current_season_label(): string
{
    if (storm_arena_managed_content()) {
        $id = Storm_Core_Content::active_season();
        return $id ? get_the_title($id) : 'Sesong ikke valgt';
    }
    $timestamp = current_time('timestamp');
    $year      = (int) wp_date('Y', $timestamp);
    $month     = (int) wp_date('n', $timestamp);
    $start     = $month >= 7 ? $year : $year - 1;

    return sprintf('%d/%d', $start, $start + 1);
}

function storm_arena_managed_content(): bool
{
    return class_exists('Storm_Core_Content') && Storm_Core_Content::enabled();
}

function storm_arena_editorial_content(string $slot): bool
{
    $post = class_exists('Storm_Core_Editorial') ? Storm_Core_Editorial::page($slot) : null;
    if (!$post) {
        return false;
    }
    echo '<article class="content-card prose"><h2>' . esc_html($post->post_title) . '</h2>';
    echo apply_filters('the_content', $post->post_content); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    echo '</article>';
    return true;
}

function storm_arena_resolve_core_images(array $rows, string $key = 'photo_url'): array
{
    foreach ($rows as &$row) {
        $row[$key] = storm_arena_resolve_media_url((string) ($row[$key] ?? ''));
    }
    unset($row);
    return $rows;
}

function storm_arena_get_standings(int $tournament_id = 0): array
{
    if (!$tournament_id) {
        $tournament_id = storm_arena_managed_content()
            ? (int) get_post_meta(Storm_Core_Content::active_season(), 'storm_nif_standings_id', true)
            : 449378;
    }
    if (!$tournament_id) {
        return array();
    }
    $cache_key = 'storm_standings_' . $tournament_id;
    $cached    = get_transient($cache_key);
    if (is_array($cached)) {
        return $cached;
    }

    $url      = add_query_arg('tournamentId', $tournament_id, 'https://sf14-terminlister-prod-app.azurewebsites.net/ta/TournamentStandings/');
    $response = wp_remote_get($url, array('timeout' => 10));
    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        return array();
    }

    $rows = json_decode(wp_remote_retrieve_body($response), true);
    if (!is_array($rows)) {
        return array();
    }

    $standings = array();
    foreach ($rows as $row) {
        $position = isset($row['position']) ? (int) $row['position'] : 0;
        $team     = trim((string) ($row['orgName'] ?? ''));
        if ($position < 1 || $team === '') {
            continue;
        }

        $standings[] = array(
            'position'   => $position,
            'team'       => $team,
            'played'     => (int) ($row['matches'] ?? 0),
            'wins'       => (int) ($row['victories'] ?? 0),
            'losses'     => (int) ($row['losses'] ?? 0),
            'difference' => (int) ($row['goalDifference'] ?? 0),
            'points'     => (int) ($row['totalPoints'] ?? 0),
        );
    }

    usort($standings, static fn(array $left, array $right): int => $left['position'] <=> $right['position']);
    set_transient($cache_key, $standings, 5 * MINUTE_IN_SECONDS);

    return $standings;
}

function storm_arena_is_team_home(string $team_name, string $club_name = 'Tromsø Storm'): bool
{
    $needle = remove_accents(mb_strtolower($club_name));
    $team   = remove_accents(mb_strtolower($team_name));

    return $needle !== '' && str_contains($team, $needle);
}

function storm_arena_get_match_result_text(array $match): string
{
    $home_score = $match['home_score'];
    $away_score = $match['away_score'];

    if ($home_score === '' && $away_score === '') {
        return 'Ikke spilt ennå';
    }

    return trim($home_score . ' - ' . $away_score);
}

function storm_arena_get_schedule_entries(string $key, string $club_name = 'Tromsø Storm'): array
{
    if ($key === 'storm-current-fixtures') {
        $core_matches = storm_arena_get_core_schedule_entries($club_name);
        if (storm_arena_managed_content() || $core_matches !== array()) {
            return $core_matches;
        }
    }

    $rows = storm_arena_get_rows($key, 'ID', 'ASC');
    if (empty($rows)) {
        return array();
    }

    $now     = current_time('timestamp');
    $matches = array();

    foreach ($rows as $row) {
        $date = storm_arena_parse_match_datetime((string) ($row->Dato ?? ''), (string) ($row->Tid ?? ''));
        $timestamp = $date ? $date->getTimestamp() : null;

        $home_score = isset($row->Resultat_hjemmelag) ? (string) $row->Resultat_hjemmelag : '';
        $away_score = isset($row->Resultat_bortelag) ? (string) $row->Resultat_bortelag : '';
        if ($timestamp !== null && $timestamp > $now && $home_score === '0' && $away_score === '0') {
            $home_score = '';
            $away_score = '';
        }

        $matches[] = array(
            'date'             => $date,
            'timestamp'        => $timestamp,
            'home'             => trim((string) ($row->Hjemmelag ?? '')),
            'away'             => trim((string) ($row->Bortelag ?? '')),
            'home_score'       => $home_score,
            'away_score'       => $away_score,
            'venue'            => trim((string) ($row->Sted ?? '')),
            'stats_url'        => storm_arena_normalize_url((string) ($row->Link_statistikk ?? '')),
            'is_home'          => storm_arena_is_team_home((string) ($row->Hjemmelag ?? ''), $club_name),
            'legacy_day_label' => trim((string) ($row->Dag ?? '')),
            'sort_order'       => isset($row->Rekkefolge) ? (int) $row->Rekkefolge : 0,
        );
    }

    usort(
        $matches,
        static function (array $left, array $right): int {
            if ($left['timestamp'] !== null && $right['timestamp'] !== null && $left['timestamp'] !== $right['timestamp']) {
                return $left['timestamp'] <=> $right['timestamp'];
            }

            if ($left['sort_order'] !== $right['sort_order']) {
                return $left['sort_order'] <=> $right['sort_order'];
            }

            return strcmp($left['home'] . $left['away'], $right['home'] . $right['away']);
        }
    );

    return $matches;
}

function storm_arena_get_core_schedule_entries(string $club_name = 'Tromsø Storm', int $selected_season = 0): array
{
    if (!post_type_exists('storm_season') || !post_type_exists('storm_game')) {
        return array();
    }

    $season_ids = get_posts(
        array(
            'post_type'      => 'storm_season',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_key'       => 'storm_is_active',
            'meta_value'     => '1',
            'no_found_rows'  => true,
        )
    );
    $season_id = $selected_season ?: (isset($season_ids[0]) ? (int) $season_ids[0] : 0);
    if (storm_arena_managed_content() && !$selected_season) {
        $season_id = Storm_Core_Content::active_season();
    }
    if ($season_id < 1 || get_post_status($season_id) !== 'publish') {
        return array();
    }

    $game_ids = get_posts(
        array(
            'post_type'      => 'storm_game',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'meta_key'       => 'storm_starts_at',
            'orderby'        => 'meta_value',
            'order'          => 'ASC',
            'meta_query'     => array(
                array(
                    'key'   => 'storm_season_id',
                    'value' => $season_id,
                ),
            ),
            'no_found_rows'  => true,
        )
    );

    $matches = array();
    foreach ($game_ids as $game_id) {
        if (get_post_meta((int) $game_id, 'storm_hidden', true)) {
            continue;
        }
        $starts_at = (string) get_post_meta((int) $game_id, 'storm_starts_at', true);
        try {
            $date = $starts_at !== '' ? new DateTimeImmutable($starts_at) : null;
            if ($date instanceof DateTimeImmutable) {
                $date = $date->setTimezone(wp_timezone());
            }
        } catch (Exception) {
            $date = null;
        }

        $home = trim((string) get_post_meta((int) $game_id, 'storm_home_team', true));
        $away = trim((string) get_post_meta((int) $game_id, 'storm_away_team', true));
        if ($home === '' || $away === '') {
            continue;
        }

        $status = (string) get_post_meta((int) $game_id, 'storm_game_status', true);
        $home_score = (string) get_post_meta((int) $game_id, 'storm_home_score', true);
        $away_score = (string) get_post_meta((int) $game_id, 'storm_away_score', true);
        if (!in_array($status, array('finished', 'live'), true) && $home_score === '0' && $away_score === '0') {
            $home_score = '';
            $away_score = '';
        }

        $matches[] = array(
            'date'             => $date,
            'timestamp'        => $date ? $date->getTimestamp() : null,
            'home'             => $home,
            'away'             => $away,
            'home_score'       => $home_score,
            'away_score'       => $away_score,
            'venue'            => trim((string) get_post_meta((int) $game_id, 'storm_venue', true)),
            'stats_url'        => storm_arena_normalize_url((string) get_post_meta((int) $game_id, 'storm_stats_url', true)),
            'is_home'          => storm_arena_is_team_home($home, $club_name),
            'legacy_day_label' => '',
            'sort_order'       => 0,
            'status'           => $status,
            'data_source'      => (string) get_post_meta((int) $game_id, 'storm_data_source', true),
            'source_updated_at'=> (string) get_post_meta((int) $game_id, 'storm_source_updated_at', true),
            'ticket_url'       => (string) get_post_meta((int) $game_id, 'storm_ticket_url', true),
            'url'              => get_permalink((int) $game_id),
        );
    }

    return $matches;
}

function storm_arena_get_next_match(array $matches): ?array
{
    $now = storm_arena_managed_content() ? time() : current_time('timestamp') - HOUR_IN_SECONDS;
    $undated = null;

    foreach ($matches as $match) {
        if (in_array($match['status'] ?? '', array('finished', 'cancelled', 'postponed'), true)) {
            continue;
        }
        if ($match['timestamp'] === null && $undated === null) {
            $undated = $match;
        }

        if ($match['timestamp'] !== null && $match['timestamp'] >= $now) {
            return $match;
        }
    }

    return $undated;
}

function storm_arena_get_roster_entries(string $key): array
{
    if ($key === 'storm-current-roster' && storm_arena_managed_content()) {
        return storm_arena_resolve_core_images(Storm_Core_Content::roster('player'));
    }
    $players = storm_arena_get_rows($key, 'Drakt_nummer', 'ASC');
    if (empty($players)) {
        return array();
    }

    $mapped = array();
    foreach ($players as $player) {
        $raw_number = $player->Drakt_nummer ?? null;
        $number = $raw_number !== null && trim((string) $raw_number) !== '' ? (int) $raw_number : null;
        $mapped[] = array(
            'number'       => $number,
            'name'         => trim((string) ($player->Navn ?? '')),
            'photo_url'    => storm_arena_resolve_media_url((string) ($player->Bilde ?? '')),
            'position'     => trim((string) ($player->Posisjon ?? '')),
            'height'       => isset($player->Hoyde) ? (int) $player->Hoyde : 0,
            'weight'       => isset($player->Vekt) ? (int) $player->Vekt : 0,
            'born'         => trim((string) ($player->Fodt ?? '')),
            'experience'   => isset($player->Antall_aar) ? (int) $player->Antall_aar : 0,
            'description'  => trim((string) ($player->Diverse ?? '')),
            'email'        => sanitize_email((string) ($player->E_post ?? '')),
        );
    }

    usort(
        $mapped,
        static function (array $left, array $right): int {
            $left_number  = $left['number'] !== null && $left['number'] >= 0 ? $left['number'] : 999;
            $right_number = $right['number'] !== null && $right['number'] >= 0 ? $right['number'] : 999;

            if ($left_number !== $right_number) {
                return $left_number <=> $right_number;
            }

            return strcmp($left['name'], $right['name']);
        }
    );

    return $mapped;
}

function storm_arena_get_coach_entries(string $key): array
{
    if ($key === 'storm-current-coaches' && storm_arena_managed_content()) {
        return storm_arena_resolve_core_images(Storm_Core_Content::roster('staff'));
    }
    $rows = storm_arena_get_rows($key, 'Sort_ID', 'ASC');
    if (empty($rows)) {
        return array();
    }

    $mapped = array();
    foreach ($rows as $row) {
        $mapped[] = array(
            'role'        => trim((string) ($row->Oppgave ?? '')),
            'name'        => trim((string) ($row->Navn ?? '')),
            'photo_url'   => storm_arena_resolve_media_url((string) ($row->Bilde ?? '')),
            'description' => trim((string) ($row->Diverse ?? '')),
            'sort_order'  => isset($row->Sort_ID) ? (int) $row->Sort_ID : 0,
        );
    }

    usort(
        $mapped,
        static function (array $left, array $right): int {
            if ($left['sort_order'] !== $right['sort_order']) {
                return $left['sort_order'] <=> $right['sort_order'];
            }

            return strcmp($left['name'], $right['name']);
        }
    );

    return $mapped;
}

function storm_arena_get_sponsor_fallbacks(): array
{
    return array(
        array(
            'name'      => 'Jekta Storsenter',
            'type'      => 'Hovedsamarbeidspartnere',
            'logo_url'  => storm_arena_asset_url('assets/jekta.png'),
            'link_url'  => 'https://www.jekta.no',
            'text'      => '',
            'sort_order'=> 10,
        ),
        array(
            'name'      => 'SpareBank 1 Nord-Norge',
            'type'      => 'Hovedsamarbeidspartnere',
            'logo_url'  => storm_arena_asset_url('assets/snn.png'),
            'link_url'  => 'https://www.sparebank1.no/nb/nord-norge/privat.html',
            'text'      => '',
            'sort_order'=> 20,
        ),
        array(
            'name'      => 'Coop Extra',
            'type'      => 'Hovedsamarbeidspartnere',
            'logo_url'  => storm_arena_asset_url('assets/extra.png'),
            'link_url'  => 'https://www.coop.no',
            'text'      => '',
            'sort_order'=> 30,
        ),
        array(
            'name'      => 'Hermes',
            'type'      => 'Hovedsamarbeidspartnere',
            'logo_url'  => storm_arena_asset_url('assets/hermes.png'),
            'link_url'  => 'https://www.hermesas.no',
            'text'      => '',
            'sort_order'=> 40,
        ),
        array(
            'name'      => 'Bedriftssystemer',
            'type'      => 'Hovedsamarbeidspartnere',
            'logo_url'  => storm_arena_asset_url('assets/bedsys.png'),
            'link_url'  => 'https://www.bedsys.no',
            'text'      => '',
            'sort_order'=> 50,
        ),
        array(
            'name'      => 'Pizzabakeren',
            'type'      => 'Hovedsamarbeidspartnere',
            'logo_url'  => storm_arena_asset_url('assets/sponsors/pizzabakeren.png'),
            'link_url'  => 'https://pizzabakeren.no',
            'text'      => '',
            'sort_order'=> 60,
        ),
    );
}

function storm_arena_get_sponsors(): array
{
    if (storm_arena_managed_content()) {
        return storm_arena_resolve_core_images(Storm_Core_Content::sponsors(), 'logo_url');
    }
    if (!storm_arena_table_exists('storm-sponsors')) {
        return storm_arena_get_sponsor_fallbacks();
    }

    global $wpdb;

    $rows = $wpdb->get_results('SELECT ID, Sort_ID, Navn, Sponsortype, Bilde, Tekst, Link FROM `Storm_Sponsor`') ?: array();
    if (empty($rows)) {
        return storm_arena_get_sponsor_fallbacks();
    }

    $mapped = array();
    foreach ($rows as $row) {
        $mapped[] = array(
            'name'       => trim((string) ($row->Navn ?? '')),
            'type'       => trim((string) ($row->Sponsortype ?? '')),
            'logo_url'   => storm_arena_resolve_media_url((string) ($row->Bilde ?? '')),
            'link_url'   => storm_arena_normalize_url((string) ($row->Link ?? '')),
            'text'       => trim((string) ($row->Tekst ?? '')),
            'sort_order' => isset($row->Sort_ID) ? (int) $row->Sort_ID : 0,
        );
    }

    usort(
        $mapped,
        static function (array $left, array $right): int {
            $type_priority = array(
                'Hovedsamarbeidspartnere' => 0,
                'Samarbeidspartnere'      => 1,
                'Ovrige'                  => 2,
            );

            $left_type  = $type_priority[$left['type']] ?? 9;
            $right_type = $type_priority[$right['type']] ?? 9;

            if ($left_type !== $right_type) {
                return $left_type <=> $right_type;
            }

            if ($left['sort_order'] !== $right['sort_order']) {
                return $right['sort_order'] <=> $left['sort_order'];
            }

            return strcmp($left['name'], $right['name']);
        }
    );

    return $mapped;
}

function storm_arena_get_sponsors_by_type(string $type): array
{
    return array_values(
        array_filter(
            storm_arena_get_sponsors(),
            static fn(array $sponsor): bool => $sponsor['type'] === $type
        )
    );
}

function storm_arena_is_featured_sponsor(array $sponsor): bool
{
    return $sponsor['type'] === 'Hovedsamarbeidspartnere'
        || (!storm_arena_managed_content() && sanitize_title($sponsor['name']) === 'pizzabakeren');
}

function storm_arena_get_featured_sponsors(): array
{
    return array_values(array_filter(storm_arena_get_sponsors(), 'storm_arena_is_featured_sponsor'));
}

function storm_arena_get_secondary_sponsors(): array
{
    return array_values(
        array_filter(
            storm_arena_get_sponsors(),
            static fn(array $sponsor): bool => !storm_arena_is_featured_sponsor($sponsor) && $sponsor['type'] !== 'Støttemedlem'
        )
    );
}

function storm_arena_get_supporter_businesses(): array
{
    if (storm_arena_managed_content()) {
        return array_values(array_filter(storm_arena_get_sponsors_by_type('Støttemedlem'), static fn(array $sponsor): bool => $sponsor['member_kind'] === 'business'));
    }
    $rows = storm_arena_get_rows('storm-supporter-business', 'Navn', 'ASC');

    return array_map(
        static function (object $row): array {
            return array(
                'name'     => trim((string) ($row->Navn ?? '')),
                'logo_url' => storm_arena_resolve_media_url((string) ($row->BildePlassering ?? '')),
                'link_url' => storm_arena_normalize_url((string) ($row->Link ?? '')),
            );
        },
        $rows
    );
}

function storm_arena_get_supporter_people(): array
{
    if (storm_arena_managed_content()) {
        return array_values(array_column(array_filter(storm_arena_get_sponsors_by_type('Støttemedlem'), static fn(array $sponsor): bool => $sponsor['member_kind'] === 'person'), 'name'));
    }
    $rows = storm_arena_get_rows('storm-supporter-people', 'Navn', 'ASC');

    return array_values(
        array_filter(
            array_map(
                static fn(object $row): string => trim((string) ($row->Navn ?? '')),
                $rows
            )
        )
    );
}

function storm_arena_get_training_times(string $key): array
{
    if ($key === 'storm-training' && storm_arena_managed_content()) {
        return Storm_Core_Content::training();
    }
    $rows = storm_arena_get_rows($key, 'ID', 'ASC');

    return array_map(
        static function (object $row): array {
            return array(
                'day'   => trim((string) ($row->Dag ?? '')),
                'time'  => trim((string) ($row->Tid ?? '')),
                'venue' => trim((string) ($row->Sted ?? '')),
            );
        },
        $rows
    );
}

function storm_arena_get_streetbasket_courts(): array
{
    $rows = storm_arena_get_rows('storm-streetbasket', 'ID', 'ASC');

    return array_map(
        static function (object $row): array {
            return array(
                'name'        => trim((string) ($row->Sted ?? '')),
                'description' => trim((string) ($row->Tekst ?? '')),
            );
        },
        $rows
    );
}

function storm_arena_get_dancers(): array
{
    $rows = storm_arena_get_rows('storm-dancers', 'Navn', 'ASC');

    return array_map(
        static function (object $row): array {
            return array(
                'name'        => trim((string) ($row->Navn ?? '')),
                'photo_url'   => storm_arena_resolve_media_url((string) ($row->Bilde ?? '')),
                'born'        => trim((string) ($row->Fodt ?? '')),
                'school'      => trim((string) ($row->Skole ?? '')),
                'storm_years' => trim((string) ($row->Storm ?? '')),
                'experience'  => trim((string) ($row->Erfaring ?? '')),
            );
        },
        $rows
    );
}

function storm_arena_get_arrangement_profiles(): array
{
    $rows = storm_arena_get_rows('storm-arrangement', 'ID', 'ASC');

    return array_map(
        static function (object $row): array {
            return array(
                'name'        => trim((string) ($row->Navn ?? '')),
                'photo_url'   => storm_arena_resolve_media_url((string) ($row->Bilde ?? '')),
                'age'         => trim((string) ($row->Alder ?? '')),
                'storm_role'  => trim((string) ($row->Storm ?? '')),
                'occupation'  => trim((string) ($row->Jobb ?? '')),
                'description' => trim((string) ($row->Diverse ?? '')),
            );
        },
        $rows
    );
}

function storm_arena_get_board_profiles(): array
{
    $board_rows = storm_arena_get_rows('storm-board', 'ID', 'ASC');
    $admin_rows = storm_arena_get_rows('storm-admin', 'Navn', 'ASC');

    $profiles = array();

    foreach ($admin_rows as $row) {
        if (trim((string) ($row->Navn ?? '')) === '-' && trim((string) ($row->Diverse ?? '')) === '') {
            continue;
        }

        $profiles[] = array(
            'role'        => 'Administrasjon',
            'name'        => trim((string) ($row->Navn ?? '')),
            'photo_url'   => storm_arena_resolve_media_url((string) ($row->Bilde ?? '')),
            'description' => trim((string) ($row->Diverse ?? '')),
        );
    }

    foreach ($board_rows as $row) {
        $profiles[] = array(
            'role'        => trim((string) ($row->Oppgave ?? '')),
            'name'        => trim((string) ($row->Navn ?? '')),
            'photo_url'   => storm_arena_resolve_media_url((string) ($row->Bilde ?? '')),
            'description' => trim((string) ($row->Diverse ?? '')),
        );
    }

    return $profiles;
}

function storm_arena_get_ifokus_entries(): array
{
    $rows = storm_arena_get_rows('storm-ifokus', 'ID', 'DESC');

    return array_map(
        static function (object $row): array {
            return array(
                'year'    => trim((string) ($row->ID ?? '')),
                'content' => trim((string) ($row->Innhold ?? '')),
            );
        },
        $rows
    );
}

function storm_arena_get_supporter_interest_count(): ?int
{
    global $wpdb;

    $table = $wpdb->prefix . 'cf7dbplugin_submits';
    $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
    if ($found !== $table) {
        return null;
    }

    $count = $wpdb->get_var("SELECT COUNT(DISTINCT submit_time) FROM `$table`");

    return $count !== null ? (int) $count : null;
}

function storm_arena_get_post_fallback_image(int $index = 0): string
{
    $fallbacks = array(
        'assets/grant-sitton-1200.webp',
        'assets/new-era-500.webp',
        'assets/nm-1997-1200.webp',
    );

    $path = $fallbacks[$index % count($fallbacks)];

    return storm_arena_asset_url($path);
}

function storm_arena_get_post_image_url(int $post_id, int $index = 0): string
{
    $featured = get_the_post_thumbnail_url($post_id, 'large');
    if ($featured) {
        return storm_arena_rewrite_legacy_host_urls($featured);
    }

    $images = new WP_HTML_Tag_Processor((string) get_post_field('post_content', $post_id));
    while ($images->next_tag('IMG')) {
        $classes = (string) $images->get_attribute('class');
        $width = (int) $images->get_attribute('width');
        $height = (int) $images->get_attribute('height');
        if (preg_match('/(?:^|\s)emoji(?:\s|$)/', $classes) || ($width > 0 && $width <= 32 && $height > 0 && $height <= 32)) {
            continue;
        }

        if (preg_match('/(?:^|\s)wp-image-(\d+)(?:\s|$)/', $classes, $match)) {
            $attachment = wp_get_attachment_image_url((int) $match[1], 'large');
            if ($attachment) {
                return storm_arena_rewrite_legacy_host_urls($attachment);
            }
        }

        $source = storm_arena_normalize_url((string) $images->get_attribute('src'));
        if ($source !== '') {
            return $source;
        }
    }

    return storm_arena_get_post_fallback_image($index);
}

function storm_arena_get_page_url_by_slug(string $slug, string $fallback = ''): string
{
    static $cache = array();

    if (!array_key_exists($slug, $cache)) {
        $page = get_page_by_path($slug);
        $cache[$slug] = $page instanceof WP_Post ? get_permalink($page) : '';
    }

    return $cache[$slug] !== '' ? $cache[$slug] : $fallback;
}

function storm_arena_get_page_url_by_template(string $template_file, string $fallback_slug = ''): string
{
    static $cache = array();

    if (!array_key_exists($template_file, $cache)) {
        $pages = get_posts(
            array(
                'post_type'      => 'page',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'meta_key'       => '_wp_page_template',
                'meta_value'     => $template_file,
                'orderby'        => array(
                    'menu_order' => 'ASC',
                    'title'      => 'ASC',
                ),
            )
        );

        $cache[$template_file] = !empty($pages) ? get_permalink($pages[0]) : '';
    }

    if ($cache[$template_file] !== '') {
        return $cache[$template_file];
    }

    return $fallback_slug !== '' ? storm_arena_get_page_url_by_slug($fallback_slug, '') : '';
}

function storm_arena_get_filtered_content(?WP_Post $post = null): string
{
    $post = $post ?: get_post();
    if (!$post instanceof WP_Post) {
        return '';
    }

    $content = get_the_content(null, false, $post);
    if (trim(wp_strip_all_tags(str_replace('&nbsp;', ' ', $content))) === '') {
        return '';
    }

    return apply_filters('the_content', $content);
}

function storm_arena_render_post_image(int $post_id, int $index = 0, string $class_name = 'story-image'): void
{
    echo '<img class="' . esc_attr($class_name) . '" src="' . esc_url(storm_arena_get_post_image_url($post_id, $index)) . '" alt="' . esc_attr(get_the_title($post_id)) . '" loading="lazy">';
}
