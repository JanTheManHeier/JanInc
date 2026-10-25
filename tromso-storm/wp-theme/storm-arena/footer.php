<?php
if (function_exists('storm_arena_get_active_design') && storm_arena_get_active_design() !== 'classic') {
    get_template_part('footer-new');
    return;
}
?>
<footer class="site-footer">
    <div class="site-footer__inner site-shell">
        <div class="site-footer__brand">
            <img src="<?php echo esc_url(storm_arena_asset_url('assets/storm-logo.png')); ?>" width="250" height="151" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
            <div>
                <strong><?php bloginfo('name'); ?></strong>
                <span><?php bloginfo('description'); ?></span>
                <span>Org.nr. 886 210 752</span>
                <span>Postboks 3621 Guleng, 9278 Tromsø</span>
            </div>
        </div>
        <div class="site-footer__meta">
            <a href="<?php echo esc_url(home_url('/')); ?>">Forside</a>
            <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('arkiv', home_url('/'))); ?>">Om klubben</a>
            <a href="<?php echo esc_url(home_url('/#samfunn')); ?>">Samfunnsengasjement</a>
            <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('besok-arenaen', home_url('/#neste-kamp'))); ?>">Besøk arenaen</a>
            <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('grasrotandelen', 'https://www.norsk-tipping.no/grasrotandelen')); ?>">Grasrotandelen</a>
            <a href="mailto:storm@tromsostorm.no">storm@tromsostorm.no</a>
        </div>
        <div class="site-footer__nav">
            <?php storm_arena_render_navigation('secondary-menu'); ?>
        </div>
        <div class="site-footer__app">
            <button class="button secondary" type="button" data-install-app hidden>Installer Storm på mobilen</button>
            <p class="install-help" data-install-help hidden></p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
