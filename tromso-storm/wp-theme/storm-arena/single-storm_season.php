<?php
get_header();
?>
<main id="main-content" class="site-main site-shell">
    <?php while (have_posts()) : the_post(); $season = get_the_ID(); ?>
        <section class="content-section">
            <h1>Sesongen <?php the_title(); ?></h1>
            <?php the_content(); ?>
            <h2>Spillere og trenere</h2>
            <ul>
                <?php foreach (array_merge(Storm_Core_Content::roster('player', $season), Storm_Core_Content::roster('staff', $season)) as $person) : ?>
                    <li><a href="<?php echo esc_url($person['url']); ?>"><?php echo esc_html($person['name']); ?></a> — <?php echo esc_html($person['position'] ?: $person['role']); ?></li>
                <?php endforeach; ?>
            </ul>
            <h2>Kamper og resultater</h2>
            <?php storm_arena_render_match_rows(storm_arena_get_core_schedule_entries('Tromsø Storm', $season)); ?>
            <h2>Sesongens partnere</h2>
            <?php storm_arena_render_sponsor_cards(storm_arena_resolve_core_images(Storm_Core_Content::sponsors($season), 'logo_url')); ?>
        </section>
    <?php endwhile; ?>
</main>
<?php get_footer(); ?>
