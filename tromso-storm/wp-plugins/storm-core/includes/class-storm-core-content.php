<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Storm_Core_Content
{
    public static function enabled(): bool
    {
        return (bool) get_option('storm_core_public_content', false);
    }

    public static function active_season(): int
    {
        $ids = get_posts(array(
            'post_type' => 'storm_season', 'post_status' => 'publish',
            'posts_per_page' => 2, 'fields' => 'ids',
            'meta_key' => 'storm_is_active', 'meta_value' => '1',
        ));
        return count($ids) === 1 ? (int) $ids[0] : 0;
    }

    public static function records(string $type, int $season = 0): array
    {
        $season = $season ?: self::active_season();
        if (!$season || get_post_status($season) !== 'publish') {
            return array();
        }
        return get_posts(array(
            'post_type' => $type, 'post_status' => 'publish', 'posts_per_page' => -1,
            'meta_key' => 'storm_season_id', 'meta_value' => $season,
            'orderby' => 'ID', 'order' => 'ASC',
        ));
    }

    public static function image(int $id): string
    {
        return (string) (get_the_post_thumbnail_url($id, 'large') ?: get_post_meta($id, '_storm_legacy_image', true));
    }

    public static function within_dates(int $id): bool
    {
        $today = wp_date('Y-m-d');
        $from = (string) get_post_meta($id, 'storm_valid_from', true);
        $to = (string) get_post_meta($id, 'storm_valid_to', true);
        return ($from === '' || $from <= $today) && ($to === '' || $to >= $today);
    }

    private static function related_posts(array $records, string $relation, array $types): array
    {
        $ids = array();
        foreach ($records as $record) {
            $id = (int) get_post_meta($record->ID, $relation, true);
            if ($id > 0) {
                $ids[] = $id;
            }
        }
        if (!$ids) {
            return array();
        }
        $query = new WP_Query(array(
            'post_type' => $types, 'post_status' => 'publish',
            'post__in' => array_values(array_unique($ids)), 'posts_per_page' => -1,
            'no_found_rows' => true, 'ignore_sticky_posts' => true, 'suppress_filters' => true,
        ));
        update_post_thumbnail_cache($query);
        $posts = array();
        foreach ($query->posts as $post) {
            $posts[$post->ID] = $post;
        }
        return $posts;
    }

    public static function roster(string $kind, int $season = 0): array
    {
        $rows = array();
        $entries = self::records('storm_roster_entry', $season);
        $people = self::related_posts($entries, 'storm_person_id', array($kind === 'player' ? 'storm_player' : 'storm_staff'));
        foreach ($entries as $entry) {
            $id = $entry->ID;
            $person = $people[(int) get_post_meta($id, 'storm_person_id', true)] ?? null;
            if (!$person || $person->post_status !== 'publish'
                || $person->post_type !== ($kind === 'player' ? 'storm_player' : 'storm_staff')
                || !get_post_meta($id, 'storm_is_active', true)) {
                continue;
            }
            $number = metadata_exists('post', $id, 'storm_jersey_number') ? get_post_meta($id, 'storm_jersey_number', true) : '';
            $rows[] = array(
                'id' => $person->ID, 'url' => get_permalink($person),
                'name' => $person->post_title, 'photo_url' => self::image($person->ID),
                'description' => $person->post_content,
                'number' => $number === '' ? null : (int) $number,
                'position' => (string) get_post_meta($id, 'storm_position', true),
                'role' => (string) get_post_meta($person->ID, 'storm_staff_role', true),
                'height' => (int) get_post_meta($person->ID, 'storm_height_cm', true),
                'weight' => (int) get_post_meta($person->ID, 'storm_weight_kg', true),
                'born' => (string) (get_post_meta($person->ID, 'storm_birth_year', true) ?: get_post_meta($person->ID, '_storm_birth_year', true)),
                'experience' => (int) get_post_meta($person->ID, 'storm_elite_years', true),
                'email' => (string) get_post_meta($person->ID, 'storm_email', true),
                'featured' => (bool) get_post_meta($id, 'storm_featured', true),
                'sort_order' => (int) get_post_meta($id, 'storm_sort_order', true),
            );
        }
        usort($rows, static fn(array $a, array $b): int =>
            array($a['sort_order'], $a['number'] ?? PHP_INT_MAX, $a['name'])
            <=> array($b['sort_order'], $b['number'] ?? PHP_INT_MAX, $b['name']));
        return $rows;
    }

    public static function sponsors(int $season = 0): array
    {
        $rows = array();
        $historical = $season && $season !== self::active_season();
        $levels = array('main' => 'Hovedsamarbeidspartnere', 'partner' => 'Samarbeidspartnere', 'supporter' => 'Ovrige', 'member' => 'Støttemedlem');
        $deals = self::records('storm_sponsor_deal', $season);
        $sponsors = self::related_posts($deals, 'storm_sponsor_id', array('storm_sponsor'));
        foreach ($deals as $deal) {
            $id = $deal->ID;
            $sponsor = $sponsors[(int) get_post_meta($id, 'storm_sponsor_id', true)] ?? null;
            if (!$sponsor || $sponsor->post_type !== 'storm_sponsor' || $sponsor->post_status !== 'publish'
                || (!$historical && (!get_post_meta($id, 'storm_is_active', true) || !self::within_dates($id)))) {
                continue;
            }
            $level = (string) get_post_meta($id, 'storm_level', true);
            if (!isset($levels[$level])) {
                continue;
            }
            $rows[$sponsor->ID] = array(
                'id' => $sponsor->ID, 'name' => $sponsor->post_title, 'type' => $levels[$level],
                'member_kind' => (string) (get_post_meta($sponsor->ID, 'storm_member_kind', true) ?: 'business'),
                'logo_url' => self::image($sponsor->ID),
                'link_url' => (string) get_post_meta($sponsor->ID, 'storm_website_url', true),
                'text' => $sponsor->post_content,
                'sort_order' => (int) get_post_meta($id, 'storm_sort_order', true),
            );
        }
        $rows = array_values($rows);
        usort($rows, static fn(array $a, array $b): int =>
            array($a['type'], -$a['sort_order'], $a['name']) <=> array($b['type'], -$b['sort_order'], $b['name']));
        return $rows;
    }

    public static function training(int $season = 0): array
    {
        $days = array(1 => 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag');
        $rows = array();
        foreach (self::records('storm_training', $season) as $post) {
            if (!self::within_dates($post->ID)) {
                continue;
            }
            $day = (int) get_post_meta($post->ID, 'storm_weekday', true);
            $rows[] = array(
                'day' => $days[$day] ?? '', 'weekday' => $day,
                'team' => (string) get_post_meta($post->ID, 'storm_team', true),
                'time' => get_post_meta($post->ID, 'storm_starts_time', true) . '–' . get_post_meta($post->ID, 'storm_ends_time', true),
                'venue' => (string) get_post_meta($post->ID, 'storm_venue', true),
            );
        }
        usort($rows, static fn(array $a, array $b): int => array($a['weekday'], $a['time']) <=> array($b['weekday'], $b['time']));
        return $rows;
    }

    public static function social(): array
    {
        $rows = array();
        $posts = get_posts(array(
            'post_type' => 'storm_social', 'post_status' => 'publish', 'posts_per_page' => -1,
        ));
        usort($posts, static fn(WP_Post $a, WP_Post $b): int =>
            array((int) get_post_meta($a->ID, 'storm_sort_order', true), $a->ID)
            <=> array((int) get_post_meta($b->ID, 'storm_sort_order', true), $b->ID));
        foreach ($posts as $post) {
            if (!get_post_meta($post->ID, 'storm_is_active', true)
                || !get_post_meta($post->ID, 'storm_rights_confirmed', true)
                || !Storm_Core_Editorial::current($post->ID)) {
                continue;
            }
            $image = self::image($post->ID);
            $url = (string) get_post_meta($post->ID, 'storm_source_url', true);
            if ($image === '' || $url === '') {
                continue;
            }
            $date = (string) get_post_meta($post->ID, 'storm_published_at', true);
            $timestamp = $date !== '' ? strtotime($date) : false;
            $rows[] = array(
                'title' => $post->post_title, 'excerpt' => wp_strip_all_tags($post->post_excerpt ?: $post->post_content),
                'platform' => ucfirst((string) get_post_meta($post->ID, 'storm_platform', true)),
                'url' => $url, 'image' => $image,
                'alt' => (string) get_post_meta($post->ID, 'storm_image_alt', true),
                'date' => $timestamp ? wp_date('Y-m-d', $timestamp) : '',
                'label' => $timestamp ? wp_date('j. F Y', $timestamp) : '',
            );
        }
        return array_slice($rows, 0, 4);
    }

    public static function games(int $season = 0): array
    {
        $rows = array();
        foreach (self::records('storm_game', $season) as $post) {
            if (get_post_meta($post->ID, 'storm_hidden', true)) {
                continue;
            }
            $meta = array();
            foreach (Storm_Core_Meta::definitions()['storm_game'] as $key => $field) {
                $meta[$key] = get_post_meta($post->ID, $key, true);
            }
            $rows[] = array('id' => $post->ID, 'title' => $post->post_title, 'url' => get_permalink($post), 'meta' => $meta);
        }
        return $rows;
    }
}
