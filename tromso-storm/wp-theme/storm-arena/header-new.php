<?php
/**
 * Header for Tromsø Storm - Nytt Design 2026/27
 */
$is_en            = (function_exists('storm_arena_get_language') && storm_arena_get_language() === 'en');
$tickets_url      = storm_arena_get_page_url_by_slug('billettpriser', home_url('/billettpriser/'));
$arena_url        = storm_arena_get_page_url_by_slug('besok-arenaen', home_url('/besok-arenaen/'));
$request_uri_path = trim((string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH), '/');
$is_front         = is_front_page() || $request_uri_path === 'en' || empty($request_uri_path);
$home_base        = $is_front ? '' : home_url($is_en ? '/en/' : '/');
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="<?php echo esc_url(storm_arena_asset_url('assets/icons/storm-favicon.ico')); ?>" type="image/x-icon" sizes="80x80">
    <?php wp_head(); ?>
</head>
<body <?php body_class('storm-new-design'); ?>>
<?php wp_body_open(); ?>

<a class="skip-link" href="#main-content"><?php echo $is_en ? 'Skip to content' : 'Hopp til innhold'; ?></a>

<!-- Ambient Dark Arctic Background -->
<div class="ambient-glow-bg" aria-hidden="true"></div>

<!-- 3D PERSPECTIVE BASKETBALL COURT (Sett på skrå fra kurven + midtbane pulsbølger) -->
<div class="court-3d-viewport" aria-hidden="true">
    <div class="court-3d-stage" id="court3dStage">
        <svg viewBox="0 0 1500 2800" class="regulation-court-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
                <radialGradient id="centerJumpPulse" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#F5822B" stop-opacity="0.38" />
                    <stop offset="100%" stop-color="#F5822B" stop-opacity="0" />
                </radialGradient>
            </defs>

            <!-- Subtle Longitudinal Hardwood Board Planks -->
            <rect x="20" y="20" width="1460" height="2760" fill="rgba(14, 18, 24, 0.45)" />
            <line x1="180" y1="20" x2="180" y2="2780" stroke="rgba(237, 241, 247, 0.04)" stroke-width="2" />
            <line x1="340" y1="20" x2="340" y2="2780" stroke="rgba(237, 241, 247, 0.04)" stroke-width="2" />
            <line x1="505" y1="20" x2="505" y2="2780" stroke="rgba(237, 241, 247, 0.04)" stroke-width="2" />
            <line x1="660" y1="20" x2="660" y2="2780" stroke="rgba(237, 241, 247, 0.04)" stroke-width="2" />
            <line x1="840" y1="20" x2="840" y2="2780" stroke="rgba(237, 241, 247, 0.04)" stroke-width="2" />
            <line x1="995" y1="20" x2="995" y2="2780" stroke="rgba(237, 241, 247, 0.04)" stroke-width="2" />
            <line x1="1160" y1="20" x2="1160" y2="2780" stroke="rgba(237, 241, 247, 0.04)" stroke-width="2" />
            <line x1="1320" y1="20" x2="1320" y2="2780" stroke="rgba(237, 241, 247, 0.04)" stroke-width="2" />

            <!-- Outer Court Perimeter (28m x 15m) -->
            <rect x="20" y="20" width="1460" height="2760" fill="none" stroke="rgba(118, 187, 255, 0.45)" stroke-width="7" rx="4" />

            <!-- Center Line & Center Jump Circle (1.8m radius) -->
            <line x1="20" y1="1400" x2="1480" y2="1400" stroke="rgba(118, 187, 255, 0.6)" stroke-width="6" />
            <circle cx="750" cy="1400" r="180" fill="url(#centerJumpPulse)" stroke="#F5822B" stroke-width="6" />
            <circle cx="750" cy="1400" r="45" fill="rgba(245,130,43,0.4)" stroke="#F5822B" stroke-width="4" />

            <!-- EXPANDING CONCENTRIC RADAR RINGS FROM MIDCOURT -->
            <g class="midcourt-radar-system">
                <circle cx="750" cy="1400" r="180" class="radar-wave wave-1" />
                <circle cx="750" cy="1400" r="180" class="radar-wave wave-2" />
            </g>

            <!-- ============================================== -->
            <!-- NORTH HALF (Basket 1, Top Baseline at y=20)   -->
            <!-- ============================================== -->
            <line x1="660" y1="120" x2="840" y2="120" stroke="#EDF1F7" stroke-width="8" stroke-linecap="round" />
            <circle cx="750" cy="157.5" r="22.5" fill="none" stroke="#F5822B" stroke-width="6" />
            <line x1="750" y1="120" x2="750" y2="135" stroke="#CB6417" stroke-width="6" />
            <path d="M 625,157.5 A 125 125 0 0 0 875,157.5" fill="none" stroke="rgba(118, 187, 255, 0.35)" stroke-width="4" stroke-dasharray="6 6" />

            <rect x="505" y="20" width="490" height="560" fill="rgba(23, 28, 36, 0.35)" stroke="rgba(118, 187, 255, 0.55)" stroke-width="6" />
            <line x1="505" y1="580" x2="995" y2="580" stroke="rgba(118, 187, 255, 0.75)" stroke-width="6" />

            <path d="M 570,580 A 180 180 0 0 0 930,580" fill="none" stroke="#F5822B" stroke-width="6" />
            <path d="M 570,580 A 180 180 0 0 1 930,580" fill="none" stroke="rgba(118, 187, 255, 0.45)" stroke-width="5" stroke-dasharray="16 12" />

            <path d="M 90,20 L 90,299 A 675 675 0 0 0 1410,299 L 1410,20" fill="none" stroke="rgba(245, 130, 43, 0.7)" stroke-width="6" />

            <!-- Lane Hash Marks -->
            <line x1="485" y1="175" x2="505" y2="175" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="995" y1="175" x2="1015" y2="175" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="485" y1="260" x2="505" y2="260" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="995" y1="260" x2="1015" y2="260" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="485" y1="345" x2="505" y2="345" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="995" y1="345" x2="1015" y2="345" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="485" y1="430" x2="505" y2="430" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="995" y1="430" x2="1015" y2="430" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />

            <!-- ============================================== -->
            <!-- SOUTH HALF (Basket 2, Bottom Baseline at y=2780)-->
            <!-- ============================================== -->
            <line x1="660" y1="2680" x2="840" y2="2680" stroke="#EDF1F7" stroke-width="8" stroke-linecap="round" />
            <circle cx="750" cy="2642.5" r="22.5" fill="none" stroke="#F5822B" stroke-width="6" />
            <line x1="750" y1="2680" x2="750" y2="2665" stroke="#CB6417" stroke-width="6" />
            <path d="M 625,2642.5 A 125 125 0 0 1 875,2642.5" fill="none" stroke="rgba(118, 187, 255, 0.35)" stroke-width="4" stroke-dasharray="6 6" />

            <rect x="505" y="2220" width="490" height="560" fill="rgba(23, 28, 36, 0.35)" stroke="rgba(118, 187, 255, 0.55)" stroke-width="6" />
            <line x1="505" y1="2220" x2="995" y2="2220" stroke="rgba(118, 187, 255, 0.75)" stroke-width="6" />

            <path d="M 570,2220 A 180 180 0 0 1 930,2220" fill="none" stroke="#F5822B" stroke-width="6" />
            <path d="M 570,2220 A 180 180 0 0 0 930,2220" fill="none" stroke="rgba(118, 187, 255, 0.45)" stroke-width="5" stroke-dasharray="16 12" />

            <path d="M 90,2780 L 90,2501 A 675 675 0 0 1 1410,2501 L 1410,2780" fill="none" stroke="rgba(245, 130, 43, 0.7)" stroke-width="6" />

            <!-- Lane Hash Marks -->
            <line x1="485" y1="2625" x2="505" y2="2625" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="995" y1="2625" x2="1015" y2="2625" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="485" y1="2540" x2="505" y2="2540" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="995" y1="2540" x2="1015" y2="2540" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="485" y1="2455" x2="505" y2="2455" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="995" y1="2455" x2="1015" y2="2455" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="485" y1="2370" x2="505" y2="2370" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
            <line x1="995" y1="2370" x2="1015" y2="2370" stroke="rgba(118, 187, 255, 0.5)" stroke-width="5" />
        </svg>
    </div>
</div>

<!-- SITE WRAPPER -->
<div class="site-wrapper">

    <!-- Design Switcher Top Banner (Trygg reversering med Skjul-knapp) -->
    <aside class="design-switch-banner" id="designSwitchBanner" aria-label="<?php echo $is_en ? 'Design selector' : 'Designvelger'; ?>">
        <div class="design-switch-info">
            <span class="design-badge-active"><?php echo $is_en ? '🔥 NEW PREVIEW 2026/27' : '🔥 NYTT UTKAST 2026/27'; ?></span>
            <span><?php echo $is_en ? '3D Perspective · FIBA Court · Tactical Playbook' : '3D-perspektiv · FIBA-mål · Taktisk Playbook & Vortex'; ?></span>
        </div>
        <div class="design-switch-actions">
            <button type="button" class="background-motion-toggle" id="toggleBackgroundMotion" aria-pressed="false" hidden><?php echo $is_en ? 'Pause background' : 'Pause bakgrunn'; ?></button>
            <span><?php echo $is_en ? 'Prefer original layout?' : 'Liker du ikke designet?'; ?></span>
            <a href="<?php echo esc_url(add_query_arg('design', 'classic')); ?>" class="design-toggle-link"><?php echo $is_en ? '🔄 Switch to Classic design' : '🔄 Bytt til Klassisk design'; ?></a>
            <button type="button" class="btn-dismiss-banner" id="dismissDesignBanner" aria-label="<?php echo $is_en ? 'Hide banner' : 'Skjul banner'; ?>" title="<?php echo $is_en ? 'Hide this draft banner' : 'Skjul dette banneret'; ?>">✕ <?php echo $is_en ? 'Hide' : 'Skjul'; ?></button>
        </div>
    </aside>

    <!-- Floating Restore Pill (kun synlig når banner er skjult) -->
    <button type="button" class="btn-restore-banner" id="restoreDesignBanner" style="display: none;" aria-label="<?php echo $is_en ? 'Show design selector' : 'Vis designvelger'; ?>" title="<?php echo $is_en ? 'Show design selector' : 'Vis designvelger'; ?>">
        🎨 <?php echo $is_en ? 'Design Selector' : 'Designvelger'; ?>
    </button>

    <script>
        (function() {
            var banner = document.getElementById('designSwitchBanner');
            var btnDismiss = document.getElementById('dismissDesignBanner');
            var btnRestore = document.getElementById('restoreDesignBanner');
            if (!banner || !btnDismiss || !btnRestore) return;

            if (sessionStorage.getItem('storm_hide_draft_banner') === '1') {
                banner.style.display = 'none';
                btnRestore.style.display = 'flex';
            }

            btnDismiss.addEventListener('click', function() {
                banner.style.display = 'none';
                btnRestore.style.display = 'flex';
                sessionStorage.setItem('storm_hide_draft_banner', '1');
                btnRestore.focus();
            });

            btnRestore.addEventListener('click', function() {
                banner.style.display = 'flex';
                btnRestore.style.display = 'none';
                sessionStorage.removeItem('storm_hide_draft_banner');
                btnDismiss.focus();
            });
        })();
    </script>

    <!-- Sticky Site Header -->
    <header class="site-header">
        <div class="container nav-flex">
            <a href="<?php echo esc_url(home_url($is_en ? '/en/' : '/')); ?>" class="brand-link" aria-label="<?php echo $is_en ? 'Tromsø Storm home' : 'Tromsø Storm Forside'; ?>">
                <img src="<?php echo esc_url(storm_arena_asset_url('assets/storm-logo.png')); ?>" alt="Tromsø Storm" class="brand-logo-img" width="136" height="74">
                <span class="brand-subline"><?php echo $is_en ? 'BLNO · 69° 40\' N · UVÆR FRA NORD' : 'BLNO · 69° 40\' N · UVÆR FRA NORD'; ?></span>
            </a>

            <nav id="site-nav" class="site-nav" aria-label="<?php echo $is_en ? 'Main navigation' : 'Hovednavigasjon'; ?>">
                <ul class="nav-menu">
                    <li class="nav-item"><a href="<?php echo esc_url($home_base . '#nyheter'); ?>"><?php echo $is_en ? 'News' : 'Nyheter'; ?></a></li>
                    <li class="nav-item"><a href="<?php echo esc_url($home_base . '#kamper'); ?>"><?php echo $is_en ? 'Fixtures' : 'Kamper'; ?></a></li>
                    <li class="nav-item"><a href="<?php echo esc_url($home_base . '#spillere'); ?>"><?php echo $is_en ? 'Roster' : 'Laget'; ?></a></li>
                    <li class="nav-item"><a href="<?php echo esc_url($arena_url); ?>"><?php echo $is_en ? 'Arena' : 'Arena'; ?></a></li>
                    <li class="nav-item"><a href="<?php echo esc_url($home_base . '#samfunn'); ?>"><?php echo $is_en ? 'Community' : 'Samfunn'; ?></a></li>
                    <li class="nav-item"><a href="<?php echo esc_url($home_base . '#partnere'); ?>"><?php echo $is_en ? 'Partners' : 'Partnere'; ?></a></li>
                </ul>
            </nav>

            <div class="header-actions">
                <?php if (function_exists('storm_arena_render_language_switcher')) : ?>
                    <?php storm_arena_render_language_switcher(); ?>
                <?php endif; ?>
                <a href="<?php echo esc_url($tickets_url); ?>" class="btn-ticket-nav"><?php echo $is_en ? 'Buy Tickets' : 'Kjøp Billett'; ?></a>
                <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="<?php echo $is_en ? 'Open mobile menu' : 'Åpne mobilmeny'; ?>"><?php echo $is_en ? 'Menu' : 'Meny'; ?></button>
            </div>
        </div>
    </header>

    <?php if (function_exists('storm_arena_render_live_game_banner')) : ?>
        <?php storm_arena_render_live_game_banner(); ?>
    <?php endif; ?>
