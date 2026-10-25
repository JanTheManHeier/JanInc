<?php
get_header();
?>
<main id="main-content" class="site-main site-shell">
    <?php while (have_posts()) : the_post(); $id = get_the_ID(); ?>
        <article class="content-section content-card prose">
            <h1><?php the_title(); ?></h1>
            <p><?php echo esc_html((string) get_post_meta($id, 'storm_starts_at', true)); ?> · <?php echo esc_html((string) get_post_meta($id, 'storm_venue', true)); ?></p>
            <?php if (in_array(get_post_meta($id, 'storm_game_status', true), array('live', 'finished'), true)) : ?>
                <p><strong><?php echo esc_html(get_post_meta($id, 'storm_home_score', true) . '–' . get_post_meta($id, 'storm_away_score', true)); ?></strong></p>
            <?php endif; ?>
            <?php the_content(); ?>
            <?php foreach (array('storm_ticket_url' => 'Billetter', 'storm_stats_url' => 'Kampstatistikk', 'storm_mygame_url' => 'Se hos MyGame', 'storm_direktesport_url' => 'Se hos Direktesport') as $key => $label) : ?>
                <?php $url = (string) get_post_meta($id, $key, true); if ($url === '') { continue; } ?>
                <p><a href="<?php echo esc_url($url); ?>" rel="noopener noreferrer"><?php echo esc_html($label); ?></a></p>
            <?php endforeach; ?>
        </article>
    <?php endwhile; ?>
</main>
<?php get_footer(); ?>
