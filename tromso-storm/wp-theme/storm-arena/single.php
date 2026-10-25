<?php get_header(); ?>
<main id="main-content" class="site-main site-shell">
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article <?php post_class('entry-detail'); ?>>
                <header class="page-hero">
                    <?php
                    $categories = get_the_category();
                    if (!empty($categories)) :
                        ?>
                        <span class="eyebrow"><?php echo esc_html($categories[0]->name); ?></span>
                    <?php endif; ?>
                    <h1><?php the_title(); ?></h1>
                    <p><?php echo esc_html(get_the_date('j. F Y')); ?> · <?php the_author(); ?></p>
                </header>

                <?php if (has_post_thumbnail()) : ?>
                    <figure class="feature-media">
                        <?php the_post_thumbnail('large'); ?>
                    </figure>
                <?php endif; ?>

                <section class="content-section">
                    <div class="content-card prose">
                        <?php the_content(); ?>
                        <?php wp_link_pages(); ?>
                    </div>
                </section>

                <nav class="post-navigation content-section" aria-label="<?php esc_attr_e('Innleggsnavigasjon', 'storm-arena'); ?>">
                    <div class="content-grid content-grid--narrow">
                        <div class="content-card"><?php previous_post_link('%link', '← %title'); ?></div>
                        <div class="content-card"><?php next_post_link('%link', '%title →'); ?></div>
                    </div>
                </nav>
            </article>
        <?php endwhile; ?>
    <?php else : ?>
        <?php storm_arena_render_empty_state('Artikkelen ble ikke funnet.', 'Det kan hende innholdet er flyttet eller ikke lenger er publisert.'); ?>
    <?php endif; ?>
</main>
<?php get_footer(); ?>
