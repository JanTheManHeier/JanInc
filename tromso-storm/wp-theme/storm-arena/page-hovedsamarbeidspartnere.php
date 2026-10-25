<?php
get_header();
$main_sponsors = storm_arena_get_featured_sponsors();
?>
<main id="main-content" class="site-main site-shell">
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article <?php post_class('entry-page'); ?>>
                <header class="page-hero">
                    <span class="eyebrow">Laget bak laget</span>
                    <h1><?php the_title(); ?></h1>
                    <p>Våre hovedsponsorer er avgjørende for satsingen på elitebasket, talentutvikling og sterke opplevelser i nord.</p>
                </header>
                <section class="content-section">
                    <div class="content-card prose">
                        <?php the_content(); ?>
                    </div>
                </section>
                <section class="content-section">
                    <?php storm_arena_render_page_links(storm_arena_get_sponsor_navigation_links()); ?>
                    <div class="section-head"><div><div class="section-label"><span>01</span><strong>Hovedsponsorer</strong></div><h2>Laget bak laget</h2></div></div>
                    <?php storm_arena_render_sponsor_cards($main_sponsors); ?>
                </section>
            </article>
        <?php endwhile; ?>
    <?php else : ?>
        <?php storm_arena_render_empty_state('Fant ikke siden.', 'Prøv å åpne sponsoroversikten fra forsiden.'); ?>
    <?php endif; ?>
</main>
<?php get_footer(); ?>
