<?php

require_once get_template_directory() . '/inc/data.php';
require_once get_template_directory() . '/inc/legacy-pages.php';

function storm_arena_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        )
    );
    add_theme_support('custom-logo', array('height' => 108, 'width' => 180, 'flex-height' => true, 'flex-width' => true));
    add_theme_support('responsive-embeds');

    register_nav_menus(
        array(
            'primary-menu'   => __('Primary menu', 'storm-arena'),
            'secondary-menu' => __('Footer menu', 'storm-arena'),
        )
    );
}
add_action('after_setup_theme', 'storm_arena_setup');

function storm_arena_sanitize_live_status(string $status): string
{
    $allowed = array('inactive', 'pre', 'live', 'finished', 'postponed');

    return in_array($status, $allowed, true) ? $status : 'inactive';
}

function storm_arena_customize_register(WP_Customize_Manager $customizer): void
{
    $customizer->add_section(
        'storm_matchday',
        array(
            'title'       => 'Kampdag',
            'description' => 'Aktiver kampstatus først når status og mål-lenke er verifisert.',
            'priority'    => 35,
        )
    );

    $customizer->add_setting(
        'storm_live_status',
        array(
            'default'           => 'inactive',
            'sanitize_callback' => 'storm_arena_sanitize_live_status',
        )
    );
    $customizer->add_control(
        'storm_live_status',
        array(
            'section' => 'storm_matchday',
            'label'   => 'Kampstatus',
            'type'    => 'select',
            'choices' => array(
                'inactive'  => 'Ikke aktiv',
                'pre'       => 'Starter snart',
                'live'      => 'Live nå',
                'finished'  => 'Ferdig',
                'postponed' => 'Utsatt eller avlyst',
            ),
        )
    );

    $customizer->add_setting(
        'storm_live_url',
        array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        )
    );
    $customizer->add_control(
        'storm_live_url',
        array(
            'section'     => 'storm_matchday',
            'label'       => 'Verifisert strøm- eller kampsenterlenke',
            'type'        => 'url',
            'input_attrs' => array('placeholder' => 'https://'),
        )
    );

    $customizer->add_setting(
        'storm_live_match',
        array(
            'default'           => '',
            'sanitize_callback' => 'sanitize_text_field',
        )
    );
    $customizer->add_control(
        'storm_live_match',
        array(
            'section'     => 'storm_matchday',
            'label'       => 'Kamptekst',
            'description' => 'Eksempel: Tromsø Storm – Frøya Basket',
            'type'        => 'text',
        )
    );
}
add_action('customize_register', 'storm_arena_customize_register');

function storm_arena_render_live_game_banner(): void
{
    $status = storm_arena_sanitize_live_status((string) get_theme_mod('storm_live_status', 'inactive'));
    $url = esc_url_raw((string) get_theme_mod('storm_live_url', ''));
    if ($status === 'inactive' || $url === '' || !wp_http_validate_url($url)) {
        return;
    }

    $english = storm_arena_get_language() === 'en';
    $labels = array(
        'pre'       => $english ? 'Game starts soon' : 'Kampen starter snart',
        'live'      => $english ? 'LIVE NOW' : 'LIVE NÅ',
        'finished'  => $english ? 'Game finished' : 'Kampen er ferdig',
        'postponed' => $english ? 'Game postponed or cancelled' : 'Kampen er utsatt eller avlyst',
    );
    $action = $english ? 'Open game centre' : 'Åpne kampsenter';
    $match = trim((string) get_theme_mod('storm_live_match', ''));

    echo '<aside class="live-game-banner live-game-banner--' . esc_attr($status) . '" aria-label="' . esc_attr($labels[$status]) . '">';
    echo '<a href="' . esc_url($url) . '" rel="noopener noreferrer" target="_blank">';
    echo '<strong>' . esc_html($labels[$status]) . '</strong>';
    if ($match !== '') {
        echo '<span>' . esc_html($match) . '</span>';
    }
    echo '<span>' . esc_html($action) . ' →</span>';
    echo '</a></aside>';
}

function storm_arena_register_sidebars(): void
{
    $sidebars = array(
        array(
            'name'          => 'Left sidebar',
            'id'            => 'sidebar-1',
            'description'   => 'Legacy support content shown on internal pages.',
            'before_widget' => '<section class="widget-card widget-card--legacy %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Right sidebar',
            'id'            => 'sidebar-2',
            'description'   => 'Legacy support content shown on internal pages.',
            'before_widget' => '<section class="widget-card widget-card--legacy %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Middle sidebar #1',
            'id'            => 'sidebar-3',
            'description'   => 'Legacy homepage support slot.',
            'before_widget' => '<section class="widget-card %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Middle sidebar #2',
            'id'            => 'sidebar-4',
            'description'   => 'Legacy homepage support slot.',
            'before_widget' => '<section class="widget-card %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Middle sidebar #3',
            'id'            => 'sidebar-5',
            'description'   => 'Legacy homepage support slot.',
            'before_widget' => '<section class="widget-card %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Footer left',
            'id'            => 'sidebar-6',
            'description'   => 'Footer column 1.',
            'before_widget' => '<section class="footer-widget %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Footer middle',
            'id'            => 'sidebar-7',
            'description'   => 'Footer column 2.',
            'before_widget' => '<section class="footer-widget %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Footer right',
            'id'            => 'sidebar-8',
            'description'   => 'Footer column 3.',
            'before_widget' => '<section class="footer-widget %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Footer bottom',
            'id'            => 'sidebar-9',
            'description'   => 'Footer strip below the main footer.',
            'before_widget' => '<section class="footer-widget footer-widget--bottom %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Headerbox1',
            'id'            => 'sidebar-10',
            'description'   => 'Legacy utility row above the header.',
            'before_widget' => '<section class="header-widget %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
        array(
            'name'          => 'Headerbox2',
            'id'            => 'sidebar-11',
            'description'   => 'Legacy utility row inside the header.',
            'before_widget' => '<section class="header-widget %2$s" id="%1$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ),
    );

    foreach ($sidebars as $sidebar) {
        register_sidebar($sidebar);
    }
}
add_action('widgets_init', 'storm_arena_register_sidebars');

function storm_arena_get_active_design(): string
{
    if (isset($_GET['design'])) {
        $design = sanitize_key($_GET['design']);
        if ($design === 'classic' || $design === 'new') {
            if (!headers_sent()) {
                setcookie('storm_design', $design, time() + 30 * DAY_IN_SECONDS, '/');
            }
            return $design;
        }
    }
    if (isset($_COOKIE['storm_design'])) {
        $design = sanitize_key($_COOKIE['storm_design']);
        if ($design === 'classic' || $design === 'new') {
            return $design;
        }
    }
    return get_option('storm_active_design', 'new');
}

function storm_arena_enqueue_assets(): void
{
    $theme   = wp_get_theme();
    $version = $theme->get('Version') ?: null;

    if (storm_arena_get_active_design() === 'new') {
        wp_enqueue_style(
            'storm-google-fonts',
            'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap',
            array(),
            null
        );
        wp_enqueue_style('storm-arena-style', get_stylesheet_uri(), array(), $version);
        wp_enqueue_style(
            'storm-new-design-style',
            get_template_directory_uri() . '/assets/storm-new-design.css',
            array('storm-arena-style'),
            time()
        );
    } else {
        wp_enqueue_style('storm-arena-style', get_stylesheet_uri(), array(), $version);
    }

    wp_enqueue_script(
        'storm-arena-script',
        get_template_directory_uri() . '/assets/theme.js',
        array(),
        $version,
        true
    );
    wp_add_inline_script(
        'storm-arena-script',
        'window.stormArenaConfig = ' . wp_json_encode(
            array(
                'serviceWorkerUrl' => home_url('/sw.js'),
                'serviceWorkerScope' => trailingslashit((string) wp_parse_url(home_url('/'), PHP_URL_PATH)),
            )
        ) . ';',
        'before'
    );
}
add_action('wp_enqueue_scripts', 'storm_arena_enqueue_assets');

function storm_arena_render_pwa_metadata(): void
{
    echo '<meta name="theme-color" content="#0c0e12">' . "\n";
    echo '<meta name="apple-mobile-web-app-capable" content="yes">' . "\n";
    echo '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">' . "\n";
    echo '<meta name="apple-mobile-web-app-title" content="Tromsø Storm">' . "\n";
    echo '<link rel="manifest" href="' . esc_url(home_url('/manifest.webmanifest')) . '">' . "\n";
    echo '<link rel="apple-touch-icon" href="' . esc_url(storm_arena_asset_url('assets/icons/storm-192.png')) . '">' . "\n";
}
add_action('wp_head', 'storm_arena_render_pwa_metadata', 2);

function storm_arena_serve_pwa_file(): void
{
    $request_path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    $home_path = trailingslashit((string) wp_parse_url(home_url('/'), PHP_URL_PATH));
    $relative_path = '/' . ltrim(substr($request_path, strlen(rtrim($home_path, '/'))), '/');

    if ($relative_path === '/manifest.webmanifest') {
        $base_path = $home_path === '//' ? '/' : $home_path;
        nocache_headers();
        header('Content-Type: application/manifest+json; charset=utf-8');
        echo wp_json_encode(
            array(
                'name' => 'Tromsø Storm',
                'short_name' => 'Storm',
                'description' => 'Kamper, resultater, tabell, spillere, nyheter og billetter for Tromsø Storm.',
                'start_url' => $base_path,
                'scope' => $base_path,
                'display' => 'standalone',
                'background_color' => '#0c0e12',
                'theme_color' => '#0c0e12',
                'lang' => 'nb-NO',
                'icons' => array(
                    array(
                        'src' => storm_arena_asset_url('assets/icons/storm-192.png'),
                        'sizes' => '192x192',
                        'type' => 'image/png',
                        'purpose' => 'any',
                    ),
                    array(
                        'src' => storm_arena_asset_url('assets/icons/storm-512.png'),
                        'sizes' => '512x512',
                        'type' => 'image/png',
                        'purpose' => 'any maskable',
                    ),
                ),
            ),
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );
        exit;
    }

    if ($relative_path === '/sw.js') {
        $base_path = $home_path === '//' ? '/' : $home_path;
        $assets = array(
            $base_path,
            $base_path . 'en/',
            $base_path . 'manifest.webmanifest',
            storm_arena_asset_url('style.css'),
            storm_arena_asset_url('assets/theme.js'),
            storm_arena_asset_url('assets/storm-logo.png'),
            storm_arena_asset_url('assets/icons/storm-192.png'),
            storm_arena_asset_url('assets/icons/storm-512.png'),
        );

        nocache_headers();
        header('Content-Type: application/javascript; charset=utf-8');
        header('Service-Worker-Allowed: ' . $base_path);
        echo "const CACHE_NAME = 'storm-site-v2';\n";
        echo 'const APP_SHELL = ' . wp_json_encode($assets, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ";\n";
        echo <<<'JS'
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
    self.skipWaiting();
});
self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )));
    self.clients.claim();
});
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                }
                return response;
            })
            .catch(async () => {
                const cached = await caches.match(event.request);
                if (cached) {
                    return cached;
                }
                if (event.request.mode === 'navigate') {
                    return caches.match(APP_SHELL[0]);
                }
                return Response.error();
            })
    );
});
JS;
        exit;
    }
}
add_action('template_redirect', 'storm_arena_serve_pwa_file', 0);

function storm_arena_escape_ics_value(string $value): string
{
    return str_replace(
        array('\\', ';', ',', "\r\n", "\r", "\n"),
        array('\\\\', '\;', '\,', '\n', '\n', '\n'),
        trim($value)
    );
}

function storm_arena_fold_ics_line(string $line): string
{
    if (strlen($line) <= 75) {
        return $line;
    }

    $folded = array();
    $remaining = $line;
    $limit = 75;

    while ($remaining !== '') {
        $part = mb_strcut($remaining, 0, $limit, 'UTF-8');
        if ($part === '') {
            break;
        }

        $folded[] = $part;
        $remaining = (string) substr($remaining, strlen($part));
        $limit = 74;
    }

    return implode("\r\n ", $folded);
}

function storm_arena_render_schedule_calendar(bool $english = false): string
{
    $matches = storm_arena_get_schedule_entries('storm-current-fixtures');
    $generated_at = gmdate('Ymd\THis\Z');
    $calendar_url = $english ? home_url('/en/storm-games.ics') : home_url('/storm-kamper.ics');
    $fixtures_url = $english ? home_url('/en/kampoversikt/') : home_url('/kampoversikt/');
    $season = storm_arena_get_current_season_label();

    $lines = array(
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Tromso Storm//Season schedule//NO',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:' . storm_arena_escape_ics_value($english ? "Tromsø Storm games $season" : "Tromsø Storm-kamper $season"),
        'X-WR-CALDESC:' . storm_arena_escape_ics_value($english ? 'Tromsø Storm season schedule. Verify late changes on the club website.' : 'Tromsø Storms terminliste. Kontroller sene endringer på klubbens nettside.'),
        'X-WR-TIMEZONE:Europe/Oslo',
        'URL:' . $calendar_url,
        'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
        'X-PUBLISHED-TTL:PT6H',
    );

    foreach ($matches as $match) {
        if (!$match['date'] instanceof DateTimeInterface) {
            continue;
        }

        $start = DateTimeImmutable::createFromInterface($match['date'])->setTimezone(new DateTimeZone('UTC'));
        $end = $start->modify('+2 hours');
        $summary = $match['home'] . ' – ' . $match['away'];
        $event_url = $match['stats_url'] !== '' ? $match['stats_url'] : $fixtures_url;
        $uid_source = implode('|', array($match['timestamp'], $match['home'], $match['away']));
        $description = $english
            ? 'Tromsø Storm game. Check the website for tickets, streaming and late schedule changes.'
            : 'Tromsø Storm-kamp. Se nettsiden for billetter, strømming og sene terminendringer.';

        $lines[] = 'BEGIN:VEVENT';
        $lines[] = 'UID:' . hash('sha256', $uid_source) . '@tromsostorm.no';
        $lines[] = 'DTSTAMP:' . $generated_at;
        $lines[] = 'DTSTART:' . $start->format('Ymd\THis\Z');
        $lines[] = 'DTEND:' . $end->format('Ymd\THis\Z');
        $lines[] = 'SUMMARY:' . storm_arena_escape_ics_value($summary);
        $lines[] = 'DESCRIPTION:' . storm_arena_escape_ics_value($description);
        if ($match['venue'] !== '') {
            $lines[] = 'LOCATION:' . storm_arena_escape_ics_value($match['venue']);
        }
        $lines[] = 'URL:' . $event_url;
        $lines[] = 'END:VEVENT';
    }

    $lines[] = 'END:VCALENDAR';

    return implode("\r\n", array_map('storm_arena_fold_ics_line', $lines)) . "\r\n";
}

function storm_arena_serve_schedule_calendar(): void
{
    $request_path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    $home_path = rtrim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');
    $relative_path = '/' . ltrim(substr($request_path, strlen($home_path)), '/');
    $english = $relative_path === '/en/storm-games.ics';

    if ($relative_path !== '/storm-kamper.ics' && !$english) {
        return;
    }

    nocache_headers();
    status_header(200);
    header('Content-Type: text/calendar; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . ($english ? 'tromso-storm-games.ics' : 'tromso-storm-kamper.ics') . '"');
    echo storm_arena_render_schedule_calendar($english);
    exit;
}
add_action('template_redirect', 'storm_arena_serve_schedule_calendar', 0);

add_filter('language_attributes', function ($output) {
    $request_path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    if (str_starts_with($request_path, '/en/') || $request_path === '/en') {
        return 'lang="en"';
    }
    return 'lang="nb-NO"';
});

add_filter('pre_get_document_title', function ($title) {
    $request_path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    if ($request_path === '/en' || $request_path === '/en/') {
        return 'Tromsø Storm – A Storm from the North';
    }
    return $title;
}, 20);

function storm_arena_serve_static_english_page(): void
{
    $request_path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    $home_path = rtrim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');
    $relative_path = '/' . ltrim(substr($request_path, strlen($home_path)), '/');

    if ($relative_path !== '/en' && !str_starts_with($relative_path, '/en/')) {
        return;
    }

    $english_path = trim(substr($relative_path, 3), '/');
    if ($english_path !== '' && !preg_match('/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/', $english_path)) {
        return;
    }

    // Support new design on English homepage (/en or /en/)
    if ($english_path === '' && function_exists('storm_arena_get_active_design') && storm_arena_get_active_design() !== 'classic') {
        global $wp_query;
        if ($wp_query instanceof WP_Query) {
            $wp_query->is_404 = false;
            $wp_query->is_home = true;
            $wp_query->is_front_page = true;
        }
        status_header(200);
        include get_template_directory() . '/front-page-new.php';
        exit;
    }

    $relative_file = $english_path === '' ? 'index.html' : $english_path . '/index.html';
    $file_path = get_template_directory() . '/en-static/' . $relative_file;

    if (!is_file($file_path)) {
        return;
    }

    status_header(200);
    header('Content-Type: text/html; charset=utf-8');
    readfile($file_path);
    exit;
}
add_action('template_redirect', 'storm_arena_serve_static_english_page', 1);

function storm_arena_render_virtual_core_page(): void
{
    $request_path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    $home_path = rtrim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');
    $relative_path = '/' . ltrim(substr($request_path, strlen($home_path)), '/');

    if ($relative_path !== '/sesongkort/' && $relative_path !== '/sesongkort') {
        return;
    }

    $existing_page = get_page_by_path('sesongkort');
    if ($existing_page instanceof WP_Post) {
        return;
    }

    status_header(200);
    include get_template_directory() . '/page-sesongkort.php';
    exit;
}
add_action('template_redirect', 'storm_arena_render_virtual_core_page', 1);

function storm_arena_body_classes(array $classes): array
{
    if (is_front_page() && !is_paged()) {
        $classes[] = 'storm-front-page';
    }

    if (is_singular()) {
        $classes[] = 'storm-singular';
    }

    return $classes;
}
add_filter('body_class', 'storm_arena_body_classes');

function storm_arena_register_flat_page_rewrites(): void
{
    $pages = get_posts(
        array(
            'post_type'              => 'page',
            'post_status'            => 'publish',
            'posts_per_page'         => -1,
            'fields'                 => 'ids',
            'no_found_rows'          => true,
            'update_post_meta_cache' => false,
            'update_post_term_cache' => false,
        )
    );

    foreach ($pages as $page_id) {
        $slug = get_post_field('post_name', $page_id);
        if (!is_string($slug) || $slug === '') {
            continue;
        }

        add_rewrite_rule(
            '^' . preg_quote($slug, '#') . '/?$',
            'index.php?page_id=' . (int) $page_id,
            'top'
        );
    }
}
add_action('init', 'storm_arena_register_flat_page_rewrites', 9);

function storm_arena_invalidate_flat_page_rewrites(int $post_id, WP_Post $post, bool $update = false, ?WP_Post $before = null): void
{
    if ($post->post_type !== 'page'
        || ($post->post_status !== 'publish' && (!$before || $before->post_status !== 'publish'))) {
        return;
    }
    if ($before && $before->post_status === $post->post_status && $before->post_name === $post->post_name) {
        return;
    }

    // Rebuild on the next request, after init has registered the new flat page URLs.
    delete_option('rewrite_rules');
}
add_action('wp_after_insert_post', 'storm_arena_invalidate_flat_page_rewrites', 10, 4);
add_action('deleted_post', 'storm_arena_invalidate_flat_page_rewrites', 10, 2);

function storm_arena_flat_page_link(string $url, int $post_id): string
{
    $post = get_post($post_id);
    if (!$post instanceof WP_Post || $post->post_type !== 'page' || $post->post_status !== 'publish') {
        return $url;
    }

    return home_url(user_trailingslashit($post->post_name, 'page'));
}
add_filter('page_link', 'storm_arena_flat_page_link', 10, 2);

function storm_arena_rewrite_legacy_host_urls(string $content): string
{
    if ($content === '' || (current_filter() === 'the_content'
        && get_post_meta(get_the_ID(), '_storm_refresh_kind', true) === 'news-summary-draft')) {
        return $content;
    }

    $local_base   = untrailingslashit(home_url('/'));
    $replacements = array(
        'https://www.tromsostorm.no' => $local_base,
        'http://www.tromsostorm.no'  => $local_base,
        'https://tromsostorm.no'     => $local_base,
        'http://tromsostorm.no'      => $local_base,
    );

    return str_replace(array_keys($replacements), array_values($replacements), $content);
}
add_filter('the_content', 'storm_arena_rewrite_legacy_host_urls', 5);
add_filter('the_excerpt', 'storm_arena_rewrite_legacy_host_urls', 5);
add_filter('widget_text_content', 'storm_arena_rewrite_legacy_host_urls', 5);

function storm_arena_repair_mojibake(string $text): string
{
    if ($text === '') {
        return $text;
    }

    for ($pass = 0; $pass < 3; $pass++) {
        $repaired = preg_replace_callback(
            '/(?:Ã.|Â.|â..)+/u',
            static function (array $matches): string {
                $candidate = mb_convert_encoding($matches[0], 'Windows-1252', 'UTF-8');

                return mb_check_encoding($candidate, 'UTF-8') ? $candidate : $matches[0];
            },
            $text
        );

        if (!is_string($repaired) || $repaired === $text) {
            break;
        }

        $text = $repaired;
    }

    return $text;
}

add_filter('the_title', 'storm_arena_repair_mojibake', 5);
add_filter('the_content', 'storm_arena_repair_mojibake', 6);
add_filter('the_excerpt', 'storm_arena_repair_mojibake', 6);
add_filter('widget_text_content', 'storm_arena_repair_mojibake', 6);
add_filter(
    'get_the_categories',
    static function (array $categories): array {
        return array_map(
            static function (WP_Term $category): WP_Term {
                $category = clone $category;
                $category->name = storm_arena_repair_mojibake($category->name);
                return $category;
            },
            $categories
        );
    },
    5
);
add_filter(
    'document_title_parts',
    static function (array $parts): array {
        foreach ($parts as $key => $part) {
            if (is_string($part)) {
                $parts[$key] = storm_arena_repair_mojibake($part);
            }
        }

        return $parts;
    },
    5
);

function storm_arena_get_language(): string
{
    $requested = isset($_GET['lang']) ? sanitize_key(wp_unslash($_GET['lang'])) : '';
    $request_path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    $home_path = rtrim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');
    $relative_path = '/' . ltrim(substr($request_path, strlen($home_path)), '/');

    return $requested === 'en' || $relative_path === '/en' || str_starts_with($relative_path, '/en/')
        ? 'en'
        : 'no';
}

function storm_arena_get_language_url(string $language): string
{
    $language = $language === 'en' ? 'en' : 'no';
    $request_path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    $home_path = rtrim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');
    $relative_path = '/' . ltrim(substr($request_path, strlen($home_path)), '/');
    $relative_path = preg_replace('#^/en(?=/|$)#', '', $relative_path) ?: '/';

    return $language === 'en'
        ? home_url('/en' . ($relative_path === '/' ? '/' : $relative_path))
        : home_url($relative_path);
}

function storm_arena_language_attributes(string $output): string
{
    if (storm_arena_get_language() !== 'en') {
        return $output;
    }

    return preg_replace('/lang=(["\']).*?\1/i', 'lang="en"', $output) ?: 'lang="en"';
}
add_filter('language_attributes', 'storm_arena_language_attributes');

function storm_arena_render_language_switcher(): void
{
    $language = storm_arena_get_language();

    echo '<nav class="language-switcher notranslate" aria-label="Velg språk" translate="no">';
    echo '<a href="' . esc_url(storm_arena_get_language_url('no')) . '"' . ($language === 'no' ? ' aria-current="page"' : '') . '>NO</a>';
    echo '<a href="' . esc_url(storm_arena_get_language_url('en')) . '"' . ($language === 'en' ? ' aria-current="page"' : '') . '>EN</a>';
    echo '</nav>';
}

function storm_arena_normalize_navigation_links(array $items, stdClass $args): array
{
    foreach ($items as $item) {
        $label = remove_accents(mb_strtolower(wp_strip_all_tags((string) $item->title)));
        $url = (string) $item->url;

        if ($label === 'arena' || str_contains($url, '/besok-arenaen/')) {
            $item->url = storm_arena_get_page_url_by_slug('besok-arenaen', home_url('/besok-arenaen/'));
        }
    }

    return $items;
}
add_filter('wp_nav_menu_objects', 'storm_arena_normalize_navigation_links', 10, 2);

function storm_arena_translation_notice(string $html, string $message): string
{
    $notice = '<div class="translation-notice notranslate" role="status" translate="no">' . esc_html($message) . '</div>';

    return preg_replace('/(<body\b[^>]*>)/i', '$1' . $notice, $html, 1) ?: $notice . $html;
}

function storm_arena_translate_text_batch(array $texts): array
{
    $api_key = trim((string) getenv('OPENAI_API_KEY'));
    if ($api_key === '') {
        return new WP_Error('storm_translation_not_configured', 'English translation is not configured yet.');
    }

    $items = array();
    foreach ($texts as $index => $text) {
        $items[] = array('id' => (string) $index, 'text' => $text);
    }

    $response = wp_remote_post(
        'https://api.openai.com/v1/chat/completions',
        array(
            'timeout' => 60,
            'headers' => array(
                'Authorization' => 'Bearer ' . $api_key,
                'Content-Type'  => 'application/json',
            ),
            'body'    => wp_json_encode(
                array(
                    'model'    => trim((string) getenv('STORM_TRANSLATION_MODEL')) ?: 'gpt-5-mini',
                    'messages' => array(
                        array(
                            'role'    => 'system',
                            'content' => 'Translate the Norwegian website strings in the supplied JSON array into natural English. Preserve names, brands, URLs, numbers and basketball terminology. Return only one JSON object whose keys are the supplied ids and whose values are translations.',
                        ),
                        array(
                            'role'    => 'user',
                            'content' => wp_json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                        ),
                    ),
                ),
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            ),
        )
    );

    if (is_wp_error($response)) {
        return $response;
    }

    if (wp_remote_retrieve_response_code($response) !== 200) {
        return new WP_Error('storm_translation_api_error', 'The translation service returned an error.');
    }

    $payload = json_decode(wp_remote_retrieve_body($response), true);
    $content = trim((string) ($payload['choices'][0]['message']['content'] ?? ''));
    $content = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $content) ?: $content;
    $decoded = json_decode($content, true);

    if (!is_array($decoded)) {
        return new WP_Error('storm_translation_invalid_response', 'The translation service returned an invalid response.');
    }

    $translations = array();
    foreach ($texts as $index => $text) {
        $translated = $decoded[(string) $index] ?? null;
        if (!is_string($translated) || trim($translated) === '') {
            return new WP_Error('storm_translation_incomplete_response', 'The translation service returned an incomplete response.');
        }
        $translations[$text] = trim($translated);
    }

    return $translations;
}

function storm_arena_translate_html_to_english(string $html): string
{
    if (trim($html) === '' || !class_exists('DOMDocument')) {
        return storm_arena_translation_notice($html, 'English translation could not be loaded.');
    }

    $api_key = trim((string) getenv('OPENAI_API_KEY'));
    if ($api_key === '') {
        return storm_arena_translation_notice($html, 'English translation is not configured yet. Showing the Norwegian original.');
    }

    $document = new DOMDocument();
    $previous = libxml_use_internal_errors(true);
    $loaded   = $document->loadHTML(
        '<?xml encoding="utf-8" ?>' . $html,
        LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
    );
    libxml_clear_errors();
    libxml_use_internal_errors($previous);

    if (!$loaded) {
        return storm_arena_translation_notice($html, 'English translation could not be loaded.');
    }

    $xpath = new DOMXPath($document);
    $nodes = $xpath->query(
        '//text()[normalize-space(.) != "" and not(ancestor::script) and not(ancestor::style) and not(ancestor::svg) and not(ancestor::code) and not(ancestor::pre) and not(ancestor::textarea) and not(ancestor::*[contains(concat(" ", normalize-space(@class), " "), " notranslate ")]) and not(ancestor::*[@translate="no"])]'
    );

    if ($nodes === false) {
        return storm_arena_translation_notice($html, 'English translation could not be loaded.');
    }

    $text_nodes  = array();
    $unique_text = array();
    foreach ($nodes as $node) {
        $text = trim($node->nodeValue);
        if (mb_strlen($text) < 2 || mb_strlen($text) > 800 || !preg_match('/\p{L}/u', $text)) {
            continue;
        }

        $text_nodes[]       = array('node' => $node, 'text' => $text);
        $unique_text[$text] = $text;
    }

    $translations = array();
    $pending       = array();
    foreach ($unique_text as $text) {
        $cache_key = 'storm_translation_en_' . md5($text);
        $cached    = get_transient($cache_key);
        if (is_string($cached) && $cached !== '') {
            $translations[$text] = $cached;
        } else {
            $pending[] = $text;
        }
    }

    foreach (array_chunk($pending, 35) as $chunk) {
        $translated = storm_arena_translate_text_batch($chunk);
        if (is_wp_error($translated)) {
            return storm_arena_translation_notice($html, 'English translation is temporarily unavailable. Showing the Norwegian original.');
        }

        foreach ($translated as $source => $target) {
            $translations[$source] = $target;
            set_transient('storm_translation_en_' . md5($source), $target, 90 * DAY_IN_SECONDS);
        }
    }

    foreach ($text_nodes as $item) {
        $source = $item['text'];
        if (!isset($translations[$source])) {
            continue;
        }

        $original = $item['node']->nodeValue;
        $leading  = preg_match('/^\s+/u', $original, $matches) ? $matches[0] : '';
        $trailing = preg_match('/\s+$/u', $original, $matches) ? $matches[0] : '';
        $item['node']->nodeValue = $leading . $translations[$source] . $trailing;
    }

    $links = $xpath->query('//a[@href]');
    if ($links !== false) {
        $home_host = wp_parse_url(home_url('/'), PHP_URL_HOST);
        foreach ($links as $link) {
            $href = $link->getAttribute('href');
            if ($href === '' || str_starts_with($href, '#') || str_starts_with($href, 'mailto:') || str_starts_with($href, 'tel:')) {
                continue;
            }

            $absolute = storm_arena_normalize_url($href);
            $host     = wp_parse_url($absolute, PHP_URL_HOST);
            if ($absolute !== '' && ($host === null || $host === $home_host)) {
                $link->setAttribute('href', add_query_arg('lang', 'en', $absolute));
            }
        }
    }

    $translated_html = $document->saveHTML();

    return is_string($translated_html)
        ? preg_replace('/^<\?xml encoding="utf-8" \?>/i', '', $translated_html) ?? $translated_html
        : $html;
}

function storm_arena_start_translation_buffer(): void
{
    if (
        storm_arena_get_language() !== 'en'
        || is_admin()
        || wp_doing_ajax()
        || wp_is_json_request()
        || is_feed()
        || is_robots()
    ) {
        return;
    }

    ob_start('storm_arena_translate_html_to_english');
}
add_action('template_redirect', 'storm_arena_start_translation_buffer');

function storm_arena_render_default_nav_items(): void
{
    $items = array(
        array(
            'label' => 'Nyheter',
            'url'   => home_url('/#nyheter'),
        ),
        array(
            'label' => 'Kamper',
            'url'   => storm_arena_get_page_url_by_slug('kampoversikt', home_url('/#kamper')),
        ),
        array(
            'label' => 'Laget',
            'url'   => storm_arena_get_page_url_by_slug('spillere-trenere', home_url('/#laget')),
        ),
        array(
            'label' => 'Arena',
            'url'   => storm_arena_get_page_url_by_slug('besok-arenaen', home_url('/#neste-kamp')),
        ),
        array(
            'label' => 'Partnere',
            'url'   => storm_arena_get_page_url_by_slug('samarbeidspartnere', home_url('/#partnere')),
        ),
        array(
            'label' => 'Samfunn',
            'url'   => home_url('/#samfunn'),
        ),
        array(
            'label' => 'Om klubben',
            'url'   => storm_arena_get_page_url_by_slug('arkiv', home_url('/')),
        ),
        array(
            'label' => 'Billetter',
            'url'   => storm_arena_get_page_url_by_slug('billettpriser', home_url('/#billetter')),
            'class' => 'nav-ticket',
        ),
    );

    echo '<ul class="site-nav__list">';
    foreach ($items as $item) {
        $class = empty($item['class']) ? '' : ' class="' . esc_attr($item['class']) . '"';
        echo '<li><a' . $class . ' href="' . esc_url($item['url']) . '">' . esc_html($item['label']) . '</a></li>';
    }
    echo '</ul>';
}

function storm_arena_add_about_menu_item(string $items, stdClass $args): string
{
    if (($args->theme_location ?? '') !== 'primary-menu') {
        return $items;
    }

    $additional_items = '';
    if (!str_contains($items, '>Samfunn<')) {
        $additional_items .= '<li class="menu-item menu-item-community"><a href="' . esc_url(home_url('/#samfunn')) . '">Samfunn</a></li>';
    }
    if (!str_contains($items, '>Om klubben<')) {
        $url = storm_arena_get_page_url_by_slug('arkiv', home_url('/'));
        $additional_items .= '<li class="menu-item menu-item-about"><a href="' . esc_url($url) . '">Om klubben</a></li>';
    }
    if ($additional_items === '') {
        return $items;
    }

    $ticket_position = strpos($items, 'nav-ticket');

    if ($ticket_position === false) {
        return $items . $additional_items;
    }

    $list_item_start = strrpos(substr($items, 0, $ticket_position), '<li');
    if ($list_item_start === false) {
        return $items . $additional_items;
    }

    return substr($items, 0, $list_item_start) . $additional_items . substr($items, $list_item_start);
}
add_filter('wp_nav_menu_items', 'storm_arena_add_about_menu_item', 10, 2);

function storm_arena_render_navigation(string $location = 'primary-menu'): void
{
    if (has_nav_menu($location)) {
        wp_nav_menu(
            array(
                'theme_location' => $location,
                'container'      => false,
                'menu_class'     => 'site-nav__list',
                'fallback_cb'    => false,
                'depth'          => 2,
            )
        );
        return;
    }

    storm_arena_render_default_nav_items();
}

function storm_arena_render_utility_widgets(array $sidebar_ids, string $class_name): void
{
    $active = array_values(array_filter($sidebar_ids, 'is_active_sidebar'));
    if (empty($active)) {
        return;
    }

    echo '<div class="' . esc_attr($class_name) . '">';
    foreach ($active as $sidebar_id) {
        dynamic_sidebar($sidebar_id);
    }
    echo '</div>';
}
