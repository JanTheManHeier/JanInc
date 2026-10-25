<?php

function storm_arena_build_legacy_template_config(string $template_file): ?array
{
    if (preg_match('/^storm-spillere-(\d{4})-(\d{4})\.php$/', $template_file, $matches)) {
        $season_start = (int) $matches[1];
        $season_end   = (int) $matches[2];
        $queried_post = get_queried_object();

        if ($queried_post instanceof WP_Post && preg_match('/^spillere-trenere-(\d{4})-(\d{4})$/', $queried_post->post_name, $slug_matches)) {
            $season_start = (int) $slug_matches[1];
            $season_end   = (int) $slug_matches[2];
        }

        return array(
            'type'            => 'roster',
            'eyebrow'         => 'Historiske lag',
            'description'     => 'Spillerstall og trenere for den valgte sesongen.',
            'team_label'      => 'Tromsø Storm',
            'season_label'    => $season_start . '/' . $season_end,
            'roster_key'      => "storm-roster-$season_start",
            'coaches_key'     => "storm-coaches-$season_start",
            'navigation_type' => 'roster',
        );
    }

    switch ($template_file) {
        case 'storm-spillere.php':
            return array(
                'type'            => 'roster',
                'eyebrow'         => 'A-laget',
                'description'     => 'Den oppdaterte spillerstallen og trenerteamet for Tromsø Storm.',
                'team_label'      => 'Tromsø Storm',
                'season_label'    => storm_arena_get_current_season_label(),
                'roster_key'      => 'storm-current-roster',
                'coaches_key'     => 'storm-current-coaches',
                'navigation_type' => 'roster',
                'show_team_photo' => true,
            );
        case 'storm-spillere-1div.php':
            return array(
                'type'            => 'roster',
                'eyebrow'         => 'Utviklingslag',
                'description'     => 'Spillerstall og trenere for 1. divisjon.',
                'team_label'      => 'Tromsø Storm 2',
                'season_label'    => '1. divisjon',
                'roster_key'      => 'storm-1div-roster',
                'coaches_key'     => 'storm-1div-coaches',
                'navigation_type' => 'roster',
            );
        case 'varden-spillere.php':
            return array(
                'type'            => 'roster',
                'eyebrow'         => 'Varden',
                'description'     => 'Spillerstall og trenere for Varden.',
                'team_label'      => 'Varden',
                'season_label'    => '',
                'roster_key'      => 'varden-roster',
                'coaches_key'     => 'varden-coaches',
                'navigation_type' => 'varden',
            );
        case 'storm-kampoversikt.php':
            return array(
                'type'            => 'fixtures',
                'eyebrow'         => 'Kamper',
                'description'     => 'Neste kamp, terminliste og resultater for Tromsø Storm.',
                'team_label'      => 'Tromsø Storm',
                'fixtures_key'    => 'storm-current-fixtures',
                'navigation_type' => 'fixtures',
            );
        case 'storm-kampoversikt-1div.php':
            return array(
                'type'            => 'fixtures',
                'eyebrow'         => 'Utviklingslag',
                'description'     => 'Kampoversikt for 1. divisjon.',
                'team_label'      => 'Tromsø Storm 2',
                'fixtures_key'    => 'storm-1div-fixtures',
                'navigation_type' => 'fixtures',
            );
        case 'varden-kampoversikt.php':
            return array(
                'type'            => 'fixtures',
                'eyebrow'         => 'Varden',
                'description'     => 'Kampoversikt for Varden.',
                'team_label'      => 'Varden',
                'fixtures_key'    => 'varden-fixtures',
                'navigation_type' => 'varden',
            );
        case 'storm-kampoversikt-tidligere.php':
            return array(
                'type'            => 'fixtures-history',
                'eyebrow'         => 'Historiske sesonger',
                'description'     => 'Terminlister og resultater fra tidligere Storm-sesonger.',
                'navigation_type' => 'fixtures',
            );
        case 'storm-treningstider.php':
            return array(
                'type'            => 'training',
                'eyebrow'         => 'Hallen',
                'description'     => 'Oppdaterte treningstider for Tromsø Storm.',
                'training_key'    => 'storm-training',
                'navigation_type' => 'training',
            );
        case 'varden-treningstider.php':
            return array(
                'type'            => 'training',
                'eyebrow'         => 'Varden',
                'description'     => 'Treningstider for Varden.',
                'training_key'    => 'varden-training',
                'navigation_type' => 'varden',
            );
        case 'storm-streetbasketbaner.php':
            return array(
                'type'        => 'streetbasket',
                'eyebrow'     => 'Bybaner',
                'description' => 'Oversikt over streetbasketbaner i Tromsø.',
            );
        case 'storm-samarbeidspartnere.php':
            return array(
                'type'            => 'sponsors',
                'eyebrow'         => 'Laget bak laget',
                'description'     => 'Samarbeidspartnerne som løfter Tromsø Storm gjennom sesongen.',
                'sponsor_type'    => 'Samarbeidspartnere',
                'navigation_type' => 'sponsors',
            );
        case 'storm-ovrige-samarbeidspartnere.php':
            return array(
                'type'            => 'sponsors',
                'eyebrow'         => 'Laget bak laget',
                'description'     => 'Øvrige samarbeidspartnere og støttespillere.',
                'sponsor_type'    => 'Ovrige',
                'navigation_type' => 'sponsors',
            );
        case 'storm-arcticgirls.php':
            return array(
                'type'        => 'dancers',
                'eyebrow'     => 'Arctic Girls',
                'description' => 'Historien og menneskene bak Storms danselag.',
            );
        case 'storm-stottemedlem-1.php':
            return array(
                'type'        => 'supporters-business',
                'eyebrow'     => 'Støttemedlemmer',
                'description' => 'Bedrifter som støtter Tromsø Storm.',
            );
        case 'storm-stottemedlem-2.php':
            return array(
                'type'        => 'supporters-people',
                'eyebrow'     => 'Støttemedlemmer',
                'description' => 'Personlige støttemedlemmer i Storm-familien.',
            );
        case 'storm-bli-supporter-ny-layout.php':
            return array(
                'type'        => 'supporter-landing',
                'eyebrow'     => 'Bli med på laget',
                'description' => 'Vis interesse for å støtte Tromsø Storm og bli en del av prosjektet i nord.',
            );
        case 'storm-arkiv.php':
            return array(
                'type'        => 'archive-page',
                'eyebrow'     => 'Om klubben',
                'title'       => 'Tromsø Storm',
                'description' => 'Historien, menneskene og arkivet til eliteklubben i nord.',
            );
        case 'storm-arrangement.php':
            return array(
                'type'        => 'arrangement',
                'eyebrow'     => 'Kampdag',
                'description' => 'Folkene som skaper kampopplevelsen rundt Tromsø Storm.',
            );
        case 'storm-styret.php':
            return array(
                'type'        => 'board',
                'eyebrow'     => 'Klubben',
                'description' => 'Styret og administrasjonen i Tromsø Storm.',
            );
        case 'storm-ifokus.php':
            return array(
                'type'        => 'ifokus',
                'eyebrow'     => 'Storm i Fokus',
                'description' => 'Historiske iFokus-arrangementer og næringslivshistorier fra klubben.',
            );
    }

    return null;
}

function storm_arena_render_named_template(string $template_file): void
{
    $config = storm_arena_build_legacy_template_config($template_file);

    get_header();

    echo '<main id="main-content" class="site-main site-shell">';

    if (!$config) {
        echo '<section class="page-hero"><span class="eyebrow">Tema</span><h1>Mangler mal</h1><p>Den forespurte sidemalen er ikke konfigurert i storm-arena.</p></section>';
        echo '</main>';
        get_footer();
        return;
    }

    if (have_posts()) {
        while (have_posts()) {
            the_post();
            storm_arena_render_legacy_page($config);
        }
    } else {
        storm_arena_render_empty_state('Siden kunne ikke lastes.', 'Prøv igjen senere eller bruk søket for å finne relaterte artikler.');
    }

    echo '</main>';

    get_footer();
}

function storm_arena_render_page_hero(string $eyebrow, string $title, string $description = ''): void
{
    echo '<section class="page-hero">';
    echo '<span class="eyebrow">' . esc_html($eyebrow) . '</span>';
    echo '<h1>' . esc_html($title) . '</h1>';
    if ($description !== '') {
        echo '<p>' . esc_html($description) . '</p>';
    }
    echo '</section>';
}

function storm_arena_render_content_block(WP_Post $post): void
{
    $content = storm_arena_get_filtered_content($post);
    if ($content === '') {
        return;
    }

    echo '<section class="content-section"><article class="content-card prose">';
    echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    wp_link_pages();
    echo '</article></section>';
}

function storm_arena_render_empty_state(string $title, string $message): void
{
    echo '<section class="content-section"><article class="content-card empty-state">';
    echo '<h2>' . esc_html($title) . '</h2>';
    echo '<p>' . esc_html($message) . '</p>';
    echo '</article></section>';
}

function storm_arena_render_named_image_or_placeholder(string $image_url, string $name, string $class_name, string $placeholder_class = 'media-placeholder'): void
{
    if ($image_url !== '') {
        echo '<img class="' . esc_attr($class_name) . '" src="' . esc_url($image_url) . '" alt="' . esc_attr($name) . '" loading="lazy">';
        return;
    }

    echo '<div class="' . esc_attr($placeholder_class) . '" aria-hidden="true"><span>' . esc_html(storm_arena_profile_initials($name)) . '</span></div>';
}

function storm_arena_profile_initials(string $name): string
{
    $name = trim($name);
    if ($name === '') {
        return 'TS';
    }

    $parts = preg_split('/\s+/', $name) ?: array($name);
    $initials = '';

    foreach (array_slice($parts, 0, 2) as $part) {
        $initials .= mb_substr($part, 0, 1);
    }

    return mb_strtoupper($initials);
}

function storm_arena_format_match_team(string $name): string
{
    $escaped = esc_html($name);
    $normalized = remove_accents(mb_strtolower($name));
    $logo_asset = storm_arena_get_team_logo_asset($name);
    $logo = $logo_asset === ''
        ? ''
        : '<img class="team-inline-logo" src="' . esc_url(storm_arena_asset_url($logo_asset)) . '" alt="">';

    if (str_contains($normalized, 'tromso') || str_contains($normalized, 'varden')) {
        return '<span class="team-inline">' . $logo . '<strong>' . $escaped . '</strong></span>';
    }

    return '<span class="team-inline">' . $logo . $escaped . '</span>';
}

function storm_arena_get_team_logo_asset(string $name): string
{
    $normalized = remove_accents(mb_strtolower($name));
    $logos = array(
        'tromso'   => 'assets/storm-logo.png',
        'ammerud'  => 'assets/opponents/ammerud.jpg',
        'baerum'   => 'assets/opponents/baerum.png',
        'centrum'  => 'assets/opponents/centrum.gif',
        'froya'    => 'assets/opponents/froya.png',
        'fyllingen'=> 'assets/opponents/fyllingen.webp',
        'gimle'    => 'assets/opponents/gimle.png',
        'kongsberg'=> 'assets/opponents/kongsberg.png',
        'nidaros'  => 'assets/opponents/nidaros.png',
        'tnt'      => 'assets/opponents/tnt.png',
    );

    foreach ($logos as $team => $asset) {
        if (str_contains($normalized, $team)) {
            return $asset;
        }
    }

    return '';
}

function storm_arena_render_match_club(string $name): void
{
    $is_storm = storm_arena_is_team_home($name);
    $class_name = $is_storm ? 'club' : 'club opponent';
    $logo_asset = storm_arena_get_team_logo_asset($name);

    echo '<div class="' . esc_attr($class_name) . '">';
    if ($logo_asset !== '') {
        echo '<img src="' . esc_url(storm_arena_asset_url($logo_asset)) . '" alt="">';
    } else {
        echo '<span>' . esc_html(mb_substr($name, 0, 1)) . '</span>';
    }
    echo '<strong>' . esc_html($name) . '</strong></div>';
}

function storm_arena_render_page_links(array $links): void
{
    $filtered = array_values(array_filter($links, static fn(array $link): bool => !empty($link['url'])));
    if (empty($filtered)) {
        return;
    }

    echo '<div class="chip-row">';
    foreach ($filtered as $link) {
        echo '<a class="chip" href="' . esc_url($link['url']) . '">' . esc_html($link['label']) . '</a>';
    }
    echo '</div>';
}

function storm_arena_get_roster_navigation_links(): array
{
    $links = array(
        array('label' => 'Nåværende stall', 'url' => storm_arena_get_page_url_by_template('storm-spillere.php', 'spillere-trenere')),
        array('label' => '1. divisjon', 'url' => storm_arena_get_page_url_by_template('storm-spillere-1div.php')),
    );

    for ($season = 2025; $season >= 2002; $season--) {
        $label = $season . '/' . ($season + 1);
        $slug  = sprintf('spillere-trenere-%d-%d', $season, $season + 1);
        $links[] = array(
            'label' => $label,
            'url'   => storm_arena_get_page_url_by_template(sprintf('storm-spillere-%d-%d.php', $season, $season + 1), $slug),
        );
    }

    return $links;
}

function storm_arena_get_fixture_navigation_links(): array
{
    return array(
        array('label' => 'Denne sesongen', 'url' => storm_arena_get_page_url_by_template('storm-kampoversikt.php', 'kampoversikt')),
        array('label' => 'Tidligere sesonger', 'url' => storm_arena_get_page_url_by_template('storm-kampoversikt-tidligere.php', 'terminlister-tidligere-sesonger')),
        array('label' => '1. divisjon', 'url' => storm_arena_get_page_url_by_template('storm-kampoversikt-1div.php')),
    );
}

function storm_arena_get_sponsor_navigation_links(): array
{
    return array(
        array('label' => 'Hovedsamarbeidspartnere', 'url' => storm_arena_get_page_url_by_slug('hovedsamarbeidspartnere')),
        array('label' => 'Samarbeidspartnere', 'url' => storm_arena_get_page_url_by_template('storm-samarbeidspartnere.php', 'samarbeidspartnere')),
        array('label' => 'Øvrige', 'url' => storm_arena_get_page_url_by_template('storm-ovrige-samarbeidspartnere.php', 'ovrige-samarbeidspartnere')),
    );
}

function storm_arena_render_legacy_page(array $config): void
{
    $post = get_post();
    if (!$post instanceof WP_Post) {
        return;
    }

    storm_arena_render_page_hero($config['eyebrow'], $config['title'] ?? get_the_title($post), $config['description'] ?? '');
    if ($config['type'] !== 'roster') {
        storm_arena_render_content_block($post);
    }

    switch ($config['type']) {
        case 'roster':
            storm_arena_render_roster_page($config);
            break;
        case 'fixtures':
            storm_arena_render_fixtures_page($config);
            break;
        case 'fixtures-history':
            storm_arena_render_fixture_history_page();
            break;
        case 'training':
            storm_arena_render_training_page($config);
            break;
        case 'streetbasket':
            storm_arena_render_streetbasket_page();
            break;
        case 'sponsors':
            storm_arena_render_sponsor_page($config);
            break;
        case 'dancers':
            storm_arena_render_dancers_page();
            break;
        case 'supporters-business':
            storm_arena_render_supporters_business_page();
            break;
        case 'supporters-people':
            storm_arena_render_supporters_people_page();
            break;
        case 'supporter-landing':
            storm_arena_render_supporter_landing_page();
            break;
        case 'archive-page':
            storm_arena_render_archive_page();
            break;
        case 'arrangement':
            storm_arena_render_arrangement_page();
            break;
        case 'board':
            storm_arena_render_board_page();
            break;
        case 'ifokus':
            storm_arena_render_ifokus_page();
            break;
    }
}

function storm_arena_render_roster_page(array $config): void
{
    $players = storm_arena_get_roster_entries($config['roster_key']);
    $coaches = storm_arena_get_coach_entries($config['coaches_key']);

    echo '<section class="content-section">';

    echo '<div class="section-head"><div><div class="section-label"><span>01</span><strong>' . esc_html($config['team_label']) . '</strong></div><h2>Spillerstall';
    if (!empty($config['season_label'])) {
        echo ' <span class="section-head__meta">' . esc_html($config['season_label']) . '</span>';
    }
    echo '</h2></div></div>';

    if (empty($players)) {
        echo '<article class="content-card empty-state"><h3>Spillerstallen er ikke publisert ennå.</h3><p>Oppdaterte spillerprofiler kommer så snart de er klare.</p></article>';
    } else {
        echo '<div class="roster-grid">';
        foreach ($players as $player) {
            echo '<article class="player-card">';
            echo '<div class="player-photo">';
            storm_arena_render_named_image_or_placeholder($player['photo_url'], $player['name'], 'player-photo__image');
            if ($player['number'] !== null && $player['number'] >= 0) {
                echo '<span class="jersey-number">' . esc_html((string) $player['number']) . '</span>';
            }
            echo '</div>';
            echo '<div class="player-info">';
            $meta = array_filter(
                array(
                    $player['position'],
                    $player['height'] > 0 ? $player['height'] . ' cm' : '',
                    $player['weight'] > 0 ? $player['weight'] . ' kg' : '',
                    $player['born'] !== '' ? 'født ' . $player['born'] : '',
                )
            );
            echo '<span class="player-meta">' . esc_html(implode(' · ', $meta)) . '</span>';
            echo '<h3>';
            if (!empty($player['url'])) {
                echo '<a href="' . esc_url($player['url']) . '">' . esc_html($player['name']) . '</a>';
            } else {
                echo esc_html($player['name']);
            }
            echo '</h3>';
            if ($player['experience'] > 0) {
                echo '<p class="player-subtle">' . esc_html($player['experience'] . ' år i eliteserien') . '</p>';
            }
            if ($player['description'] !== '') {
                echo '<details><summary>Om spilleren</summary><div class="prose"><p>' . wp_kses_post($player['description']) . '</p></div></details>';
            }
            echo '</div></article>';
        }
        echo '</div>';
    }

    if (!empty($coaches)) {
        echo '<div class="coaching-staff"><h3>Trenerteam</h3>';
        foreach ($coaches as $coach) {
            echo '<article class="coach-card">';
            storm_arena_render_named_image_or_placeholder($coach['photo_url'], $coach['name'], 'coach-card__image');
            echo '<div>';
            if ($coach['role'] !== '') {
                echo '<span>' . esc_html($coach['role']) . '</span>';
            }
            echo '<strong>' . esc_html($coach['name']) . '</strong>';
            if ($coach['description'] !== '') {
                echo '<p>' . wp_kses_post($coach['description']) . '</p>';
            }
            echo '</div></article>';
        }
        echo '</div>';
    }

    if (!empty($config['show_team_photo'])) {
        echo '<figure class="team-photo"><img src="' . esc_url(storm_arena_asset_url('assets/team-current-1200.webp')) . '" alt="Tromsø Storm lagbilde" loading="lazy"><figcaption>Lagbilde fra 2025/26 brukes som reserve til nytt offisielt sesongbilde er publisert.</figcaption></figure>';
    }

    if (($config['navigation_type'] ?? '') === 'roster') {
        $archive_links = storm_arena_get_roster_navigation_links();
        array_shift($archive_links);
        echo '<details class="roster-archive">';
        echo '<summary>Tidligere spillerstaller</summary>';
        echo '<p>Se spillere og trenere fra tidligere sesonger.</p>';
        storm_arena_render_page_links($archive_links);
        echo '</details>';
    }

    echo '</section>';
}

function storm_arena_render_match_rows(array $matches, bool $interactive = false): void
{
    if (empty($matches)) {
        echo '<article class="content-card empty-state"><h3>Terminlisten er ikke publisert ennå.</h3><p>Nye kamper legges ut så snart de er bekreftet.</p></article>';
        return;
    }

    if ($interactive) {
        echo '<div class="filters" role="group" aria-label="Filtrer kamper">';
        echo '<button class="filter active" type="button" data-filter="all" aria-pressed="true">Alle</button>';
        echo '<button class="filter" type="button" data-filter="home" aria-pressed="false">Hjemme</button>';
        echo '<button class="filter" type="button" data-filter="away" aria-pressed="false">Borte</button>';
        echo '</div>';
    }

    echo '<div class="schedule-list"' . ($interactive ? ' data-schedule data-initial-limit="6"' : '') . '>';
    foreach ($matches as $index => $match) {
        $date_text = $match['date'] instanceof DateTimeInterface
            ? storm_arena_get_day_name_short((int) $match['date']->format('w')) . ' ' . storm_arena_format_short_date($match['date']) . ' · ' . $match['date']->format('H:i')
            : trim($match['legacy_day_label'] . ' ' . ($match['date'] instanceof DateTimeInterface ? '' : ''));
        $match_url = $match['stats_url'] !== '' ? $match['stats_url'] : '';
        $result    = storm_arena_get_match_result_text($match);

        echo '<article class="game-row ' . esc_attr($match['is_home'] ? 'home' : 'away') . '"' . ($interactive ? ' data-filter-group="' . esc_attr($match['is_home'] ? 'home' : 'away') . '"' : '') . ($interactive && $index >= 6 ? ' hidden' : '') . '>';
        echo '<time datetime="' . esc_attr($match['date'] instanceof DateTimeInterface ? $match['date']->format(DATE_ATOM) : '') . '">';
        echo esc_html($date_text);
        echo '<small>' . esc_html($match['is_home'] ? 'Hjemmekamp' : 'Bortekamp') . '</small></time>';
        echo '<div class="teams">' . storm_arena_format_match_team($match['home']) . ' — ' . storm_arena_format_match_team($match['away']) . '</div>';
        echo '<div class="game-row__meta"><span class="venue">' . esc_html($match['venue'] ?: 'Arena publiseres snart') . '</span>';
        if ($match_url !== '') {
            echo '<a class="text-link" href="' . esc_url($match_url) . '">Statistikk</a>';
        }
        echo '<span class="result-chip">' . esc_html($result) . '</span></div>';
        echo '</article>';
    }
    echo '</div>';

    if ($interactive && count($matches) > 6) {
        echo '<button class="schedule-toggle" type="button" aria-expanded="false">Vis alle kamper</button>';
    }
}

function storm_arena_render_fixtures_page(array $config): void
{
    $matches = storm_arena_get_schedule_entries($config['fixtures_key'], $config['team_label']);
    $next    = storm_arena_get_next_match($matches);
    $calendar_url = home_url('/storm-kamper.ics');

    echo '<section class="content-section">';
    if (($config['navigation_type'] ?? '') === 'fixtures') {
        storm_arena_render_page_links(storm_arena_get_fixture_navigation_links());
    }

    if ($next !== null && $next['date'] instanceof DateTimeInterface) {
        $countdown = 'Ny sesong nærmer seg';
        if ($next['timestamp'] !== null) {
            $days = (int) ceil(($next['timestamp'] - current_time('timestamp')) / DAY_IN_SECONDS);
            $countdown = $days <= 0 ? 'Kampdag' : $days . ' dager igjen';
        }

        echo '<div class="game-card">';
        echo '<div class="game-date">';
        echo '<span>' . esc_html(storm_arena_get_day_name_short((int) $next['date']->format('w'))) . '</span>';
        echo '<strong>' . esc_html(mb_strtoupper(storm_arena_format_short_date($next['date']))) . '</strong>';
        echo '<time datetime="' . esc_attr($next['date']->format(DATE_ATOM)) . '">' . esc_html($next['date']->format('H:i')) . '</time>';
        echo '</div>';
        echo '<div class="matchup">';
        storm_arena_render_match_club($next['home']);
        echo '<span class="versus">VS</span>';
        storm_arena_render_match_club($next['away']);
        echo '</div>';
        echo '<div class="game-meta"><strong>' . esc_html($countdown) . '</strong><span>' . esc_html($next['venue'] ?: 'Arena publiseres snart') . '</span>';
        if ($next['stats_url'] !== '') {
            echo '<a class="button primary" href="' . esc_url($next['stats_url']) . '">Kampdetaljer</a>';
        }
        echo '</div></div>';
    }

    echo '<div class="section-head"><div><div class="section-label"><span>02</span><strong>Kampoversikt</strong></div><h2>Terminliste</h2></div><a class="button secondary" href="' . esc_url($calendar_url) . '" download>Legg kampene i kalenderen</a></div>';
    storm_arena_render_match_rows($matches, true);
    echo '</section>';
}

function storm_arena_render_fixture_history_page(): void
{
    echo '<section class="content-section">';
    storm_arena_render_page_links(storm_arena_get_fixture_navigation_links());
    echo '<div class="section-head"><div><div class="section-label"><span>01</span><strong>Historikk</strong></div><h2>Tidligere sesonger</h2></div></div>';

    $rendered = false;
    foreach (range(2026, 2002) as $season_start) {
        $matches = storm_arena_get_schedule_entries("storm-fixtures-$season_start");
        if (empty($matches)) {
            continue;
        }

        $rendered = true;
        $season_label = $season_start . '/' . ($season_start + 1);
        echo '<details class="season-block"' . ($season_start >= 2024 ? ' open' : '') . '>';
        echo '<summary>' . esc_html($season_label) . '</summary>';
        echo '<div class="season-block__content">';
        storm_arena_render_match_rows($matches, false);
        echo '</div></details>';
    }

    if (!$rendered) {
        storm_arena_render_empty_state('Tidligere terminlister mangler.', 'Ingen historiske terminlister er tilgjengelige i databasen ennå.');
    }

    echo '</section>';
}

function storm_arena_render_training_page(array $config): void
{
    $rows = storm_arena_get_training_times($config['training_key']);

    echo '<section class="content-section">';
    echo '<div class="section-head"><div><div class="section-label"><span>01</span><strong>Treningstider</strong></div><h2>Hverdagen i hallen</h2></div></div>';

    if (empty($rows)) {
        echo '<article class="content-card empty-state"><h3>Treningstidene er ikke publisert ennå.</h3><p>Ta kontakt med klubben for siste oppdatering.</p></article>';
    } else {
        echo '<div class="table-scroll"><table class="data-table"><thead><tr><th>Lag/gruppe</th><th>Dag</th><th>Tid</th><th>Sted</th></tr></thead><tbody>';
        foreach ($rows as $row) {
            echo '<tr><td>' . esc_html($row['team'] ?? 'Tromsø Storm') . '</td><td>' . esc_html($row['day']) . '</td><td>' . esc_html($row['time']) . '</td><td>' . esc_html($row['venue']) . '</td></tr>';
        }
        echo '</tbody></table></div>';
        echo '<p class="supporting-copy">NB! Treningstidene kan variere fra uke til uke ved utleie og kampaktivitet.</p>';
    }
    echo '</section>';
}

function storm_arena_render_streetbasket_page(): void
{
    $courts = storm_arena_get_streetbasket_courts();

    echo '<section class="content-section">';
    echo '<div class="section-head"><div><div class="section-label"><span>01</span><strong>Basket i byen</strong></div><h2>Streetbasketbaner</h2></div></div>';

    if (empty($courts)) {
        echo '<article class="content-card empty-state"><h3>Banene er ikke registrert ennå.</h3><p>Kom tilbake senere for oppdatert oversikt.</p></article>';
    } else {
        echo '<div class="content-grid">';
        foreach ($courts as $court) {
            echo '<article class="content-card"><h3>' . esc_html($court['name']) . '</h3><p>' . esc_html($court['description']) . '</p></article>';
        }
        echo '</div>';
    }
    echo '</section>';
}

function storm_arena_render_sponsor_cards(array $sponsors, bool $detailed = true): void
{
    if (empty($sponsors)) {
        echo '<article class="content-card empty-state"><h3>Partnerlisten oppdateres.</h3><p>Kontakt klubben dersom du ønsker å bli synlig her.</p></article>';
        return;
    }

    echo '<div class="partner-grid partner-grid--page">';
    foreach ($sponsors as $sponsor) {
        $tag = $sponsor['type'] === 'Ovrige' ? 'Øvrig partner' : str_replace('Hovedsamarbeidspartnere', 'Hovedsponsor', $sponsor['type']);
        echo '<article class="partner-card">';
        if ($sponsor['link_url'] !== '') {
            echo '<a href="' . esc_url($sponsor['link_url']) . '"' . (storm_arena_is_internal_url($sponsor['link_url']) ? '' : ' rel="noopener noreferrer" target="_blank"') . '>';
        }
        echo '<div class="partner-card__logo">';
        if ($sponsor['logo_url'] !== '') {
            echo '<img src="' . esc_url($sponsor['logo_url']) . '" alt="' . esc_attr($sponsor['name']) . '" loading="lazy">';
        } else {
            echo '<span class="partner-card__name">' . esc_html($sponsor['name']) . '</span>';
        }
        echo '</div>';
        if ($sponsor['link_url'] !== '') {
            echo '</a>';
        }
        echo '<div class="partner-card__copy"><span class="chip chip--inline">' . esc_html($tag) . '</span><h3>' . esc_html($sponsor['name']) . '</h3>';
        if ($detailed && $sponsor['text'] !== '') {
            echo '<p>' . wp_kses_post($sponsor['text']) . '</p>';
        }
        if ($sponsor['link_url'] !== '') {
            echo '<a class="text-link" href="' . esc_url($sponsor['link_url']) . '"' . (storm_arena_is_internal_url($sponsor['link_url']) ? '' : ' rel="noopener noreferrer" target="_blank"') . '>Besøk partneren →</a>';
        }
        echo '</div></article>';
    }
    echo '</div>';
}

function storm_arena_render_partner_proposition(): void
{
    if (storm_arena_editorial_content('partners')) {
        return;
    }
    $contact_url = 'mailto:storm@tromsostorm.no?subject=' . rawurlencode('Partnerskap med Tromsø Storm')
        . '&body=' . rawurlencode("Hei Tromsø Storm,\n\nVi ønsker å høre mer om et mulig partnerskap.\n\nBedrift:\nKontaktperson:\nTelefon:\nHva ønsker vi å oppnå:\n");

    echo '<section class="partner-offer" aria-labelledby="partner-offer-title">';
    echo '<div class="partner-offer__intro">';
    echo '<div><span class="eyebrow">Bli partner</span><h2 id="partner-offer-title">Bygg elitebasket i nord sammen med oss.</h2></div>';
    echo '<div><p>Tromsø Storm gir bedrifter en synlig plass rundt kampopplevelsen, i klubbens digitale flater og i et engasjert nordnorsk basketmiljø. Vi former partnerskapet etter hva virksomheten ønsker å oppnå.</p>';
    echo '<a class="button primary" href="' . esc_url($contact_url) . '">Be om en partnersamtale</a></div>';
    echo '</div>';

    echo '<div class="partner-value-grid">';
    echo '<article><span>01</span><h3>Synlighet med energi</h3><p>Profilering i relevante klubbflater, rundt hjemmekampene og i redaksjonelt innhold som avtales på forhånd.</p></article>';
    echo '<article><span>02</span><h3>Relasjoner og vertskap</h3><p>Muligheter for å bruke kampdagen til å møte kunder, ansatte og samarbeidspartnere i en sterk lokal ramme.</p></article>';
    echo '<article><span>03</span><h3>Aktivering som engasjerer</h3><p>Konkurranser, kampvert-aktiviteter og innhold utvikles sammen med partneren og tilpasses målgruppen.</p></article>';
    echo '<article><span>04</span><h3>En del av laget</h3><p>Knytt virksomheten til eliteidrett, talentutvikling og arbeidet for å styrke basketen i Nord-Norge.</p></article>';
    echo '</div>';

    echo '<div class="section-head partner-levels-heading"><div><div class="section-label"><span>02</span><strong>Samarbeidsnivåer</strong></div><h2>En plass som passer ambisjonen.</h2></div><p>Endelig innhold, omfang og pris avtales med klubben. Nivåene gir et tydelig utgangspunkt for samtalen.</p></div>';
    echo '<div class="partner-levels">';
    echo '<article class="partner-level partner-level--featured"><span class="chip chip--inline">Størst tilstedeværelse</span><h3>Hovedsamarbeidspartner</h3><p>For virksomheter som ønsker en sentral rolle i Storms satsing og et skreddersydd opplegg på tvers av klubbens viktigste flater.</p><ul><li>Prioritert synlighet</li><li>Skreddersydd aktivering</li><li>Muligheter rundt kampdag og vertskap</li></ul></article>';
    echo '<article class="partner-level"><span class="chip chip--inline">Tydelig gjennom sesongen</span><h3>Samarbeidspartner</h3><p>For bedrifter som ønsker jevn synlighet og konkrete møteplasser gjennom sesongen.</p><ul><li>Avtalte digitale og fysiske flater</li><li>Mulighet for kampaktivering</li><li>Partnerkommunikasjon og vertskap</li></ul></article>';
    echo '<article class="partner-level"><span class="chip chip--inline">Enkel vei inn</span><h3>Øvrig samarbeidspartner</h3><p>For lokale virksomheter som vil støtte laget og være synlige som en del av miljøet rundt Tromsø Storm.</p><ul><li>Synlighet i partneroversikten</li><li>Tilknytning til klubbens nettverk</li><li>Mulighet for videre utvikling</li></ul></article>';
    echo '</div>';

    echo '<div class="partner-process">';
    echo '<div><span class="eyebrow">Slik starter vi</span><h2>Fra mål til samarbeid.</h2></div>';
    echo '<ol><li><strong>En kort samtale</strong><span>Vi kartlegger målgruppe, mål og ønsket engasjement.</span></li><li><strong>Et konkret forslag</strong><span>Klubben setter sammen nivå, flater og aktiviteter.</span></li><li><strong>En tydelig plan</strong><span>Partene avtaler leveranser, ansvar og oppfølging.</span></li></ol>';
    echo '</div>';

    echo '<div class="partner-contact">';
    echo '<div><span class="eyebrow">Klar for å høre mer?</span><h2>Ta en uforpliktende partnersamtale.</h2><p>Fortell kort om virksomheten og hva dere ønsker å oppnå, så tar klubben kontakt.</p></div>';
    echo '<a class="button primary" href="' . esc_url($contact_url) . '">Kontakt Tromsø Storm</a>';
    echo '</div>';
    echo '</section>';
}

function storm_arena_render_sponsor_page(array $config): void
{
    $sponsors = storm_arena_get_sponsors_by_type($config['sponsor_type']);
    if ($config['sponsor_type'] === 'Samarbeidspartnere') {
        $sponsors = array_values(
            array_filter(
                $sponsors,
                static fn(array $sponsor): bool => !storm_arena_is_featured_sponsor($sponsor)
            )
        );
    }

    echo '<section class="content-section">';
    storm_arena_render_page_links(storm_arena_get_sponsor_navigation_links());
    if ($config['sponsor_type'] === 'Samarbeidspartnere') {
        storm_arena_render_partner_proposition();
    }
    $section_number = $config['sponsor_type'] === 'Samarbeidspartnere' ? '03' : '01';
    echo '<div class="section-head"><div><div class="section-label"><span>' . esc_html($section_number) . '</span><strong>Partnere</strong></div><h2>' . esc_html(get_the_title()) . '</h2></div></div>';
    storm_arena_render_sponsor_cards($sponsors);
    echo '</section>';
}

function storm_arena_render_dancers_page(): void
{
    $dancers = storm_arena_get_dancers();

    echo '<section class="content-section">';
    echo '<figure class="content-card feature-media"><img src="' . esc_url(home_url('/wp-content/uploads/2010/11/ArcticGirls-Storm3-500x333.jpg')) . '" alt="Arctic Girls" loading="lazy"></figure>';
    if (empty($dancers)) {
        echo '<article class="content-card empty-state"><h3>Arctic Girls er ikke publisert i databasen akkurat nå.</h3><p>Siden beholdes for historikk og kan fylles på igjen senere.</p></article>';
    } else {
        echo '<div class="content-grid">';
        foreach ($dancers as $dancer) {
            echo '<article class="profile-card">';
            storm_arena_render_named_image_or_placeholder($dancer['photo_url'], $dancer['name'], 'profile-card__image');
            echo '<div class="profile-card__copy"><h3>' . esc_html($dancer['name']) . '</h3><ul class="stats-list">';
            if ($dancer['born'] !== '') {
                echo '<li><strong>Født</strong><span>' . esc_html($dancer['born']) . '</span></li>';
            }
            if ($dancer['school'] !== '') {
                echo '<li><strong>Skole/linje</strong><span>' . esc_html($dancer['school']) . '</span></li>';
            }
            if ($dancer['storm_years'] !== '') {
                echo '<li><strong>Storm</strong><span>' . esc_html($dancer['storm_years']) . '</span></li>';
            }
            echo '</ul>';
            if ($dancer['experience'] !== '') {
                echo '<p>' . esc_html($dancer['experience']) . '</p>';
            }
            echo '</div></article>';
        }
        echo '</div>';
    }
    echo '</section>';
}

function storm_arena_render_supporters_business_page(): void
{
    $supporters = storm_arena_get_supporter_businesses();

    echo '<section class="content-section"><div class="section-head"><div><div class="section-label"><span>01</span><strong>Bedrifter</strong></div><h2>Støttemedlemmer</h2></div></div>';
    if (empty($supporters)) {
        storm_arena_render_empty_state('Ingen bedrifter er registrert ennå.', 'Oppdatert liste kommer når nye støttemedlemmer legges inn.');
    } else {
        echo '<div class="partner-grid">';
        foreach ($supporters as $supporter) {
            $tag_open  = $supporter['link_url'] !== '' ? '<a class="partner-grid__tile" href="' . esc_url($supporter['link_url']) . '" rel="noopener noreferrer" target="_blank">' : '<div class="partner-grid__tile">';
            $tag_close = $supporter['link_url'] !== '' ? '</a>' : '</div>';
            echo $tag_open; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            if ($supporter['logo_url'] !== '') {
                echo '<img src="' . esc_url($supporter['logo_url']) . '" alt="' . esc_attr($supporter['name']) . '" loading="lazy">';
            } else {
                echo '<span class="partner-card__name">' . esc_html($supporter['name']) . '</span>';
            }
            echo $tag_close; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        }
        echo '</div>';
    }
    echo '</section>';
}

function storm_arena_render_supporters_people_page(): void
{
    $people = storm_arena_get_supporter_people();

    echo '<section class="content-section"><div class="section-head"><div><div class="section-label"><span>01</span><strong>Personer</strong></div><h2>Støttemedlemmer</h2></div></div>';
    if (empty($people)) {
        storm_arena_render_empty_state('Ingen personlige støttemedlemmer er registrert ennå.', 'Listen oppdateres når nye støttemedlemmer kommer til.');
    } else {
        echo '<div class="name-grid">';
        foreach ($people as $person) {
            echo '<span class="name-pill">' . esc_html($person) . '</span>';
        }
        echo '</div>';
    }
    echo '</section>';
}

function storm_arena_render_supporter_landing_page(): void
{
    $count = storm_arena_get_supporter_interest_count();

    echo '<section class="content-section"><article class="hero hero--inner">';
    echo '<img class="hero-image" src="' . esc_url(storm_arena_asset_url('assets/hero-action-1600.webp')) . '" alt="Tromsø Storm i kamp" loading="eager">';
    echo '<div class="hero-panel"><span class="eyebrow">Støtt Tromsø Storm</span><h2>Eliteklubben<br>i nord.</h2><p>Tromsø Storm er en bauta i norsk basket. Som støttespiller hjelper du klubben å bygge et sterkt sportslig og samfunnsrettet prosjekt i nord.</p>';
    if ($count !== null) {
        echo '<p class="supporting-copy"><strong>' . esc_html((string) $count) . '</strong> supportere har allerede meldt sin interesse.</p>';
    }
    echo '<a class="button primary" href="mailto:storm@tromsostorm.no?subject=Jeg%20vil%20st%C3%B8tte%20Troms%C3%B8%20Storm">Ta kontakt</a></div></article></section>';
}

function storm_arena_render_archive_page(): void
{
    echo '<section class="content-section">';
    echo '<div class="section-head"><div><div class="section-label"><span>01</span><strong>Klubben</strong></div><h2>En bauta i norsk basket</h2></div></div>';
    echo '<div class="content-grid club-overview">';
    echo '<article class="content-card prose"><span class="eyebrow">Siden 1976</span><h3>Basketkraft fra nord</h3><p>Tromsø Storm representerer elitebasket i Nord-Norge og bygger videre på flere tiår med sterke profiler, store kamper og lokal tilhørighet.</p><p>Klubben skal være en tydelig møteplass for spillere, supportere, frivillige og samarbeidspartnere.</p></article>';
    echo '<article class="content-card club-links"><h3>Utforsk klubben</h3><a href="' . esc_url(storm_arena_get_page_url_by_slug('spillere-trenere', home_url('/#laget'))) . '">Spillere og trenerteam <span>→</span></a><a href="' . esc_url(storm_arena_get_page_url_by_slug('grasrotandelen', home_url('/'))) . '">Grasrotandelen <span>→</span></a><a href="' . esc_url(storm_arena_get_page_url_by_slug('klubbavis', home_url('/'))) . '">StormVarsel klubbavis <span>→</span></a><a href="' . esc_url(storm_arena_get_page_url_by_slug('terminlister-tidligere-sesonger', home_url('/'))) . '">Historiske terminlister <span>→</span></a></article>';
    echo '</div>';
    echo '<div class="section-head archive-heading"><div><div class="section-label"><span>02</span><strong>Klubbarkiv</strong></div><h2>Finn historiene</h2></div></div>';
    echo '<div class="content-grid content-grid--narrow">';
    echo '<article class="content-card"><h3>Søk i arkivet</h3>';
    get_search_form();
    echo '</article>';
    echo '<article class="content-card"><h3>Månedsarkiv</h3><ul class="archive-list">';
    wp_get_archives(array('type' => 'monthly', 'show_post_count' => true));
    echo '</ul></article>';
    echo '</div>';

    $posts = new WP_Query(
        array(
            'post_type'           => 'post',
            'post_status'         => 'publish',
            'posts_per_page'      => 10,
            'ignore_sticky_posts' => true,
        )
    );

    if ($posts->have_posts()) {
        echo '<div class="story-list">';
        $index = 0;
        while ($posts->have_posts()) {
            $posts->the_post();
            echo '<article class="story story--list">';
            storm_arena_render_post_image(get_the_ID(), $index, 'story__thumb');
            echo '<div><time datetime="' . esc_attr(get_the_date(DATE_ATOM)) . '">' . esc_html(get_the_date('j. F Y')) . '</time><h3><a href="' . esc_url(get_permalink()) . '">' . esc_html(get_the_title()) . '</a></h3><p>' . esc_html(wp_trim_words(wp_strip_all_tags(get_the_excerpt() ?: get_the_content(null, false)), 28)) . '</p></div></article>';
            $index++;
        }
        echo '</div>';
        wp_reset_postdata();
    }

    echo '</section>';
}

function storm_arena_render_arrangement_page(): void
{
    $profiles = storm_arena_get_arrangement_profiles();

    echo '<section class="content-section"><div class="section-head"><div><div class="section-label"><span>01</span><strong>Kampdag</strong></div><h2>Arrangementsteam</h2></div></div>';
    if (empty($profiles)) {
        storm_arena_render_empty_state('Arrangementsteamet er ikke publisert.', 'Oppdaterte profiler kommer senere.');
    } else {
        echo '<div class="content-grid">';
        foreach ($profiles as $profile) {
            echo '<article class="profile-card">';
            storm_arena_render_named_image_or_placeholder($profile['photo_url'], $profile['name'], 'profile-card__image');
            echo '<div class="profile-card__copy"><h3>' . esc_html($profile['name']) . '</h3><ul class="stats-list">';
            if ($profile['age'] !== '') {
                echo '<li><strong>Alder</strong><span>' . esc_html($profile['age']) . '</span></li>';
            }
            if ($profile['storm_role'] !== '') {
                echo '<li><strong>Storm</strong><span>' . esc_html($profile['storm_role']) . '</span></li>';
            }
            if ($profile['occupation'] !== '') {
                echo '<li><strong>Jobb</strong><span>' . esc_html($profile['occupation']) . '</span></li>';
            }
            echo '</ul>';
            if ($profile['description'] !== '') {
                echo '<p>' . wp_kses_post($profile['description']) . '</p>';
            }
            echo '</div></article>';
        }
        echo '</div>';
    }
    echo '</section>';
}

function storm_arena_render_board_page(): void
{
    $profiles = storm_arena_get_board_profiles();

    echo '<section class="content-section"><div class="section-head"><div><div class="section-label"><span>01</span><strong>Klubben</strong></div><h2>Styret og administrasjonen</h2></div></div>';
    if (empty($profiles)) {
        storm_arena_render_empty_state('Styret er ikke publisert.', 'Oppdatert informasjon kommer snart.');
    } else {
        echo '<div class="content-grid">';
        foreach ($profiles as $profile) {
            echo '<article class="profile-card">';
            storm_arena_render_named_image_or_placeholder($profile['photo_url'], $profile['name'], 'profile-card__image');
            echo '<div class="profile-card__copy"><span class="eyebrow">' . esc_html($profile['role']) . '</span><h3>' . esc_html($profile['name']) . '</h3>';
            if ($profile['description'] !== '') {
                echo '<div class="prose">' . wp_kses_post(wpautop($profile['description'])) . '</div>';
            }
            echo '</div></article>';
        }
        echo '</div>';
    }
    echo '</section>';
}

function storm_arena_render_ifokus_page(): void
{
    $entries = storm_arena_get_ifokus_entries();

    echo '<section class="content-section"><div class="section-head"><div><div class="section-label"><span>01</span><strong>iFokus</strong></div><h2>Arrangementshistorikk</h2></div></div>';
    if (empty($entries)) {
        storm_arena_render_empty_state('iFokus-arkivet er tomt.', 'Arrangementene kan legges inn igjen når kildedata er klare.');
    } else {
        foreach ($entries as $entry) {
            echo '<article class="content-card prose">';
            if ($entry['year'] !== '') {
                echo '<span class="eyebrow">' . esc_html($entry['year']) . '</span>';
            }
            echo wp_kses_post($entry['content']);
            echo '</article>';
        }
    }
    echo '</section>';
}
