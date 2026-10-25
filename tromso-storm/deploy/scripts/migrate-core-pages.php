<?php

if (!defined('WP_CLI') || !WP_CLI) {
    fwrite(STDERR, "Run this script with wp eval-file.\n");
    exit(1);
}

$pages = array(
    array(
        'migration_key' => 'storm-core-page-besok-arenaen',
        'slug'          => 'besok-arenaen',
        'title'         => 'Besøk arenaen',
        'content'       => 'Praktisk informasjon for publikum som skal på Tromsø Storms hjemmekamper i Rødtindhallen.',
    ),
    array(
        'migration_key' => 'storm-core-page-sesongkort',
        'slug'          => 'sesongkort',
        'title'         => 'Sesongkort',
        'content'       => 'Sesongkort til Tromsø Storms hjemmekamper i sesongen 2026/27.',
    ),
);

foreach ($pages as $page) {
    $existing = get_posts(
        array(
            'post_type'      => 'page',
            'post_status'    => 'any',
            'posts_per_page' => 1,
            'meta_key'       => '_storm_migration_key',
            'meta_value'     => $page['migration_key'],
        )
    );

    $post = $existing[0] ?? get_page_by_path($page['slug'], OBJECT, 'page');
    if ($post instanceof WP_Post) {
        update_post_meta($post->ID, '_storm_migration_key', $page['migration_key']);
        WP_CLI::log(sprintf('Kept existing page %s (%d).', $page['slug'], $post->ID));
        continue;
    }

    $post_id = wp_insert_post(
        array(
            'post_type'    => 'page',
            'post_status'  => 'publish',
            'post_name'    => $page['slug'],
            'post_title'   => $page['title'],
            'post_content' => $page['content'],
        ),
        true
    );

    if (is_wp_error($post_id)) {
        WP_CLI::error($post_id->get_error_message());
    }

    update_post_meta($post_id, '_storm_migration_key', $page['migration_key']);
    WP_CLI::success(sprintf('Created page %s (%d).', $page['slug'], $post_id));
}
