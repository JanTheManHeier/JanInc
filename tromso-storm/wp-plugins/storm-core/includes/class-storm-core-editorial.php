<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Editorial
{
    public const SLOTS = array(
        'hero' => 'Forsidens overskrift, introduksjon og hovedbilde',
        'community' => 'Samfunnsseksjonen på forsiden',
        'tickets' => 'Billettseksjonen på forsiden',
        'partners' => 'Presentasjonen «Bli partner»',
        'arena' => 'Arena og praktisk informasjon på forsiden',
        'team' => 'Lagbilde og bildetekst på forsiden',
    );

    public static function register_hooks(): void
    {
        add_action('admin_menu', array(__CLASS__, 'menu'));
        add_action('admin_init', static function (): void {
            register_setting('storm_editorial', 'storm_editorial_pages', array(
                'type' => 'array', 'sanitize_callback' => array(__CLASS__, 'sanitize_pages'), 'default' => array(),
            ));
        });
        add_action('init', static function (): void {
            if (!wp_next_scheduled('storm_editorial_links')) {
                wp_schedule_event(time() + HOUR_IN_SECONDS, 'hourly', 'storm_editorial_links');
            }
        });
        add_action('storm_editorial_links', array(__CLASS__, 'check_links'));
        add_action('admin_post_storm_check_links', static function (): void {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !current_user_can('edit_others_posts')) {
                wp_die('Ingen tilgang.', '', array('response' => 403));
            }
            check_admin_referer('storm_check_links');
            self::check_links();
            wp_safe_redirect(admin_url('admin.php?page=storm-review'));
            exit;
        });
        add_filter('option_page_capability_storm_editorial', static fn(): string => 'edit_others_posts');
        add_action('add_meta_boxes', array(__CLASS__, 'boxes'));
        add_action('save_post', array(__CLASS__, 'save'), 20, 2);
        add_filter('template_include', array(__CLASS__, 'page_template'), 99);
        add_action('pre_get_posts', array(__CLASS__, 'filter_season'));
        add_filter('wp_insert_post_data', array(__CLASS__, 'guard_publication'), 20, 2);
        add_action('rest_api_init', array(__CLASS__, 'rest'));
        add_action('admin_notices', static function (): void {
            $key = 'storm_publication_notice_' . get_current_user_id();
            $error = get_transient($key);
            if ($error) {
                delete_transient($key);
                echo '<div class="notice notice-error"><p>' . esc_html((string) $error) . '</p></div>';
            }
        });
        foreach (array_keys(Storm_Core_Meta::definitions()) as $type) {
            add_filter('rest_pre_insert_' . $type, static function ($post, WP_REST_Request $request) use ($type) {
                if (is_wp_error($post) || !in_array($post->post_status ?? '', array('publish', 'future'), true)) {
                    return $post;
                }
                $values = array();
                foreach (Storm_Core_Meta::definitions()[$type] as $key => $field) {
                    $id = (int) ($post->ID ?? 0);
                    $values[$key] = $id && metadata_exists('post', $id, $key) ? get_post_meta($id, $key, true) : ($field['default'] ?? '');
                }
                $errors = Storm_Core_Fields::validate_submission($type, array_merge($values, (array) ($request['meta'] ?? array())));
                return $errors ? new WP_Error('storm_invalid', implode(' ', $errors), array('status' => 400)) : $post;
            }, 10, 2);
        }
    }

    public static function menu(): void
    {
        add_submenu_page('storm-club', 'Redaktørhåndbok', 'Redaktørhåndbok', 'edit_posts', 'storm-guide', array(__CLASS__, 'guide'));
        add_submenu_page('storm-club', 'Forsideinnhold', 'Forsideinnhold', 'edit_others_posts', 'storm-editorial', array(__CLASS__, 'settings'));
        add_submenu_page('storm-club', 'Innholdskontroll', 'Innholdskontroll', 'edit_others_posts', 'storm-review', array(__CLASS__, 'review'));
    }

    public static function sanitize_pages(mixed $values): array
    {
        $result = array();
        foreach (self::SLOTS as $key => $label) {
            $id = absint(is_array($values) ? ($values[$key] ?? 0) : 0);
            if ($id && (get_post_type($id) !== 'page' || !current_user_can('edit_post', $id))) {
                add_settings_error('storm_editorial_pages', 'storm_page', 'Du kan bare velge sider du har rett til å redigere.');
                continue;
            }
            $result[$key] = $id;
        }
        return $result;
    }

    public static function page(string $slot): ?WP_Post
    {
        $ids = (array) get_option('storm_editorial_pages', array());
        $id = absint($ids[$slot] ?? 0);
        if (!$id || !isset(self::SLOTS[$slot])) {
            return null;
        }
        $post = get_post($id);
        return $post && $post->post_type === 'page' && $post->post_status === 'publish' ? $post : null;
    }

    public static function settings(): void
    {
        if (!current_user_can('edit_others_posts')) {
            wp_die('Ingen tilgang.');
        }
        echo '<div class="wrap"><h1>Forsideinnhold</h1><p>Lag innholdet som vanlige sider med tekst og fremhevet bilde. Velg siden her. Bare publiserte sider vises; utkast påvirker ikke forsiden. Velg «Standardinnhold» for å gå tilbake til gjeldende designtekst.</p>';
        echo '<form method="post" action="options.php">';
        settings_fields('storm_editorial');
        $values = (array) get_option('storm_editorial_pages', array());
        foreach (self::SLOTS as $key => $label) {
            echo '<p><label for="storm-slot-' . esc_attr($key) . '"><strong>' . esc_html($label) . '</strong></label><br>';
            wp_dropdown_pages(array(
                'name' => 'storm_editorial_pages[' . $key . ']', 'id' => 'storm-slot-' . $key,
                'selected' => (int) ($values[$key] ?? 0), 'show_option_none' => 'Standardinnhold',
                'option_none_value' => 0, 'post_status' => array('publish', 'draft', 'pending'),
            ));
            echo '</p>';
        }
        submit_button();
        echo '</form><p>Billettpriser, arena og andre faste sider kan få redigerbart sideinnhold via «Storm: publiseringskontroll» i sideredigeringen. Endre også eventuelle prisopplysninger i forsideteksten.</p></div>';
    }

    public static function boxes(): void
    {
        foreach (array_merge(array('post', 'page'), array_keys(Storm_Core_Post_Types::definitions())) as $type) {
            add_meta_box('storm-editorial', 'Storm: publiseringskontroll', array(__CLASS__, 'box'), $type, 'normal');
        }
    }

    public static function box(WP_Post $post): void
    {
        wp_nonce_field('storm_editorial_save', 'storm_editorial_nonce');
        echo '<p><label>Innholdsansvarlig ';
        wp_dropdown_users(array('name' => 'storm_owner', 'selected' => get_post_meta($post->ID, '_storm_content_owner', true) ?: $post->post_author, 'who' => 'authors'));
        echo '</label></p>';
        foreach (array('review' => 'Kontroller innen', 'expires' => 'Utløpsdato (SOME skjules; artikler/sider beholdes og varsles)') as $key => $label) {
            echo '<p><label>' . esc_html($label) . ' <input type="date" name="storm_' . esc_attr($key) . '" value="' . esc_attr((string) get_post_meta($post->ID, '_storm_' . $key . '_on', true)) . '"></label></p>';
        }
        if ($post->post_type === 'page') {
            echo '<p><label><input type="checkbox" name="storm_page_override" value="1"' . checked((bool) get_post_meta($post->ID, '_storm_page_override', true), true, false) . '> Bruk redigert sideinnhold i stedet for standardmalen</label></p><p>Publiser tittel, tekst og bilder i den vanlige editoren. Dette erstatter hele den spesielle sidemalen; slå av igjen for å få standardvisningen tilbake. Ikke bruk dette på dynamisk terminliste eller stall.</p>';
        }
        echo '<p>Bruk «Lagre utkast» og «Forhåndsvis» før publisering. Bilder krever publiseringsrett og meningsbærende alternativtekst.</p>';
    }

    public static function save(int $id, WP_Post $post): void
    {
        if (wp_is_post_revision($id) || wp_is_post_autosave($id)
            || !isset($_POST['storm_editorial_nonce']) || !current_user_can('edit_post', $id)
            || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['storm_editorial_nonce'])), 'storm_editorial_save')) {
            return;
        }
        $owner = absint($_POST['storm_owner'] ?? $post->post_author);
        if (user_can($owner, 'edit_posts')) {
            update_post_meta($id, '_storm_content_owner', $owner);
        }
        foreach (array('review', 'expires') as $key) {
            $date = sanitize_text_field(wp_unslash($_POST['storm_' . $key] ?? ''));
            $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $date, wp_timezone());
            if ($date === '' || ($parsed && $parsed->format('Y-m-d') === $date)) {
                update_post_meta($id, '_storm_' . $key . '_on', $date);
            }
        }
        if ($post->post_type === 'page') {
            update_post_meta($id, '_storm_page_override', !empty($_POST['storm_page_override']));
        }
    }

    public static function current(int $id): bool
    {
        $expires = (string) get_post_meta($id, '_storm_expires_on', true);
        return $expires === '' || $expires >= wp_date('Y-m-d');
    }

    public static function page_template(string $template): string
    {
        if (is_singular('page') && get_post_meta(get_queried_object_id(), '_storm_page_override', true)) {
            return STORM_CORE_PATH . 'templates/editorial-page.php';
        }
        return $template;
    }

    public static function filter_season(WP_Query $query): void
    {
        if (!is_admin() || !$query->is_main_query() || empty($_GET['storm_season']) || !current_user_can('edit_storm_records')) {
            return;
        }
        $type = $query->get('post_type');
        if (in_array($type, array('storm_game', 'storm_roster_entry', 'storm_sponsor_deal', 'storm_training'), true)) {
            $query->set('meta_query', array(array('key' => 'storm_season_id', 'value' => absint($_GET['storm_season']))));
        }
    }

    public static function guard_publication(array $data, array $postarr): array
    {
        if (!in_array($data['post_status'], array('publish', 'future'), true)
            || !isset($_POST['storm_core_fields_nonce'])
            || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['storm_core_fields_nonce'])), 'storm_core_save_fields')
            || !isset(Storm_Core_Meta::definitions()[$data['post_type']])) {
            return $data;
        }
        $errors = Storm_Core_Fields::validate_submission(
            $data['post_type'], (array) wp_unslash($_POST['storm_core_meta'] ?? array())
        );
        if ($errors) {
            $data['post_status'] = 'draft';
            set_transient('storm_publication_notice_' . get_current_user_id(), 'Publisering stoppet; innholdet er utkast. ' . implode(' ', $errors), 5 * MINUTE_IN_SECONDS);
        }
        return $data;
    }

    public static function review(): void
    {
        if (!current_user_can('edit_others_posts')) {
            wp_die('Ingen tilgang.');
        }
        $posts = get_posts(array(
            'post_type' => array_merge(array('post', 'page'), array_keys(Storm_Core_Post_Types::definitions())),
            'post_status' => array('publish', 'draft', 'pending'), 'posts_per_page' => -1,
            'meta_query' => array('relation' => 'OR',
                array('key' => '_storm_review_on', 'value' => wp_date('Y-m-d'), 'compare' => '<=', 'type' => 'DATE'),
                array('key' => '_storm_expires_on', 'value' => wp_date('Y-m-d'), 'compare' => '<', 'type' => 'DATE')),
        ));
        echo '<div class="wrap"><h1>Innholdskontroll</h1><p>Kontrollfrister vurderes mot dagens dato automatisk når denne listen åpnes. Historiske artikler og sider slettes aldri automatisk.</p><ul>';
        foreach ($posts as $post) {
            if ((get_post_meta($post->ID, '_storm_review_on', true) === '' || get_post_meta($post->ID, '_storm_review_on', true) > wp_date('Y-m-d')) && self::current($post->ID)) {
                continue;
            }
            $owner = get_userdata((int) get_post_meta($post->ID, '_storm_content_owner', true));
            echo '<li><a href="' . esc_url(get_edit_post_link($post->ID)) . '">' . esc_html($post->post_title) . '</a> — ' . esc_html($owner ? $owner->display_name : 'Ansvarlig ikke valgt') . '</li>';
        }
        echo '</ul><p>Kontroller tekst, bildebruk, priser og datoer. Sett ny kontrollfrist etter gjennomgangen.</p>';
        echo '<h2>Eksterne lenker</h2><p>Fem lenker kontrolleres per kjøring, automatisk hver time når driftsjobben kjører. Kontrollen roterer gjennom de 100 sist endrede publiserte innleggene/sidene, 100 Storm-poster og valgte forsidesider. Private adresser og innlogging godtas ikke. Interne sider og eldre arkivartikler må også forhåndsvises manuelt. En lenke er ikke kontrollert før den har en kontrolldato.</p>';
        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
        wp_nonce_field('storm_check_links');
        echo '<input type="hidden" name="action" value="storm_check_links">';
        submit_button('Kontroller neste fem lenker');
        echo '</form><table class="widefat striped"><thead><tr><th>Innhold</th><th>Lenke</th><th>Svar</th><th>Kontrollert</th></tr></thead><tbody>';
        $report = (array) get_option('storm_link_report', array());
        uasort($report, static fn(array $a, array $b): int => $b['checked'] <=> $a['checked']);
        foreach (array_slice($report, 0, 30, true) as $url => $item) {
            echo '<tr><td><a href="' . esc_url(get_edit_post_link($item['post'])) . '">' . esc_html(get_the_title($item['post'])) . '</a></td><td><a href="' . esc_url($url) . '" target="_blank" rel="noopener noreferrer">' . esc_html($url) . '</a></td><td>' . esc_html($item['status'] ? 'HTTP ' . $item['status'] : 'Kunne ikke kontrolleres') . '</td><td>' . esc_html(wp_date('d.m.Y H:i', $item['checked'])) . '</td></tr>';
        }
        echo '</tbody></table><p>HTTP 2xx/3xx betyr at serveren svarer. HTTP 404/410 bør rettes. HTTP 403/405, tidsavbrudd og andre feil kan skyldes tilgang eller botfilter; åpne lenken manuelt før den fjernes. Kontrollen godkjenner ikke priser, innhold eller publiseringsrettigheter.</p></div>';
    }

    public static function check_links(): void
    {
        $ids = array();
        foreach (array(array('post', 'page'), array_keys(Storm_Core_Post_Types::definitions())) as $types) {
            $ids = array_merge($ids, get_posts(array(
                'post_type' => $types, 'post_status' => 'publish', 'posts_per_page' => 100,
                'orderby' => 'modified', 'order' => 'DESC', 'fields' => 'ids',
            )));
        }
        $ids = array_unique(array_merge($ids, array_map('absint', (array) get_option('storm_editorial_pages', array()))));
        $urls = array();
        foreach ($ids as $id) {
            $post = get_post($id);
            if (!$post || $post->post_status !== 'publish') {
                continue;
            }
            preg_match_all('/href\s*=\s*["\'](https?:\/\/[^"\']+)["\']/i', $post->post_content, $matches);
            $links = $matches[1];
            foreach (Storm_Core_Meta::definitions()[$post->post_type] ?? array() as $key => $field) {
                if ($field['type'] === 'url') {
                    $links[] = (string) get_post_meta($id, $key, true);
                }
            }
            foreach ($links as $url) {
                $url = esc_url_raw(html_entity_decode($url, ENT_QUOTES, 'UTF-8'), array('http', 'https'));
                $host = wp_parse_url($url, PHP_URL_HOST);
                if ($url && $host && $host !== wp_parse_url(home_url(), PHP_URL_HOST)
                    && !wp_parse_url($url, PHP_URL_USER) && !wp_parse_url($url, PHP_URL_PASS)) {
                    $urls[$url] = $id;
                }
            }
        }
        ksort($urls);
        $report = array_intersect_key((array) get_option('storm_link_report', array()), $urls);
        $keys = array_keys($urls);
        $cursor = (int) get_option('storm_link_cursor', 0);
        for ($i = 0; $i < min(5, count($keys)); $i++) {
            $url = $keys[($cursor + $i) % count($keys)];
            $response = wp_safe_remote_head($url, array('timeout' => 3, 'redirection' => 2));
            $report[$url] = array('post' => $urls[$url], 'status' => is_wp_error($response) ? 0 : wp_remote_retrieve_response_code($response), 'checked' => time());
        }
        update_option('storm_link_report', $report, false);
        update_option('storm_link_cursor', $keys ? ($cursor + 5) % count($keys) : 0, false);
    }

    public static function rest(): void
    {
        foreach (array('seasons', 'games', 'roster', 'staff', 'sponsors', 'training', 'social') as $name) {
            register_rest_route('storm/v1', '/' . $name, array(
                'methods' => 'GET', 'permission_callback' => '__return_true',
                'callback' => static function () use ($name): WP_REST_Response {
                    if (!Storm_Core_Content::enabled()) {
                        return new WP_REST_Response(array('code' => 'storm_content_not_activated', 'message' => 'Storm-innhold er ikke aktivert.'), 503);
                    }
                    $data = match ($name) {
                        'seasons' => array_map(static fn(WP_Post $post): array => array(
                            'id' => $post->ID, 'name' => $post->post_title, 'url' => get_permalink($post),
                            'active' => $post->ID === Storm_Core_Content::active_season(),
                        ), get_posts(array('post_type' => 'storm_season', 'post_status' => 'publish', 'posts_per_page' => -1))),
                        'roster' => Storm_Core_Content::roster('player'),
                        'games' => Storm_Core_Content::games(),
                        'staff' => Storm_Core_Content::roster('staff'),
                        'sponsors' => Storm_Core_Content::sponsors(),
                        'training' => Storm_Core_Content::training(),
                        'social' => Storm_Core_Content::social(),
                    };
                    return new WP_REST_Response($data);
                },
            ));
        }
    }

    public static function guide(): void
    {
        if (!current_user_can('edit_posts')) {
            wp_die('Ingen tilgang.');
        }
        $text = esc_html((string) file_get_contents(STORM_CORE_PATH . 'BRUKSANVISNING.md'));
        $text = preg_replace_callback('/^(#{1,3}) (.+)$/m', static fn(array $m): string =>
            '<h' . strlen($m[1]) . '>' . $m[2] . '</h' . strlen($m[1]) . '>', $text);
        $text = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $text);
        echo '<style>@media print{#adminmenumain,#wpadminbar,#wpfooter,.storm-guide button,.notice,.updated,.error,.update-nag{display:none!important}#wpcontent{margin-left:0!important}.storm-guide h1,.storm-guide h2,.storm-guide h3{break-after:avoid}.storm-guide{color:#000;background:#fff}}</style>';
        echo '<div class="wrap storm-guide" style="max-width:1000px"><p><button class="button" onclick="window.print()">Skriv ut / lagre som PDF</button></p>' . wpautop($text) . '</div>';
    }
}
