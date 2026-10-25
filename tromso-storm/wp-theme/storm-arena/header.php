<?php
if (function_exists('storm_arena_get_active_design') && storm_arena_get_active_design() !== 'classic') {
    get_template_part('header-new');
    return;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="<?php echo esc_url(storm_arena_asset_url('assets/icons/storm-favicon.ico')); ?>" type="image/x-icon" sizes="80x80">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main-content">Hopp til innhold</a>
<?php if (function_exists('storm_arena_get_active_design') && storm_arena_get_active_design() === 'classic') : ?>
    <aside style="background: #090B0E; border-bottom: 1px solid rgba(245, 130, 43, 0.4); padding: 8px 16px; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center; z-index: 999; position: relative;">
        <span style="color: #AAB4C4;">Visning: 🏛️ <strong>Klassisk design</strong> (Aktiv)</span>
        <a href="<?php echo esc_url(add_query_arg('design', 'new')); ?>" style="color: #F5822B; text-decoration: none; font-weight: 700; background: rgba(245, 130, 43, 0.15); padding: 4px 10px; border-radius: 4px; border: 1px solid #F5822B;">⚡ Bytt til Nytt Utkast 2026/27 &rarr;</a>
    </aside>
<?php endif; ?>
<header class="site-header">
    <div class="site-header__inner">
        <a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
            <img src="<?php echo esc_url(storm_arena_asset_url('assets/storm-logo.png')); ?>" width="250" height="151" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
        </a>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Meny</button>
        <nav id="site-nav" class="site-nav" aria-label="<?php esc_attr_e('Hovedmeny', 'storm-arena'); ?>">
            <?php storm_arena_render_navigation('primary-menu'); ?>
        </nav>
        <?php storm_arena_render_language_switcher(); ?>
    </div>
</header>
<?php storm_arena_render_live_game_banner(); ?>
