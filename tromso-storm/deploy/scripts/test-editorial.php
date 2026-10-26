<?php

if (!defined('WP_CLI') || !WP_CLI || wp_get_environment_type() !== 'staging'
    || wp_parse_url(home_url(), PHP_URL_PORT) !== 18093) {
    throw new RuntimeException('Run only in the isolated editorial test project on port 18093.');
}

$created = array();
$users = array();
$original_user = get_current_user_id();
$options = array();
foreach (array('storm_core_public_content', 'storm_editorial_pages', 'storm_link_report', 'storm_link_cursor') as $name) {
    $options[$name] = get_option($name, null);
}
$active_flags = array();
foreach (get_posts(array('post_type' => 'storm_season', 'post_status' => 'any', 'posts_per_page' => -1)) as $season) {
    $active_flags[$season->ID] = get_post_meta($season->ID, 'storm_is_active', true);
}
$admin = get_user_by('login', 'storm-staging-admin');
wp_set_current_user($admin->ID);
$assertions = 0;
$check = static function (bool $condition, string $message) use (&$assertions): void {
    if (!$condition) {
        throw new RuntimeException($message);
    }
    $assertions++;
};
$insert = static function (string $type, array $meta = array(), string $status = 'publish', string $title = 'Editorial test') use (&$created): int {
    $id = wp_insert_post(array(
        'post_type' => $type, 'post_status' => $status,
        'post_title' => $title, 'post_content' => 'Editorial test content', 'meta_input' => $meta,
    ), true);
    if (is_wp_error($id)) {
        throw new RuntimeException($id->get_error_message());
    }
    $created[] = $id;
    return $id;
};
$failure = null;
$cron_test_args = array(wp_generate_uuid4());
try {
    foreach (array('editor', 'subscriber') as $role) {
        $id = wp_insert_user(array(
            'user_login' => 'storm-editorial-test-' . $role . '-' . wp_generate_password(8, false),
            'user_pass' => wp_generate_password(40), 'role' => $role,
        ));
        if (is_wp_error($id)) {
            throw new RuntimeException($id->get_error_message());
        }
        $users[$role] = $id;
    }
    wp_set_current_user($users['subscriber']);
    $check(is_wp_error(Storm_Core_Seasons::prepare(0, 2090, array())), 'Subscriber must not prepare seasons.');
    wp_set_current_user($users['editor']);
    $season = Storm_Core_Seasons::prepare(0, 2090, array());
    $check(is_int($season), 'Editor must be able to prepare a season.');
    $created[] = $season;
    $check(get_post_status($season) === 'draft', 'Preparation must not publish a season.');

    $player = $insert('storm_player', array('storm_height_cm' => 198), 'publish', 'Editorial Player Zero');
    $roster = $insert('storm_roster_entry', array(
        'storm_season_id' => $season, 'storm_person_id' => $player,
        'storm_person_type' => 'player', 'storm_jersey_number' => 0,
        'storm_is_active' => true, 'storm_position' => 'Guard',
    ));
    $sponsor = $insert('storm_sponsor', array('storm_website_url' => 'https://example.com'), 'publish', 'Editorial Sponsor');
    $deal = $insert('storm_sponsor_deal', array(
        'storm_season_id' => $season, 'storm_sponsor_id' => $sponsor,
        'storm_level' => 'main', 'storm_is_active' => true,
    ));
    $training = $insert('storm_training', array(
        'storm_season_id' => $season, 'storm_team' => 'Test team', 'storm_weekday' => 2,
        'storm_starts_time' => '18:00', 'storm_ends_time' => '20:00', 'storm_venue' => 'Test venue',
    ));
    $game = $insert('storm_game', array(
        'storm_season_id' => $season, 'storm_starts_at' => '2090-09-01T18:00:00+02:00',
        'storm_home_team' => 'Tromsø Storm', 'storm_away_team' => 'Test opponent',
        'storm_game_status' => 'scheduled', 'storm_venue' => 'Trondheim Spektrum F',
        'storm_ticket_url' => 'https://example.com/tickets',
    ));
    $check(Storm_Core_Seasons::activate($season) === true, 'A valid reviewed season must activate.');
    $check(Storm_Core_Content::active_season() === $season, 'Activated season must be unique and public.');
    $check(storm_arena_get_next_match(array(array('timestamp' => time() + 30 * MINUTE_IN_SECONDS, 'status' => 'scheduled'))) !== null,
        'A match starting in thirty minutes must not disappear because of a timezone-adjusted timestamp.');
    $check(storm_arena_get_next_match(array(array('timestamp' => time() - MINUTE_IN_SECONDS, 'status' => 'scheduled'))) === null,
        'An already started scheduled match must not remain the next match.');
    $check(Storm_Core_Content::roster('player')[0]['number'] === 0, 'Jersey zero must be preserved.');
    $unknown_number = $insert('storm_roster_entry', array(
        'storm_season_id' => $season, 'storm_person_id' => $player,
        'storm_person_type' => 'player', 'storm_is_active' => true,
    ));
    $check(Storm_Core_Content::roster('player')[1]['number'] === null, 'Missing jersey number must remain unknown, not become zero.');
    wp_delete_post($unknown_number, true);
    $check(storm_arena_get_roster_entries('storm-current-roster')[0]['name'] === 'Editorial Player Zero', 'Theme must read managed roster.');
    $check(count(storm_arena_get_sponsors()) === 1, 'Theme must read managed sponsor agreement.');
    update_post_meta($deal, 'storm_level', 'member');
    update_post_meta($sponsor, 'storm_member_kind', 'person');
    $check(storm_arena_get_supporter_people() === array('Editorial Sponsor'), 'Personal supporting members must be editable season-managed names.');
    $check(storm_arena_get_supporter_businesses() === array(), 'Personal members must not leak into the business-logo list.');
    $check(storm_arena_get_secondary_sponsors() === array(), 'Members must not replace the partner hierarchy.');
    update_post_meta($sponsor, 'storm_member_kind', 'business');
    $check(count(storm_arena_get_supporter_businesses()) === 1 && storm_arena_get_supporter_people() === array(), 'Changing member kind must update both public lists.');
    update_post_meta($deal, 'storm_level', 'main');
    $check(storm_arena_get_training_times('storm-training')[0]['team'] === 'Test team', 'Theme must read managed training.');
    $check(storm_arena_get_core_schedule_entries()[0]['ticket_url'] === 'https://example.com/tickets', 'Theme must expose the specific ticket link.');
    update_post_meta($game, 'storm_hidden', true);
    $check(storm_arena_get_schedule_entries('storm-current-fixtures') === array(), 'Removing all managed games must not resurrect legacy games.');
    update_post_meta($game, 'storm_hidden', false);
    update_post_meta($game, 'storm_game_status', 'cancelled');
    $check(storm_arena_get_next_match(storm_arena_get_schedule_entries('storm-current-fixtures')) === null, 'Cancelled game must not be the next game.');
    update_post_meta($game, 'storm_game_status', 'scheduled');
    update_post_meta($deal, 'storm_valid_to', '2001-01-01');
    $check(Storm_Core_Content::sponsors() === array(), 'Expired sponsor must be hidden.');
    delete_post_meta($deal, 'storm_valid_to');
    wp_update_post(array('ID' => $sponsor, 'post_status' => 'private'));
    $check(Storm_Core_Content::sponsors() === array(), 'Private sponsor profile must not leak through a published agreement.');
    $check(is_wp_error(Storm_Core_Seasons::activate($season)), 'Activation must not publish private profiles.');
    wp_update_post(array('ID' => $sponsor, 'post_status' => 'publish'));

    $batch_season = $insert('storm_season', array('storm_is_active' => false), 'publish', 'Batch loading test season');
    $empty_season = $insert('storm_season', array('storm_is_active' => false), 'publish', 'Empty batch test season');
    $check(Storm_Core_Content::sponsors($empty_season) === array()
        && Storm_Core_Content::roster('player', $empty_season) === array()
        && storm_arena_get_core_schedule_entries('Tromsø Storm', $empty_season) === array(),
        'Empty related ID lists must never load unrelated published content.');
    $batch_counts = array();
    $batch_sponsors = array();
    $batch_players = array();
    for ($i = 1; $i <= 20; $i++) {
        $batch_sponsors[] = $insert('storm_sponsor', array('_storm_legacy_image' => 'https://example.com/logo.png'), 'publish', 'Batch sponsor ' . $i);
        $insert('storm_sponsor_deal', array(
            'storm_season_id' => $batch_season, 'storm_sponsor_id' => $batch_sponsors[$i - 1],
            'storm_level' => 'partner', 'storm_is_active' => true, 'storm_sort_order' => $i,
        ));
        $batch_players[] = $insert('storm_player', array(), 'publish', 'Batch player ' . $i);
        $insert('storm_roster_entry', array(
            'storm_season_id' => $batch_season, 'storm_person_id' => $batch_players[$i - 1],
            'storm_person_type' => 'player', 'storm_is_active' => true,
        ));
        $insert('storm_game', array(
            'storm_season_id' => $batch_season, 'storm_starts_at' => sprintf('2090-10-%02dT18:00:00+02:00', $i),
            'storm_home_team' => 'Tromsø Storm', 'storm_away_team' => 'Batch opponent ' . $i,
            'storm_game_status' => 'scheduled',
        ));
        if (!in_array($i, array(2, 20), true)) {
            continue;
        }
        foreach (array(
            'sponsors' => static fn() => Storm_Core_Content::sponsors($batch_season),
            'players' => static fn() => Storm_Core_Content::roster('player', $batch_season),
            'games' => static fn() => storm_arena_get_core_schedule_entries('Tromsø Storm', $batch_season),
        ) as $domain => $reader) {
            wp_cache_flush();
            $before = get_num_queries();
            $rows = $reader();
            $batch_counts[$domain][$i] = get_num_queries() - $before;
            $check(count($rows) === $i, 'Batch loading must preserve all ' . $domain . ' records.');
        }
    }
    foreach ($batch_counts as $domain => $counts) {
        $check($counts[20] <= $counts[2] + 3,
            'Cold-cache ' . $domain . ' query count must not grow per related record.');
    }
    $batch_rows = Storm_Core_Content::sponsors($batch_season);
    $check($batch_rows[0]['id'] === $batch_sponsors[19]
        && $batch_rows[0]['logo_url'] === 'https://example.com/logo.png',
        'Bulk sponsor loading must preserve sort order and legacy image fallback.');
    update_post_meta($batch_sponsors[19], '_storm_legacy_image', 'https://example.com/updated-logo.png');
    $check(Storm_Core_Content::sponsors($batch_season)[0]['logo_url'] === 'https://example.com/updated-logo.png',
        'An updated image reference must be visible immediately after a prior bulk read.');
    foreach (array(0, PHP_INT_MAX, $batch_players[0]) as $invalid_sponsor) {
        $insert('storm_sponsor_deal', array(
            'storm_season_id' => $batch_season, 'storm_sponsor_id' => $invalid_sponsor,
            'storm_level' => 'partner', 'storm_is_active' => true,
        ));
    }
    foreach (array(0, PHP_INT_MAX, $batch_sponsors[0]) as $invalid_person) {
        $insert('storm_roster_entry', array(
            'storm_season_id' => $batch_season, 'storm_person_id' => $invalid_person,
            'storm_person_type' => 'player', 'storm_is_active' => true,
        ));
    }
    $check(count(Storm_Core_Content::sponsors($batch_season)) === 20
        && count(Storm_Core_Content::roster('player', $batch_season)) === 20,
        'Missing and wrong-type profiles must not appear through a relation.');
    wp_update_post(array('ID' => $batch_players[0], 'post_status' => 'private'));
    $check(count(Storm_Core_Content::roster('player', $batch_season)) === 19,
        'A newly private player must disappear immediately after a prior bulk read.');
    wp_update_post(array('ID' => $batch_players[0], 'post_status' => 'publish', 'post_title' => 'Changed batch player'));
    $check(in_array('Changed batch player', array_column(Storm_Core_Content::roster('player', $batch_season), 'name'), true),
        'Republished and renamed players must appear without stale result caching.');
    wp_update_post(array('ID' => $batch_sponsors[0], 'post_status' => 'draft'));
    $check(count(Storm_Core_Content::sponsors($batch_season)) === 19,
        'A newly drafted sponsor must disappear immediately after a prior bulk read.');
    wp_delete_post($batch_sponsors[1], true);
    $check(count(Storm_Core_Content::sponsors($batch_season)) === 18,
        'Deleted sponsor profiles must not remain in published relation results.');

    $next = Storm_Core_Seasons::prepare($season, 2091, array('storm_roster_entry', 'storm_sponsor_deal', 'storm_training'));
    $check(is_int($next), 'Copying a season must succeed.');
    $created[] = $next;
    $copied = get_posts(array('post_type' => array('storm_roster_entry', 'storm_sponsor_deal', 'storm_training'), 'post_status' => 'draft', 'posts_per_page' => -1, 'meta_key' => 'storm_season_id', 'meta_value' => $next));
    foreach ($copied as $post) { $created[] = $post->ID; }
    $check(count($copied) === 3, 'Copy must create exactly the selected seasonal records, not games or profiles.');
    $check(Storm_Core_Content::active_season() === $season, 'Preparing next season must leave the active season unchanged.');
    $check(Storm_Core_Seasons::prepare($season, 2091, array('storm_roster_entry', 'storm_sponsor_deal', 'storm_training')) === $next, 'Retry must reuse the prepared season.');
    $count = get_posts(array('post_type' => array('storm_roster_entry', 'storm_sponsor_deal', 'storm_training'), 'post_status' => 'any', 'posts_per_page' => -1, 'meta_key' => 'storm_season_id', 'meta_value' => $next));
    $check(count($count) === 3, 'Retry must not duplicate seasonal copies.');
    $check(Storm_Core_Seasons::activate($next) === true, 'Prepared valid next season must activate.');
    $check(Storm_Core_Content::active_season() === $next, 'New season must replace the active season.');
    $check(get_post_status($season) === 'publish' && !get_post_meta($season, 'storm_is_active', true), 'Previous season must remain published as history.');
    $check(Storm_Core_Content::roster('player')[0]['id'] === $player, 'Copy must reuse the same person profile.');
    $check(storm_arena_get_schedule_entries('storm-current-fixtures') === array(), 'Empty new season must not fall back to old fixtures.');
    update_post_meta($deal, 'storm_valid_to', '2001-01-01');
    $check(count(Storm_Core_Content::sponsors($season)) === 1, 'Expired deals must remain visible in historical published seasons.');
    delete_post_meta($deal, 'storm_valid_to');
    $check(storm_arena_get_standings() === array(), 'A new season without an official tournament must not display the old league table.');
    $check(Storm_Core_Seasons::activate($season) === true, 'Previous season can be reactivated without data deletion.');

    $coach = $insert('storm_staff', array('storm_staff_role' => 'Physical coach'), 'publish', 'Editorial Coach');
    $insert('storm_roster_entry', array(
        'storm_season_id' => $season, 'storm_person_id' => $coach,
        'storm_person_type' => 'staff', 'storm_is_active' => true,
    ));
    $render_front = static function (): string {
        $previous_post = $GLOBALS['post'] ?? null;
        $previous_server_name = $_SERVER['SERVER_NAME'] ?? null;
        $_SERVER['SERVER_NAME'] = wp_parse_url(home_url(), PHP_URL_HOST);
        ob_start();
        try {
            include get_stylesheet_directory() . '/front-page-new.php';
            return ob_get_contents();
        } finally {
            ob_end_clean();
            $GLOBALS['post'] = $previous_post;
            if ($previous_server_name === null) {
                unset($_SERVER['SERVER_NAME']);
            } else {
                $_SERVER['SERVER_NAME'] = $previous_server_name;
            }
        }
    };
    preg_match('/<div class="coach-photo-orb">(.*?)<\/div>/s', $render_front(), $avatar);
    $check(isset($avatar[1]) && str_contains($avatar[1], '<span>EC</span>') && !str_contains($avatar[1], '<img'),
        'A coach without a portrait must use their initials, never another person\'s photograph.');
    update_post_meta($coach, '_storm_legacy_image', '/wp-content/uploads/editorial-coach.jpg');
    preg_match('/<div class="coach-photo-orb">(.*?)<\/div>/s', $render_front(), $avatar);
    $check(isset($avatar[1]) && str_contains($avatar[1], '/wp-content/uploads/editorial-coach.jpg')
        && str_contains($avatar[1], 'alt="Editorial Coach"'), 'A verified coach portrait must remain visible with the correct name.');

    $source_summary = $insert('post', array('_storm_refresh_kind' => 'news-summary-draft'), 'draft', 'Editorial source summary');
    $previous_global_post = $GLOBALS['post'] ?? null;
    $GLOBALS['post'] = get_post($source_summary);
    $source_url = 'https://tromsostorm.no/2026/10/19/ny-seier-til-storm-4/';
    $source_link = '<a href="' . $source_url . '">Original article</a>';
    try {
        $check(str_contains(apply_filters('the_content', $source_link), $source_url),
            'A source-linked review summary must keep the original article on the current public site.');
        delete_post_meta($source_summary, '_storm_refresh_kind');
        $check(str_contains(apply_filters('the_content', $source_link), home_url('/2026/10/19/ny-seier-til-storm-4/')),
            'Ordinary migrated articles must still rewrite their old internal links to the new site.');
    } finally {
        $GLOBALS['post'] = $previous_global_post;
    }

    $social = $insert('storm_social', array(
        'storm_platform' => 'facebook', 'storm_source_url' => 'https://www.facebook.com/TromsoStorm/',
        'storm_is_active' => true, 'storm_rights_confirmed' => false,
        '_storm_legacy_image' => '/wp-content/themes/storm-arena/assets/hero-team-blno.png',
        'storm_image_alt' => 'Editorial test image',
    ));
    $check(Storm_Core_Content::social() === array(), 'Unapproved social image must not be public.');
    update_post_meta($social, 'storm_rights_confirmed', true);
    $check(count(Storm_Core_Content::social()) === 1, 'Approved published social card must display without an explicit sort number.');
    update_post_meta($social, '_storm_expires_on', '2001-01-01');
    $check(Storm_Core_Content::social() === array(), 'Expired social card must disappear without cron.');
    wp_update_post(array('ID' => $social, 'post_status' => 'draft'));

    $page = $insert('page', array(), 'draft', 'Editorial home introduction');
    update_option('storm_editorial_pages', array('hero' => $page));
    $check(Storm_Core_Editorial::page('hero') === null, 'A selected draft page must not become public.');
    wp_update_post(array('ID' => $page, 'post_status' => 'publish'));
    $check(Storm_Core_Editorial::page('hero')->ID === $page, 'A selected published page must become available.');
    $previous_global_post = $GLOBALS['post'] ?? null;
    $GLOBALS['post'] = get_post($page);
    $check(Storm_Core_Editorial::page('arena') === null, 'An unselected slot must not accidentally use the current public page.');
    $GLOBALS['post'] = $previous_global_post;
    $check(Storm_Core_Fields::validate_submission('storm_player', array('storm_height_cm' => 'not a number')) !== array(), 'Invalid numbers must not silently become zero.');
    wp_update_post(array('ID' => $page, 'post_content' => '<a href="http://1.1.1.1/editorial-not-found">Test</a><a href="https://user:pass@example.com/private">Do not request credentials</a>'));
    update_option('storm_link_cursor', 0);
    $link_calls = array();
    $mock_links = static function ($preempt, array $args, string $url) use (&$link_calls): array {
        $link_calls[] = array($url, $args);
        return array('headers' => array(), 'body' => '', 'response' => array('code' => str_contains($url, 'editorial-not-found') ? 404 : 200, 'message' => 'Test response'), 'cookies' => array());
    };
    add_filter('pre_http_request', $mock_links, 10, 3);
    try {
        Storm_Core_Editorial::check_links();
    } finally {
        remove_filter('pre_http_request', $mock_links, 10);
    }
    $report = get_option('storm_link_report');
    $check(($report['http://1.1.1.1/editorial-not-found']['status'] ?? null) === 404, 'Link check must report the actual HTTP failure for a selected page.');
    $check(count($link_calls) > 0 && count($link_calls) <= 5 && !empty($link_calls[0][1]['reject_unsafe_urls']) && $link_calls[0][1]['method'] === 'HEAD', 'Link checker must use bounded, safe HEAD requests.');
    $check(!isset($report['https://user:pass@example.com/private']), 'Link checker must never request URLs containing credentials.');

    $request = new WP_REST_Request('POST', '/wp/v2/storm-game');
    $type = get_post_type_object('storm_game');
    $request = new WP_REST_Request('POST', '/wp/v2/' . $type->rest_base);
    $request->set_body_params(array('title' => 'Invalid incomplete game', 'status' => 'publish'));
    $response = rest_do_request($request);
    $check($response->get_status() === 400, 'REST must reject publishing incomplete domain records.');
    wp_set_current_user(0);
    $response = rest_do_request(new WP_REST_Request('GET', '/storm/v1/social'));
    $check($response->get_status() === 200 && $response->get_data() === array(), 'Anonymous API must not reveal a draft social card.');
    $response = rest_do_request(new WP_REST_Request('POST', '/storm/v1/roster'));
    $check($response->get_status() >= 400, 'Versioned public API must be read-only.');
    wp_set_current_user($users['editor']);
    $invalid = $insert('storm_training', array('storm_season_id' => $season, 'storm_team' => 'Invalid', 'storm_weekday' => 8), 'draft');
    $check(Storm_Core_Fields::validate_post($invalid) !== array(), 'Invalid dates, required fields and relationships must block activation.');
    $check(is_wp_error(Storm_Core_Seasons::activate($season)), 'Activation must stop before publishing invalid seasonal drafts.');
    $check(Storm_Core_Content::active_season() === $season, 'Failed activation must preserve the existing active season.');
    $rollback_season = Storm_Core_Seasons::prepare(0, 2092, array());
    if (is_wp_error($rollback_season)) {
        throw new RuntimeException($rollback_season->get_error_message());
    }
    $created[] = $rollback_season;
    $rollback_training = $insert('storm_training', array(
        'storm_season_id' => $rollback_season, 'storm_team' => 'Rollback test', 'storm_weekday' => 2,
        'storm_starts_time' => '18:00', 'storm_ends_time' => '20:00', 'storm_venue' => 'Test venue',
    ), 'draft');
    $active_before_failure = Storm_Core_Content::active_season();
    $reject_publication = static fn(bool $empty, array $post): bool =>
        (int) ($post['ID'] ?? 0) === $rollback_training || $empty;
    add_filter('wp_insert_post_empty_content', $reject_publication, 10, 2);
    try {
        $result = Storm_Core_Seasons::activate($rollback_season);
    } finally {
        remove_filter('wp_insert_post_empty_content', $reject_publication, 10);
    }
    $check(is_wp_error($result), 'A failure after the season post is published must be reported.');
    $check(get_post_status($rollback_season) === 'draft' && get_post_status($rollback_training) === 'draft'
        && Storm_Core_Content::active_season() === $active_before_failure, 'Real transaction rollback must undo earlier publication and preserve the active season.');
    $throw_publication = static function (bool $empty, array $post) use ($rollback_training): bool {
        if ((int) ($post['ID'] ?? 0) === $rollback_training) {
            throw new RuntimeException('Controlled editorial transaction failure.');
        }
        return $empty;
    };
    $thrown = false;
    add_filter('wp_insert_post_empty_content', $throw_publication, 10, 2);
    try {
        Storm_Core_Seasons::activate($rollback_season);
    } catch (RuntimeException $error) {
        $thrown = $error->getMessage() === 'Controlled editorial transaction failure.';
    } finally {
        remove_filter('wp_insert_post_empty_content', $throw_publication, 10);
    }
    $check($thrown && get_post_status($rollback_season) === 'draft'
        && Storm_Core_Content::active_season() === $active_before_failure, 'An exception must roll back before returning control to the caller.');
    $reject_active_flag = static fn($check, int $id, string $key) =>
        $id === $rollback_season && $key === 'storm_is_active' ? false : $check;
    add_filter('update_post_metadata', $reject_active_flag, 10, 3);
    try {
        $result = Storm_Core_Seasons::activate($rollback_season);
    } finally {
        remove_filter('update_post_metadata', $reject_active_flag, 10);
    }
    $check(is_wp_error($result) && get_post_status($rollback_season) === 'draft'
        && Storm_Core_Content::active_season() === $active_before_failure, 'A failed active-flag write must not commit a partially published season.');
    $forbidden_ran = false;
    add_action('storm_editorial_forbidden_test', static function () use (&$forbidden_ran): void {
        $forbidden_ran = true;
    });
    $check(wp_schedule_single_event(1, 'storm_editorial_forbidden_test', $cron_test_args), 'The negative cron test must really be queued.');
    require __DIR__ . '/run-editorial-cron.php';
    $check(!$forbidden_ran && wp_next_scheduled('storm_editorial_forbidden_test', $cron_test_args) === 1,
        'The real scheduler must preserve an unapproved event, including the first exclusion in the list.');
    WP_CLI::log(sprintf('%d editorial integration assertions passed.', $assertions));
} catch (Throwable $error) {
    $failure = $error;
} finally {
    wp_clear_scheduled_hook('storm_editorial_forbidden_test', $cron_test_args);
    $_POST = array();
    wp_set_current_user($admin->ID);
    foreach (array_reverse(array_unique($created)) as $id) {
        wp_delete_post((int) $id, true);
    }
    require_once ABSPATH . 'wp-admin/includes/user.php';
    foreach ($users as $id) {
        wp_delete_user($id, $admin->ID);
    }
    foreach ($active_flags as $id => $flag) {
        update_post_meta($id, 'storm_is_active', $flag);
    }
    foreach ($options as $name => $value) {
        $value === null ? delete_option($name) : update_option($name, $value);
    }
    wp_set_current_user($original_user);
}
if ($failure) {
    WP_CLI::error($failure->getMessage());
}
WP_CLI::success('Editorial integration checks passed; exact test resources removed.');
