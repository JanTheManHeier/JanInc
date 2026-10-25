<?php get_header(); ?>
<main id="main-content" class="site-main site-shell">
    <section class="page-hero">
        <span class="eyebrow">404</span>
        <h1>Fant ikke siden</h1>
        <p>Innholdet kan være flyttet, eller lenken peker til en gammel adresse.</p>
    </section>
    <section class="content-section">
        <div class="content-grid content-grid--narrow">
            <article class="content-card prose">
                <h2>Hva vil du gjøre nå?</h2>
                <ul>
                    <li><a href="<?php echo esc_url(home_url('/')); ?>">Gå til forsiden</a></li>
                    <li><a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('arkiv', home_url('/'))); ?>">Bla i arkivet</a></li>
                    <li><a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('kampoversikt', home_url('/'))); ?>">Se kampoversikten</a></li>
                </ul>
            </article>
            <article class="content-card">
                <h2>Søk i arkivet</h2>
                <?php get_search_form(); ?>
            </article>
        </div>
    </section>
</main>
<?php get_footer(); ?>
