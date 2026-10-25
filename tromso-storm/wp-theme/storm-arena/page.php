<?php get_header(); ?>
<main id="main-content" class="site-main site-shell">
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article <?php post_class('entry-page'); ?>>
                <header class="page-hero">
                    <span class="eyebrow">Tromsø Storm</span>
                    <h1><?php the_title(); ?></h1>
                    <?php if (has_excerpt()) : ?>
                        <p><?php echo esc_html(get_the_excerpt()); ?></p>
                    <?php endif; ?>
                </header>
                <section class="content-section">
                    <div class="content-card prose">
                        <?php the_content(); ?>
                        <?php wp_link_pages(); ?>
                    </div>
                </section>
            </article>
        <?php endwhile; ?>
    <?php else : ?>
        <?php storm_arena_render_empty_state('Siden ble ikke funnet.', 'Prøv søket eller gå tilbake til forsiden.'); ?>
    <?php endif; ?>
</main>
<?php get_footer(); ?>
