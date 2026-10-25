<?php get_header(); ?>
<main id="main-content" class="site-main site-shell">
    <section class="page-hero">
        <span class="eyebrow">Nyheter</span>
        <h1>Siste nytt</h1>
        <p>Redaksjonelle saker, klubbnyheter og historier fra Tromsø Storms arkiv.</p>
    </section>

    <section class="content-section">
        <?php if (have_posts()) : ?>
            <div class="story-list">
                <?php $story_index = 0; ?>
                <?php while (have_posts()) : the_post(); ?>
                    <article class="story story--list">
                        <?php storm_arena_render_post_image(get_the_ID(), $story_index, 'story__thumb'); ?>
                        <div>
                            <time datetime="<?php echo esc_attr(get_the_date(DATE_ATOM)); ?>"><?php echo esc_html(get_the_date('j. F Y')); ?></time>
                            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                            <p><?php echo esc_html(wp_trim_words(wp_strip_all_tags(get_the_excerpt() ?: get_the_content(null, false)), 34)); ?></p>
                            <a class="text-link" href="<?php the_permalink(); ?>">Les videre →</a>
                        </div>
                    </article>
                    <?php $story_index++; ?>
                <?php endwhile; ?>
            </div>
            <div class="pagination-wrap">
                <?php the_posts_pagination(array('mid_size' => 1, 'prev_text' => '← Nyere', 'next_text' => 'Eldre →')); ?>
            </div>
        <?php else : ?>
            <?php storm_arena_render_empty_state('Ingen artikler funnet.', 'Det finnes ingen publiserte innlegg å vise akkurat nå.'); ?>
        <?php endif; ?>
    </section>
</main>
<?php get_footer(); ?>
