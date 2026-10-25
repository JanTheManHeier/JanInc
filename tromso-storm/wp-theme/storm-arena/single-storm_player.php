<?php
get_header();
?>
<main id="main-content" class="site-main site-shell">
    <?php while (have_posts()) : the_post(); $id = get_the_ID(); ?>
        <article class="content-section content-card prose">
            <h1><?php the_title(); ?></h1>
            <?php $image = storm_arena_resolve_media_url(Storm_Core_Content::image($id)); ?>
            <?php if ($image !== '') : ?>
                <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" style="max-width:100%;height:auto;max-height:500px">
            <?php endif; ?>
            <?php the_content(); ?>
            <?php foreach (array('storm_height_cm' => 'Høyde (cm)', 'storm_birth_year' => 'Fødselsår', 'storm_elite_years' => 'År i eliteserien', 'storm_former_clubs' => 'Tidligere klubber', 'storm_staff_role' => 'Rolle') as $key => $label) : ?>
                <?php $value = get_post_meta($id, $key, true); if ($value === '') { continue; } ?>
                <p><strong><?php echo esc_html($label); ?>:</strong> <?php echo esc_html((string) $value); ?></p>
            <?php endforeach; ?>
            <?php foreach (array('storm_instagram_url' => 'Instagram', 'storm_video_url' => 'Profilvideo') as $key => $label) : ?>
                <?php $url = (string) get_post_meta($id, $key, true); if ($url === '') { continue; } ?>
                <p><a href="<?php echo esc_url($url); ?>" rel="noopener noreferrer" target="_blank"><?php echo esc_html($label); ?></a></p>
            <?php endforeach; ?>
            <h2>Sesonger i Storm</h2>
            <ul>
                <?php
                $entries = get_posts(array('post_type' => 'storm_roster_entry', 'post_status' => 'publish', 'posts_per_page' => -1, 'meta_key' => 'storm_person_id', 'meta_value' => $id));
                $seen = array();
                foreach ($entries as $entry) {
                    $season = (int) get_post_meta($entry->ID, 'storm_season_id', true);
                    if (isset($seen[$season]) || get_post_status($season) !== 'publish') { continue; }
                    $seen[$season] = true;
                    echo '<li><a href="' . esc_url(get_permalink($season)) . '">' . esc_html(get_the_title($season)) . '</a> — ' . esc_html((string) get_post_meta($entry->ID, 'storm_position', true)) . '</li>';
                }
                ?>
            </ul>
        </article>
    <?php endwhile; ?>
</main>
<?php get_footer(); ?>
