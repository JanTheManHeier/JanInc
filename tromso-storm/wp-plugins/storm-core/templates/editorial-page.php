<?php
get_header();
?>
<main id="main-content" class="site-main site-shell">
    <?php while (have_posts()) : the_post(); ?>
        <article class="content-section content-card prose">
            <h1><?php the_title(); ?></h1>
            <?php the_content(); wp_link_pages(); ?>
        </article>
    <?php endwhile; ?>
</main>
<?php get_footer(); ?>
