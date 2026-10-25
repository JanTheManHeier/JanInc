<?php
/**
 * Template for Tromsø Storm - Nytt Utkast 2026/27
 */

$is_en             = (function_exists('storm_arena_get_language') && storm_arena_get_language() === 'en');
$news_query        = new WP_Query(array('post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 3, 'ignore_sticky_posts' => true));
$matches           = storm_arena_get_schedule_entries('storm-current-fixtures');
$next_match        = storm_arena_get_next_match($matches);
$latest_result     = null;
if (storm_arena_managed_content()) {
    foreach (array_reverse($matches) as $match) {
        if (($match['status'] ?? '') === 'finished') {
            $latest_result = $match;
            break;
        }
    }
}
$players           = storm_arena_get_roster_entries('storm-current-roster');
$players_by_name   = array();
foreach ($players as $player) {
    $players_by_name[remove_accents(mb_strtolower($player['name']))] = $player;
}

$featured_names = array(
    'grant sitton',
    'johannes rydningen lange',
    'garrett denbow',
    'anders solem',
);

$featured_players = array();
foreach ($featured_names as $name) {
    $key = remove_accents(mb_strtolower($name));
    if (isset($players_by_name[$key])) {
        $featured_players[] = $players_by_name[$key];
    }
}

if (count($featured_players) < 4) {
    $selected_names = array_map(
        static fn(array $player): string => remove_accents(mb_strtolower($player['name'])),
        $featured_players
    );
    foreach ($players as $player) {
        if (in_array(remove_accents(mb_strtolower($player['name'])), $selected_names, true)) {
            continue;
        }
        $featured_players[] = $player;
        $selected_names[] = remove_accents(mb_strtolower($player['name']));
        if (count($featured_players) === 4) {
            break;
        }
    }
}

$coaches           = storm_arena_get_coach_entries('storm-current-coaches');
$standings         = storm_arena_get_standings();
$main_sponsors     = storm_arena_get_featured_sponsors();
$secondarySponsors = storm_arena_get_secondary_sponsors();
if (empty($secondarySponsors)) {
    $secondarySponsors = $main_sponsors;
}
$tickets_url       = storm_arena_get_page_url_by_slug('billettpriser', home_url('/billettpriser/'));
$arena_url         = storm_arena_get_page_url_by_slug('besok-arenaen', home_url('/besok-arenaen/'));
$calendar_url      = home_url('/storm-kamper.ics');

$social_posts      = array(
    array(
        'platform' => 'Facebook',
        'title'   => 'Vi drar til Luleå for å bli bedre',
        'excerpt' => 'Sergio Vicente Beleña og laget utfordrer seg mot sterke motstandere for å bygge identitet og ta nye steg sammen.',
        'date'    => '2026-09-04',
        'label'   => '4. september 2026',
        'url'     => 'https://www.facebook.com/photo/?fbid=1920368579135036&set=pb.100034857381074.-2207520000',
        'image'   => 'assets/social/lulea-utfordring.webp',
        'alt'     => 'Sitat fra hovedtrener Sergio Vicente Beleña om å utfordre BC Luleå',
    ),
    array(
        'platform' => 'Facebook',
        'title'   => 'Importspillerne er på plass',
        'excerpt' => 'Garrett Denbow og Grant Sitton har ankommet Tromsø og er klare for sin første sesong med Storm.',
        'date'    => '2026-09-01',
        'label'   => '1. september 2026',
        'url'     => 'https://www.facebook.com/photo/?fbid=1917378292767398&set=pb.100034857381074.-2207520000',
        'image'   => 'assets/social/importene-er-her.webp',
        'alt'     => 'Velkomstgrafikk for Garrett Denbow og Grant Sitton',
    ),
    array(
        'platform' => 'Instagram',
        'title'   => 'En ny æra begynner i nord',
        'excerpt' => 'Ny identitet, mer energi og større ambisjoner. Samme by og samme lidenskap – et nytt kapittel for Tromsø Storm.',
        'date'    => '2026-08-03',
        'label'   => '3. august 2026',
        'url'     => 'https://www.instagram.com/tromsostorm/p/DblezLCDbhY/',
        'image'   => 'assets/social/ny-aera.webp',
        'alt'     => 'Tromsø Storm-grafikk med budskapet En ny æra for Tromsø Storm',
    ),
    array(
        'platform' => 'Instagram',
        'title'   => 'Vårt nye hjem',
        'excerpt' => 'Sesongoppkjøringen fortsetter i Rødtindhallen, Tromsø Storms nye hjemmebane.',
        'date'    => '2026-08-17',
        'label'   => '17. august 2026',
        'url'     => 'https://www.instagram.com/tromsostorm/p/DcIqqfMiGX-/',
        'image'   => 'assets/social/rodtindhallen.webp',
        'alt'     => 'Tromsø Storm-grafikk som presenterer Rødtindhallen som klubbens nye hjem',
    ),
);

if (storm_arena_managed_content()) {
    $social_posts = storm_arena_resolve_core_images(Storm_Core_Content::social(), 'image');
    $featured_players = array_slice(array_values(array_filter($players, static fn(array $player): bool => !empty($player['featured']))), 0, 4);
    foreach ($players as $player) {
        if (count($featured_players) >= 4) {
            break;
        }
        if (!in_array($player['id'], array_column($featured_players, 'id'), true)) {
            $featured_players[] = $player;
        }
    }
}
$editorial_hero = class_exists('Storm_Core_Editorial') ? Storm_Core_Editorial::page('hero') : null;
$hero_image = $editorial_hero ? get_the_post_thumbnail_url($editorial_hero->ID, 'large') : '';

get_header('new');
?>

<main id="main-content">

    <!-- ================================================================= -->
    <!-- SECTION 1: HERO (HEADLINE + INSTAGRAM FØRSTEBILDE + NEXT MATCH)   -->
    <!-- ================================================================= -->
    <section id="hero" class="section-hero">
        <div class="container">
            <div class="hero-layout-grid">
                
                <!-- Left: Headline & Intro -->
                <div class="hero-info-side">
                    <div class="hero-pill-badge">
                        <span class="badge-pulsing-dot"></span>
                        <span><?php echo $is_en ? 'A STORM FROM THE NORTH · BLNO ELITE' : 'UVÆR FRA NORD · BLNO ELITE'; ?></span>
                    </div>

                    <h1 class="hero-main-heading">
                        <?php if ($editorial_hero) : ?>
                            <?php echo esc_html($editorial_hero->post_title); ?>
                        <?php elseif ($is_en) : ?>
                            THE STORM<br>
                            <span class="hero-orange-accent">HITS THE NORTH</span>
                        <?php else : ?>
                            STORMEN<br>
                            <span class="hero-orange-accent">RAMMER NORDEN</span>
                        <?php endif; ?>
                    </h1>

                    <p class="hero-lead-text">
                        <?php if ($editorial_hero) : ?>
                            <?php echo esc_html(wp_strip_all_tags($editorial_hero->post_excerpt ?: $editorial_hero->post_content)); ?>
                        <?php elseif ($is_en) : ?>
                            Northern Norway's premier basketball club competing for the BLNO championship. Hard-nosed defense, relentless tempo, and Norway's most feared Arctic home court with dark Arena identity and Tromsø Storm's signature orange.
                        <?php else : ?>
                            Ishavsbyens basketballstolthet kjemper om BLNO-tittelen. Knallhardt tempo, disiplinert forsvarsmur og Norges mest fryktede arktiske hjemmebane med mørk Arena-identitet og Tromsø Storms oransje signatur.
                        <?php endif; ?>
                    </p>

                    <div class="hero-action-buttons">
                        <a href="<?php echo esc_url($tickets_url); ?>" class="btn-primary-hero"><?php echo $is_en ? 'Tickets' : 'Billetter'; ?></a>
                        <a href="#kamper" class="btn-secondary-hero"><?php echo $is_en ? 'View Schedule' : 'Se Terminliste'; ?></a>
                    </div>
                </div>

                <!-- Right: Hero Lead Visual Photo ("førstebildet" from Instagram) -->
                <div class="hero-visual-side">
                    <div class="hero-image-card">
                        <img src="<?php echo esc_url($hero_image ?: storm_arena_asset_url('assets/hero-team-blno.png')); ?>" alt="<?php echo esc_attr($editorial_hero ? get_post_meta(get_post_thumbnail_id($editorial_hero->ID), '_wp_attachment_image_alt', true) : 'Tromsø Storm - Vi er tilbake i BLNO'); ?>" class="hero-lead-photo" width="1239" height="1229" fetchpriority="high">
                        <div class="hero-photo-glow-edge"></div>
                        <div class="hero-photo-overlay-badge">
                            <span class="photo-badge-dot"></span>
                            <span><?php echo esc_html('BLNO ' . storm_arena_get_current_season_label() . ' · RØDTINDHALLEN'); ?></span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- HOVEDSPONSORER I HERO (KRAV: ALLTID GODT SYNLIG - PLASSERT HØYT OPP) -->
            <div class="hero-sponsors-strip" aria-label="<?php echo $is_en ? 'Tromsø Storm Main Sponsors' : 'Tromsø Storms hovedsponsorer'; ?>">
                <span class="hero-sponsors-label"><?php echo $is_en ? 'Main Partners // Proud Partners' : 'Hovedsamarbeidspartnere // Proud Partners'; ?></span>
                <div class="hero-sponsors-logos">
                    <?php if (!empty($main_sponsors)) : ?>
                        <?php foreach ($main_sponsors as $sponsor) : ?>
                            <a class="hero-sponsor-tile" href="<?php echo esc_url($sponsor['link_url'] ?: '#partnere'); ?>"<?php echo empty($sponsor['link_url']) || storm_arena_is_internal_url($sponsor['link_url']) ? '' : ' rel="noopener noreferrer" target="_blank"'; ?>>
                                <?php if (!empty($sponsor['logo_url'])) : ?>
                                    <img src="<?php echo esc_url($sponsor['logo_url']); ?>" alt="<?php echo esc_attr($sponsor['name']); ?>">
                                <?php else : ?>
                                    <span><?php echo esc_html($sponsor['name']); ?></span>
                                <?php endif; ?>
                            </a>
                        <?php endforeach; ?>
                    <?php elseif (!storm_arena_managed_content()) : ?>
                        <div class="hero-sponsor-tile"><img src="<?php echo esc_url(storm_arena_asset_url('assets/jekta.png')); ?>" alt="Jekta Storsenter"></div>
                        <div class="hero-sponsor-tile"><img src="<?php echo esc_url(storm_arena_asset_url('assets/extra.png')); ?>" alt="Extra"></div>
                        <div class="hero-sponsor-tile"><img src="<?php echo esc_url(storm_arena_asset_url('assets/bedsys.png')); ?>" alt="Bedsys"></div>
                        <div class="hero-sponsor-tile"><img src="<?php echo esc_url(storm_arena_asset_url('assets/hermes.png')); ?>" alt="Hermes AS"></div>
                        <div class="hero-sponsor-tile"><img src="<?php echo esc_url(storm_arena_asset_url('assets/snn.png')); ?>" alt="SpareBank 1 Nord-Norge"></div>
                    <?php endif; ?>
                </div>
            </div>

        </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 2: NESTE KAMP & SISTE NYTT (SIDE BY SIDE)                 -->
    <!-- ================================================================= -->
    <section id="kamp-og-nyheter" class="section-match-news-hub">
        <div class="container">
            <div class="match-news-side-by-side-grid">

                <!-- Left: Neste Kamp Countdown Card -->
                <div class="hub-match-col" id="neste-kamp">
                    <?php if ($next_match !== null && $next_match['date'] instanceof DateTimeInterface) : ?>
                        <?php
                        $match_now = storm_arena_managed_content() ? time() : current_time('timestamp');
                        $days_remaining = (int) ceil(($next_match['timestamp'] - $match_now) / DAY_IN_SECONDS);
                        if ($is_en) {
                            $countdown_label = $days_remaining <= 0 ? 'GAMEDAY TODAY' : $days_remaining . ' DAYS TO TIP-OFF';
                        } else {
                            $countdown_label = $days_remaining <= 0 ? 'KAMPDAG I DAG' : $days_remaining . ' DAGER IGJEN';
                        }
                        $home_name = is_array($next_match['home']) ? ($next_match['home']['name'] ?? 'Tromsø Storm') : $next_match['home'];
                        $away_name = is_array($next_match['away']) ? ($next_match['away']['name'] ?? 'Motstander') : $next_match['away'];
                        $home_logo = storm_arena_get_team_logo_asset($home_name);
                        $away_logo = storm_arena_get_team_logo_asset($away_name);
                        ?>
                        <div class="section-header-block" style="margin-bottom: 20px;">
                            <div>
                                <h2 class="section-title"><?php echo $is_en ? 'Next Game' : 'Neste Kamp'; ?></h2>
                                <p class="section-subtitle"><?php echo $is_en ? 'BLNO REGULAR SEASON' : 'BLNO GRUNNSERIE'; ?></p>
                            </div>
                            <span class="section-meta-tag"><?php echo esc_html($countdown_label); ?></span>
                        </div>

                        <div class="next-match-card">
                            <div class="next-match-header">
                                <span class="match-league-label">BLNO · <?php echo esc_html($countdown_label); ?></span>
                                <span class="match-arena-label"><?php echo esc_html($next_match['venue'] ?: 'RØDTINDHALLEN'); ?></span>
                            </div>

                            <div class="match-faceoff-visual">
                                <div class="team-side home">
                                    <div class="team-crest-orb">
                                        <?php if (!empty($home_logo)) : ?>
                                            <img src="<?php echo esc_url(storm_arena_asset_url($home_logo)); ?>" alt="<?php echo esc_attr($home_name); ?>">
                                        <?php else : ?>
                                            <img src="<?php echo esc_url(storm_arena_asset_url('assets/storm-logo.png')); ?>" alt="Tromsø Storm">
                                        <?php endif; ?>
                                    </div>
                                    <span class="team-title-text"><?php echo esc_html($home_name); ?></span>
                                    <span class="team-badge-tag"><?php echo esc_html($next_match['date']->format('H:i')); ?></span>
                                </div>

                                <div class="vs-ring-circle">VS</div>

                                <div class="team-side away">
                                    <div class="team-crest-orb">
                                        <?php if (!empty($away_logo)) : ?>
                                            <img src="<?php echo esc_url(storm_arena_asset_url($away_logo)); ?>" alt="<?php echo esc_attr($away_name); ?>">
                                        <?php else : ?>
                                            <img src="<?php echo esc_url(storm_arena_asset_url('assets/opponents/froya.png')); ?>" alt="Motstander" onerror="this.src='<?php echo esc_url(storm_arena_asset_url('assets/storm-logo.png')); ?>'">
                                        <?php endif; ?>
                                    </div>
                                    <span class="team-title-text"><?php echo esc_html($away_name); ?></span>
                                    <span class="team-badge-tag"><?php echo esc_html(storm_arena_format_short_date($next_match['date'])); ?></span>
                                </div>
                            </div>

                            <!-- Live Countdown Display -->
                            <div class="countdown-digital-container">
                                <div class="countdown-heading-tag"><?php echo $is_en ? 'TIP-OFF IN // COUNTDOWN' : 'AVKAST OM // COUNTDOWN'; ?></div>
                                <div class="countdown-clock-grid">
                                    <div class="clock-segment">
                                        <span class="clock-number" id="cdDays">--</span>
                                        <span class="clock-unit-label"><?php echo $is_en ? 'Days' : 'Dager'; ?></span>
                                    </div>
                                    <div class="clock-segment">
                                        <span class="clock-number" id="cdHours">--</span>
                                        <span class="clock-unit-label"><?php echo $is_en ? 'Hours' : 'Timer'; ?></span>
                                    </div>
                                    <div class="clock-segment">
                                        <span class="clock-number" id="cdMins">--</span>
                                        <span class="clock-unit-label"><?php echo $is_en ? 'Minutes' : 'Minutter'; ?></span>
                                    </div>
                                    <div class="clock-segment">
                                        <span class="clock-number" id="cdSecs">--</span>
                                        <span class="clock-unit-label"><?php echo $is_en ? 'Seconds' : 'Sekunder'; ?></span>
                                    </div>
                                </div>
                            </div>

                            <div class="match-footer-actions">
                                <a href="<?php echo esc_url($next_match['ticket_url'] ?? '' ?: $tickets_url); ?>" class="btn-card-ticket"><?php echo $is_en ? 'Buy Match Ticket &rarr;' : 'Kjøp Kampbillett &rarr;'; ?></a>
                                <a href="<?php echo esc_url($calendar_url); ?>" download="tromso-storm.ics" class="btn-card-cal" title="<?php echo $is_en ? 'Add to your calendar' : 'Legg til i din kalender'; ?>">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <script>
                            // Initialize Countdown Target from WP Match Timestamp
                            (function() {
                                var matchTimestamp = <?php echo (int) $next_match['timestamp'] * 1000; ?>;
                                function tick() {
                                    var now = new Date().getTime();
                                    var diff = matchTimestamp - now;
                                    if (diff > 0) {
                                        var d = Math.floor(diff / (1000 * 60 * 60 * 24));
                                        var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                                        var m = Math.floor((diff / (1000 * 60)) % 60);
                                        var s = Math.floor((diff / 1000) % 60);
                                        var elD = document.getElementById('cdDays');
                                        var elH = document.getElementById('cdHours');
                                        var elM = document.getElementById('cdMins');
                                        var elS = document.getElementById('cdSecs');
                                        if (elD) elD.textContent = String(d).padStart(2, '0');
                                        if (elH) elH.textContent = String(h).padStart(2, '0');
                                        if (elM) elM.textContent = String(m).padStart(2, '0');
                                        if (elS) elS.textContent = String(s).padStart(2, '0');
                                    } else {
                                        var elD = document.getElementById('cdDays');
                                        if (elD) elD.textContent = '00';
                                    }
                                }
                                setInterval(tick, 1000);
                                tick();
                            })();
                        </script>
                    <?php elseif (!storm_arena_managed_content()) : ?>
                        <!-- Fallback next match presentation -->
                        <div class="section-header-block" style="margin-bottom: 20px;">
                            <div>
                                <h2 class="section-title"><?php echo $is_en ? 'Next Game' : 'Neste Kamp'; ?></h2>
                                <p class="section-subtitle"><?php echo $is_en ? 'BLNO REGULAR SEASON' : 'BLNO GRUNNSERIE'; ?></p>
                            </div>
                            <span class="section-meta-tag"><?php echo $is_en ? 'OPENER' : 'SESONGÅPNING'; ?></span>
                        </div>
                        <div class="next-match-card">
                            <div class="next-match-header">
                                <span class="match-league-label">BLNO · <?php echo $is_en ? 'SEASON OPENER' : 'SESONGÅPNING'; ?></span>
                                <span class="match-arena-label">RØDTINDHALLEN</span>
                            </div>
                            <div class="match-faceoff-visual">
                                <div class="team-side home">
                                    <div class="team-crest-orb">
                                        <img src="<?php echo esc_url(storm_arena_asset_url('assets/storm-logo.png')); ?>" alt="Tromsø Storm">
                                    </div>
                                    <span class="team-title-text">Tromsø Storm</span>
                                    <span class="team-badge-tag"><?php echo $is_en ? 'Home' : 'Hjemmelag'; ?></span>
                                </div>
                                <div class="vs-ring-circle">VS</div>
                                <div class="team-side">
                                    <div class="team-crest-orb">
                                        <img src="<?php echo esc_url(storm_arena_asset_url('assets/opponents/froya.png')); ?>" alt="Frøya Basket">
                                    </div>
                                    <span class="team-title-text">Frøya Basket</span>
                                    <span class="team-badge-tag"><?php echo $is_en ? 'Away' : 'Gjestelag'; ?></span>
                                </div>
                            </div>
                            <div class="match-footer-actions">
                                <a href="<?php echo esc_url($tickets_url); ?>" class="btn-card-ticket"><?php echo $is_en ? 'Buy Match Ticket &rarr;' : 'Kjøp Kampbillett &rarr;'; ?></a>
                                <a href="<?php echo esc_url($calendar_url); ?>" download="tromso-storm.ics" class="btn-card-cal" title="<?php echo $is_en ? 'Add to calendar' : 'Legg til i kalender'; ?>">📅</a>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Right: Siste Nytt Column -->
                <div class="hub-news-col" id="nyheter">
                    <div class="section-header-block" style="margin-bottom: 20px;">
                        <div>
                            <h2 class="section-title"><?php echo $is_en ? 'Latest News' : 'Siste Nytt'; ?></h2>
                            <p class="section-subtitle"><?php echo $is_en ? 'FROM THE STORM' : 'FRA STORMEN'; ?></p>
                        </div>
                        <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('arkiv', home_url('/page/2/'))); ?>" class="section-meta-tag" style="text-decoration: none;"><?php echo $is_en ? 'All News &rarr;' : 'Alle Nyheter &rarr;'; ?></a>
                    </div>

                    <div class="news-side-stack">
                        <?php if ($news_query->have_posts()) : ?>
                            <?php $news_count = 0; ?>
                            <?php while ($news_query->have_posts() && $news_count < 2) : $news_query->the_post(); $news_count++; ?>
                                <article class="news-side-card">
                                    <div class="news-side-thumb">
                                        <?php storm_arena_render_post_image(get_the_ID(), $news_count - 1); ?>
                                    </div>
                                    <div class="news-side-content">
                                        <div class="news-side-meta">
                                            <?php
                                            $categories = get_the_category();
                                            if (!empty($categories)) {
                                                echo esc_html($categories[0]->name) . ' · ';
                                            }
                                            echo esc_html(get_the_date('j. F Y'));
                                            ?>
                                        </div>
                                        <h3 class="news-side-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                                        <p class="news-side-excerpt">
                                            <?php echo esc_html(wp_trim_words(wp_strip_all_tags(get_the_excerpt() ?: get_the_content(null, false)), 16)); ?>
                                        </p>
                                        <a href="<?php the_permalink(); ?>" class="news-side-link" aria-label="<?php echo esc_attr(($is_en ? 'Read article: ' : 'Les saken: ') . get_the_title()); ?>"><?php echo $is_en ? 'Read article &rarr;' : 'Les saken &rarr;'; ?></a>
                                    </div>
                                </article>
                            <?php endwhile; ?>
                            <?php wp_reset_postdata(); ?>
                        <?php else : ?>
                            <article class="news-side-card">
                                <div class="news-side-thumb">
                                    <img src="<?php echo esc_url(storm_arena_asset_url('assets/hero-action-900.webp')); ?>" alt="Storm nyhet">
                                </div>
                                <div class="news-side-content">
                                    <span class="news-side-meta">BLNO 2026/27</span>
                                    <h3 class="news-side-title">Uværet fra nord er tilbake</h3>
                                    <p class="news-side-excerpt">Tromsø Storm er klare for en ny sesong med høyt tempo og sterke ambisjoner.</p>
                                    <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('arkiv', home_url('/page/2/'))); ?>" class="news-side-link">Les mer &rarr;</a>
                                </div>
                            </article>
                        <?php endif; ?>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 2: CINEMATIC LATEST MATCH RESULT (VORTEX STYLE)           -->
    <!-- ================================================================= -->
    <?php if (storm_arena_managed_content()) : ?>
    <section id="resultat" class="section-result">
        <div class="container">
            <h2 class="section-title"><?php echo $is_en ? 'Latest Game Result' : 'Siste kampresultat'; ?></h2>
            <?php if ($latest_result) : ?>
                <div class="result-cinematic-card">
                    <div class="score-cinematic-board">
                        <p><?php echo esc_html(storm_arena_format_short_date($latest_result['date']) . ' · ' . $latest_result['venue']); ?></p>
                        <div class="big-score-row">
                            <div class="big-team-cell"><span class="big-team-name"><?php echo esc_html($latest_result['home']); ?></span><span class="big-score-num"><?php echo esc_html($latest_result['home_score']); ?></span></div>
                            <div class="score-dash-badge"><?php echo $is_en ? 'FINAL' : 'SLUTT'; ?></div>
                            <div class="big-team-cell"><span class="big-team-name"><?php echo esc_html($latest_result['away']); ?></span><span class="big-score-num opponent"><?php echo esc_html($latest_result['away_score']); ?></span></div>
                        </div>
                        <a href="<?php echo esc_url($latest_result['url']); ?>"><?php echo $is_en ? 'Game details' : 'Se kampdetaljer'; ?> &rarr;</a>
                    </div>
                </div>
            <?php else : ?>
                <p><?php echo $is_en ? 'No results have been published for this season.' : 'Ingen resultater er publisert for denne sesongen ennå.'; ?></p>
            <?php endif; ?>
        </div>
    </section>
    <?php else : ?>
    <section id="resultat" class="section-result">
        <div class="container">
            <div class="section-header-block">
                <div>
                    <h2 class="section-title"><?php echo $is_en ? 'Latest Game Result' : 'Siste Kampresultat'; ?></h2>
                    <p class="section-subtitle"><?php echo $is_en ? 'PRE-SEASON FRIENDLY · LULEÅ ENERGI ARENA' : 'TRENINGSKAMP · LULEÅ ENERGI ARENA'; ?></p>
                </div>
                <span class="section-meta-tag"><?php echo $is_en ? 'FULL TIME · VICTORY' : 'FULL TID · SEIER'; ?></span>
            </div>

            <div class="result-cinematic-card">
                <div class="score-cinematic-board">
                    <div class="score-match-meta">
                        <time datetime="2026-09-06T11:00"><?php echo $is_en ? '6 SEPTEMBER 2026 · 11:00' : '6. SEPTEMBER 2026 · KL. 11:00'; ?></time>
                        <span><?php echo $is_en ? 'LULEÅ, SWEDEN · AWAY' : 'LULEÅ, SVERIGE · BORTEKAMP'; ?></span>
                    </div>

                    <div class="big-score-row">
                        <div class="big-team-cell">
                            <span class="big-team-name">Tromsø Storm</span>
                            <span class="big-score-num">88</span>
                        </div>

                        <div class="score-dash-badge"><?php echo $is_en ? 'FINAL' : 'SLUTT'; ?></div>

                        <div class="big-team-cell">
                            <span class="big-team-name">BC Luleå Steelers</span>
                            <span class="big-score-num opponent">78</span>
                        </div>
                    </div>

                    <p class="match-report-summary"><?php echo $is_en ? 'Storm ended the weekend in Luleå with a win. Valuable minutes and another useful test ahead of the season, with experience to build on together.' : 'Helgen i Luleå ble avsluttet med seier. Nye verdifulle minutter i beina og enda en god test før sesongstart. Laget tar med seg erfaringene og bygger videre sammen.'; ?></p>
                    <p class="match-report-source"><?php echo $is_en ? 'Source: Tromsø Storm on Facebook, 6 September 2026. Quarter scores and individual statistics were not included in the post.' : 'Kilde: Tromsø Storm på Facebook, 6. september 2026. Innlegget oppgir ikke perioderesultater eller individuell statistikk.'; ?></p>
                </div>

                <!-- Coach's comment from the club's post-match Facebook post -->
                <div class="spotlight-player-wrap">
                    <div class="spotlight-photo-orb">
                        <img src="<?php echo esc_url(storm_arena_asset_url('assets/players/sergio-bele-a.jpg')); ?>" alt="Sergio Vicente Beleña">
                    </div>
                    <div class="spotlight-details">
                        <span class="spotlight-role"><?php echo $is_en ? 'HEAD COACH · AFTER THE GAME' : 'HOVEDTRENER · ETTER KAMPEN'; ?></span>
                        <h3 class="spotlight-name">Sergio Vicente Beleña</h3>
                        <blockquote class="match-report-quote">
                            <p><?php echo $is_en ? '“It was a good game for everyone to get minutes and for us to see how they perform in competition.”' : '«Det var en god kamp for å gi alle spillerne minutter og se hvordan de presterer i kamp.»'; ?></p>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ================================================================= -->
    <?php endif; ?>
    <!-- SECTION 3: FIXTURES / TERMINLISTE                                  -->
    <!-- ================================================================= -->
    <section id="kamper" class="section-fixtures">
        <div class="container">
            <div class="section-header-block">
                <div>
                    <h2 class="section-title"><?php echo $is_en ? 'Upcoming Fixtures' : 'Kommende Kamper'; ?></h2>
                    <p class="section-subtitle">BLNO <?php echo esc_html(storm_arena_get_current_season_label()); ?></p>
                </div>
                <div class="fixtures-filter-bar">
                    <button class="filter-btn active" aria-pressed="true" onclick="filterFixtures('all', this)"><?php echo $is_en ? 'All' : 'Alle'; ?></button>
                    <button class="filter-btn" aria-pressed="false" onclick="filterFixtures('home', this)"><?php echo $is_en ? 'Home' : 'Hjemme'; ?></button>
                    <button class="filter-btn" aria-pressed="false" onclick="filterFixtures('away', this)"><?php echo $is_en ? 'Away' : 'Borte'; ?></button>
                </div>
            </div>

            <div class="fixtures-grid">
                <?php if (!empty($matches)) : ?>
                    <?php
                    $rendered_count = 0;
                    foreach ($matches as $match) :
                        if (storm_arena_managed_content() && (in_array($match['status'] ?? '', array('finished', 'cancelled', 'postponed'), true)
                            || ($match['date'] instanceof DateTimeInterface && $match['date']->getTimestamp() < time() && ($match['status'] ?? '') !== 'live'))) {
                            continue;
                        }
                        if ($rendered_count >= 6) break;
                        $m_home = is_array($match['home']) ? ($match['home']['name'] ?? 'Tromsø Storm') : $match['home'];
                        $m_away = is_array($match['away']) ? ($match['away']['name'] ?? 'Motstander') : $match['away'];
                        $is_home = !empty($match['is_home']) || (function_exists('storm_arena_is_team_home') && storm_arena_is_team_home($m_home));
                        $venue_type = $is_home ? 'home' : 'away';
                        $date_str = $match['date'] instanceof DateTimeInterface ? storm_arena_format_short_date($match['date']) . ' · ' . $match['date']->format('H:i') : 'Dato TBA';
                        $opp_name = $is_home ? $m_away : $m_home;
                        $opp_logo = function_exists('storm_arena_get_team_logo_asset') ? storm_arena_get_team_logo_asset($opp_name) : '';
                    ?>
                        <div class="fixture-card <?php echo esc_attr($venue_type); ?>" data-venue="<?php echo esc_attr($venue_type); ?>">
                            <div class="fixture-meta">
                                <span><?php echo esc_html(mb_strtoupper($date_str)); ?></span>
                                <span style="color: <?php echo $is_home ? 'var(--storm-orange)' : 'var(--aurora-ice)'; ?>;"><?php echo esc_html($match['venue'] ?: ($is_home ? 'Rødtindhallen' : 'Bortebane')); ?></span>
                            </div>
                            <div class="fixture-matchup">
                                <div class="fixture-teams">
                                    <span class="fixture-team-name <?php echo $is_home ? 'highlight' : ''; ?>"><?php echo esc_html($m_home); ?></span>
                                    <span class="fixture-team-name <?php echo !$is_home ? 'highlight' : ''; ?>"><?php echo esc_html($m_away); ?></span>
                                </div>
                                <div class="fixture-opponent-logo">
                                    <?php if (!empty($opp_logo)) : ?>
                                        <img src="<?php echo esc_url(storm_arena_asset_url($opp_logo)); ?>" alt="<?php echo esc_attr($opp_name); ?>">
                                    <?php else : ?>
                                        <img src="<?php echo esc_url(storm_arena_asset_url('assets/storm-mark.svg')); ?>" alt="BLNO">
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="fixture-footer">
                                <span class="fixture-venue"><?php echo esc_html($is_home ? 'Hjemmekamp' : 'Bortekamp'); ?></span>
                                <?php if ($is_home) : ?>
                                    <a href="<?php echo esc_url(($match['ticket_url'] ?? '') ?: $tickets_url); ?>" class="fixture-link">Kjøp Billett &rarr;</a>
                                <?php else : ?>
                                    <span class="fixture-link" style="color: var(--aurora-ice);">TV 2 Play</span>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php
                        $rendered_count++;
                    endforeach;
                    if ($rendered_count === 0) {
                        echo '<p>' . esc_html($is_en ? 'No upcoming games have been published.' : 'Ingen kommende kamper er publisert ennå.') . '</p>';
                    }
                    ?>
                <?php elseif (!storm_arena_managed_content()) : ?>
                    <!-- Fallback Fixture Cards -->
                    <div class="fixture-card home" data-venue="home">
                        <div class="fixture-meta">
                            <span>FREDAG 18. SEP · 19:30</span>
                            <span style="color: var(--storm-orange);">Rødtindhallen</span>
                        </div>
                        <div class="fixture-matchup">
                            <div class="fixture-teams">
                                <span class="fixture-team-name highlight">Tromsø Storm</span>
                                <span class="fixture-team-name">Frøya Basket</span>
                            </div>
                            <div class="fixture-opponent-logo">
                                <img src="<?php echo esc_url(storm_arena_asset_url('assets/opponents/froya.png')); ?>" alt="Frøya">
                            </div>
                        </div>
                        <div class="fixture-footer">
                            <span class="fixture-venue">Sesongåpning</span>
                            <a href="<?php echo esc_url($tickets_url); ?>" class="fixture-link">Kjøp Billett &rarr;</a>
                        </div>
                    </div>
                    <div class="fixture-card away" data-venue="away">
                        <div class="fixture-meta">
                            <span>LØRDAG 26. SEP · 15:00</span>
                            <span style="color: var(--aurora-ice);">Fyllingsdalen</span>
                        </div>
                        <div class="fixture-matchup">
                            <div class="fixture-teams">
                                <span class="fixture-team-name">Fyllingen Lions</span>
                                <span class="fixture-team-name highlight">Tromsø Storm</span>
                            </div>
                            <div class="fixture-opponent-logo">
                                <img src="<?php echo esc_url(storm_arena_asset_url('assets/opponents/fyllingen.webp')); ?>" alt="Fyllingen">
                            </div>
                        </div>
                        <div class="fixture-footer">
                            <span class="fixture-venue">Bergen</span>
                            <span class="fixture-link" style="color: var(--aurora-ice);">TV 2 Play</span>
                        </div>
                    </div>
                <?php else : ?>
                    <p><?php echo $is_en ? 'No upcoming games have been published.' : 'Ingen kommende kamper er publisert ennå.'; ?></p>
                <?php endif; ?>
            </div>
            <div style="margin-top: 24px; display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
                <a href="<?php echo esc_url($is_en ? home_url('/en/kampoversikt/') : storm_arena_get_page_url_by_slug('kampoversikt', home_url('/kampoversikt/'))); ?>" class="btn-primary-hero"><?php echo $is_en ? 'View all games &rarr;' : 'Se alle kamper &rarr;'; ?></a>
                <a href="<?php echo esc_url($calendar_url); ?>" download class="btn-secondary-hero" style="display: inline-block;"><?php echo $is_en ? '📅 Add fixtures to your calendar (.ics)' : '📅 Legg kampene i kalenderen (.ics)'; ?></a>
            </div>
        </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 4: SPILLERSTALL & TRENERTEAM (BYGD I NORD)                -->
    <!-- ================================================================= -->
    <section id="spillere" class="section-roster">
        <div class="container">
            <div class="section-header-block">
                <div>
                    <h2 class="section-title"><?php echo $is_en ? 'Built in the North.' : 'Bygd i nord.'; ?></h2>
                    <p class="section-subtitle"><?php echo $is_en ? 'ROSTER & PROFILES ' : 'SPILLERSTALL & PROFILER '; ?><?php echo esc_html(storm_arena_get_current_season_label()); ?></p>
                </div>
                <span class="section-meta-tag"><?php echo $is_en ? 'ELITE SQUAD' : 'ELITETROPPEN'; ?></span>
            </div>

            <div class="roster-grid">
                <?php if (!empty($featured_players)) : ?>
                    <?php foreach ($featured_players as $player) : ?>
                        <div class="player-dossier-card">
                            <div class="player-photo-canvas">
                                <?php if ($player['number'] !== null && $player['number'] >= 0) : ?>
                                    <span class="player-number-watermark"><?php echo esc_html((string) $player['number']); ?></span>
                                <?php endif; ?>
                                <?php if (!empty($player['photo_url'])) : ?>
                                    <img src="<?php echo esc_url($player['photo_url']); ?>" alt="<?php echo esc_attr($player['name']); ?>">
                                <?php elseif (!storm_arena_managed_content()) : ?>
                                    <img src="<?php echo esc_url(storm_arena_asset_url('assets/players/johannes-rydningen-lange.jpg')); ?>" alt="<?php echo esc_attr($player['name']); ?>">
                                <?php endif; ?>
                                <span class="player-position-pill"><?php echo esc_html(($player['position'] ?: 'SPILLER') . ($player['number'] !== null && $player['number'] >= 0 ? ' · #' . $player['number'] : '')); ?></span>
                            </div>
                            <div class="player-card-body">
                                <h3 class="player-card-name"><?php echo esc_html($player['name']); ?></h3>
                                <?php if (!empty($player['url'])) : ?>
                                    <a href="<?php echo esc_url($player['url']); ?>">Spillerprofil &rarr;</a>
                                <?php endif; ?>
                                <p style="font-size: 0.84rem; color: var(--text-dim); line-height: 1.5;">
                                    <?php echo esc_html(wp_trim_words(wp_strip_all_tags($player['description'] ?: 'Viktig nøkkelspiller i Tromsø Storms BLNO-satsing.'), 18)); ?>
                                </p>
                                <div class="player-dossier-specs">
                                    <div class="spec-box">
                                        <span class="spec-val"><?php echo esc_html($player['height'] > 0 ? $player['height'] . ' cm' : '--'); ?></span>
                                        <span class="spec-lbl">Høyde</span>
                                    </div>
                                    <div class="spec-box">
                                        <span class="spec-val"><?php echo esc_html($player['born'] ?: '--'); ?></span>
                                        <span class="spec-lbl">Født</span>
                                    </div>
                                    <div class="spec-box">
                                        <span class="spec-val">STORM</span>
                                        <span class="spec-lbl">Klubb</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php elseif (!storm_arena_managed_content()) : ?>
                    <!-- Default Player Roster Fallback -->
                    <div class="player-dossier-card">
                        <div class="player-photo-canvas">
                            <span class="player-number-watermark">0</span>
                            <img src="<?php echo esc_url(storm_arena_asset_url('assets/players/grant-sitton.png')); ?>" alt="Grant Sitton">
                            <span class="player-position-pill">FORWARD · #0</span>
                        </div>
                        <div class="player-card-body">
                            <h3 class="player-card-name">Grant Sitton</h3>
                            <p style="font-size: 0.84rem; color: var(--text-dim); line-height: 1.5;">Allsidig 206 cm forward med dødelig trepoengsskytterrekkevidde.</p>
                            <div class="player-dossier-specs">
                                <div class="spec-box"><span class="spec-val">206 cm</span><span class="spec-lbl">Høyde</span></div>
                                <div class="spec-box"><span class="spec-val">1993</span><span class="spec-lbl">Født</span></div>
                                <div class="spec-box"><span class="spec-val">USA</span><span class="spec-lbl">Orig</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="player-dossier-card">
                        <div class="player-photo-canvas">
                            <span class="player-number-watermark">4</span>
                            <img src="<?php echo esc_url(storm_arena_asset_url('assets/players/johannes-rydningen-lange.jpg')); ?>" alt="Johannes Lange">
                            <span class="player-position-pill">GUARD · #4</span>
                        </div>
                        <div class="player-card-body">
                            <h3 class="player-card-name">Johannes Lange</h3>
                            <p style="font-size: 0.84rem; color: var(--text-dim); line-height: 1.5;">Lagets kaptein og general. Eksepsjonelt overblikk og forsvarsintensitet.</p>
                            <div class="player-dossier-specs">
                                <div class="spec-box"><span class="spec-val">182 cm</span><span class="spec-lbl">Høyde</span></div>
                                <div class="spec-box"><span class="spec-val">1998</span><span class="spec-lbl">Født</span></div>
                                <div class="spec-box"><span class="spec-val">12 år</span><span class="spec-lbl">I Storm</span></div>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <!-- COACHING STAFF -->
            <div class="roster-full-link">
                <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('spillere-trenere', home_url('/#spillere'))); ?>" class="btn-secondary-hero"><?php echo $is_en ? 'View the full roster &rarr;' : 'Se hele spillerstallen &rarr;'; ?></a>
            </div>

            <?php if (!empty($coaches)) : ?>
                <div style="margin-top: 50px;">
                    <div class="section-header-block">
                        <div>
                            <h3 class="section-title" style="font-size: 1.8rem;">Trenerteam & Støtteapparat</h3>
                            <p class="section-subtitle">Ledelse & Taktisk Utvikling</p>
                        </div>
                    </div>
                    <div class="coaching-staff-grid">
                        <?php foreach ($coaches as $coach) : ?>
                            <div class="coach-dossier-card">
                                <div class="coach-photo-orb">
                                    <?php storm_arena_render_named_image_or_placeholder($coach['photo_url'], $coach['name'], 'coach-photo-orb__image'); ?>
                                </div>
                                <div>
                                    <span class="coach-meta-tag"><?php echo esc_html($coach['role']); ?></span>
                                    <h4 class="coach-name"><?php echo esc_html($coach['name']); ?></h4>
                                    <?php if ($coach['description'] !== '') : ?>
                                        <p class="coach-desc"><?php echo esc_html(wp_trim_words(wp_strip_all_tags($coach['description']), 16)); ?></p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <?php if (!storm_arena_managed_content()) : ?>
                    <!-- Coach's Tactical Mini-Board (Playbook Feature) -->
                    <div class="playbook-mini-board" id="playbook" style="margin-top: 30px;">
                        <div class="playbook-board-top">
                            <span class="playbook-board-title">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--storm-orange)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                COACH'S TACTICAL BOARD // SERGIO BELEÑA
                            </span>
                            <span class="playbook-quote" id="chalkText">"DEFEND THE NORTH // SPREAD THE FLOOR"</span>
                        </div>

                        <div class="playbook-switch-row">
                            <button class="play-btn active" onclick="switchTactics('5out', this)">5-Out Arctic Motion</button>
                            <button class="play-btn" onclick="switchTactics('trap', this)">Tromsø Ice Trap</button>
                            <button class="play-btn" onclick="switchTactics('pick', this)">Sitton Pick &amp; Pop</button>
                        </div>

                        <div class="playbook-diagram-wrap">
                            <svg id="playbookSvg" viewBox="0 0 440 120" style="width: 100%; height: auto; display: block;">
                                <rect x="5" y="5" width="430" height="110" fill="#0C0E12" stroke="rgba(118, 187, 255, 0.25)" stroke-width="1.5" rx="4"/>
                                <line x1="220" y1="5" x2="220" y2="115" stroke="rgba(118, 187, 255, 0.3)" stroke-width="1.5"/>
                                <circle cx="220" cy="115" r="45" fill="none" stroke="#F5822B" stroke-width="1.5"/>
                                <rect x="180" y="5" width="80" height="60" fill="none" stroke="rgba(118, 187, 255, 0.35)" stroke-width="1.5"/>
                                <path d="M 195,65 A 25 25 0 0 0 245,65" fill="none" stroke="rgba(118, 187, 255, 0.4)" stroke-width="1.5"/>
                                <path d="M 195,65 A 25 25 0 0 1 245,65" fill="none" stroke="rgba(118, 187, 255, 0.3)" stroke-width="1.5" stroke-dasharray="3 3"/>
                                <path d="M 60,5 L 60,40 A 160 160 0 0 0 380,40 L 380,5" fill="none" stroke="rgba(245, 130, 43, 0.5)" stroke-width="1.5"/>
                                
                                <g id="tacticalOverlay">
                                    <circle cx="220" cy="85" r="10" fill="#F5822B"/>
                                    <text x="220" y="89" fill="#0C0E12" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">4</text>
                                    <path d="M 210,80 Q 150,65 105,45" stroke="#76BBFF" stroke-width="2" stroke-dasharray="4 2"/>
                                    <polygon points="105,45 115,48 111,54" fill="#76BBFF"/>
                                    <circle cx="95" cy="40" r="10" fill="#171C24" stroke="#76BBFF" stroke-width="2"/>
                                    <text x="95" y="44" fill="#fff" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">0</text>
                                    <circle cx="345" cy="40" r="10" fill="#171C24" stroke="#76BBFF" stroke-width="2"/>
                                    <text x="345" y="44" fill="#fff" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">5</text>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <?php if (!storm_arena_editorial_content('team') && !storm_arena_managed_content()) : ?>
            <!-- TEAM PHOTO -->
            <div class="team-photo-wrap">
                <picture>
                    <source media="(max-width: 700px)" srcset="<?php echo esc_url(storm_arena_asset_url('assets/team-current-700.webp')); ?>">
                    <img src="<?php echo esc_url(storm_arena_asset_url('assets/team-current-1200.webp')); ?>" width="1200" height="603" loading="lazy" alt="Tromsø Storms offisielle lagbilde">
                </picture>
                <div class="team-photo-caption">
                    Tromsø Storm A-lag Herrer BLNO. Hjemmearena: Rødtindhallen, Kvaløysletta.
                </div>
            </div>
            <?php endif; ?>

        </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 5: BLNO TABELL & INTEL                                    -->
    <!-- ================================================================= -->
    <section id="tabell" class="section-standings">
        <div class="container">
            <div class="section-header-block">
                <div>
                    <h2 class="section-title">BLNO Tabell</h2>
                    <p class="section-subtitle">GRUNNSERIE STILLING · TOPP 8 TIL SLUTTSPILL</p>
                </div>
                <span class="section-meta-tag">SESONG <?php echo esc_html(storm_arena_get_current_season_label()); ?></span>
            </div>

            <div class="standings-grid-layout">
                <!-- Table -->
                <div class="standings-table-container" role="region" tabindex="0" aria-label="<?php echo $is_en ? 'BLNO standings, scroll horizontally for all columns' : 'BLNO-tabell, rull vannrett for alle kolonner'; ?>">
                    <?php if (!empty($standings)) : ?>
                        <table class="standings-table">
                            <caption class="screen-reader-text"><?php echo $is_en ? 'BLNO standings' : 'Tabell for BLNO'; ?></caption>
                            <thead>
                                <tr>
                                    <th scope="col" aria-label="<?php echo $is_en ? 'Position' : 'Plassering'; ?>">#</th>
                                    <th scope="col"><?php echo $is_en ? 'Team' : 'Lag'; ?></th>
                                    <th scope="col" aria-label="<?php echo $is_en ? 'Games played' : 'Kamper spilt'; ?>">K</th>
                                    <th scope="col" aria-label="<?php echo $is_en ? 'Wins' : 'Seire'; ?>">V</th>
                                    <th scope="col" aria-label="<?php echo $is_en ? 'Losses' : 'Tap'; ?>">T</th>
                                    <th scope="col" aria-label="<?php echo $is_en ? 'Points difference' : 'Poengforskjell'; ?>">+/-</th>
                                    <th scope="col" aria-label="<?php echo $is_en ? 'Points' : 'Poeng'; ?>">P</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($standings as $row) : ?>
                                    <?php $is_storm = (strpos($row['team'], 'Tromsø') !== false); ?>
                                    <tr<?php echo $is_storm ? ' class="highlight-storm"' : ''; ?>>
                                        <td><span class="rank-circle"><?php echo esc_html((string) $row['position']); ?></span></td>
                                        <th scope="row"><?php echo esc_html($row['team']); ?></th>
                                        <td><?php echo esc_html((string) $row['played']); ?></td>
                                        <td><?php echo esc_html((string) $row['wins']); ?></td>
                                        <td><?php echo esc_html((string) $row['losses']); ?></td>
                                        <td><?php echo esc_html((string) $row['difference']); ?></td>
                                        <td><strong><?php echo esc_html((string) $row['points']); ?></strong></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php elseif (!storm_arena_managed_content()) : ?>
                        <table class="standings-table">
                            <thead><tr><th>Lag</th><th>K</th><th>S</th><th>T</th><th>+/-</th><th>P</th></tr></thead>
                            <tbody>
                                <tr class="highlight-storm"><td><span class="rank-circle">1</span> Tromsø Storm</td><td>21</td><td>18</td><td>3</td><td>+272</td><td><strong>36</strong></td></tr>
                                <tr><td><span class="rank-circle">2</span> Kongsberg Miners</td><td>21</td><td>16</td><td>5</td><td>+184</td><td><strong>32</strong></td></tr>
                                <tr><td><span class="rank-circle">3</span> Fyllingen Lions</td><td>21</td><td>15</td><td>6</td><td>+169</td><td><strong>30</strong></td></tr>
                                <tr><td><span class="rank-circle">4</span> Bærum Basket</td><td>21</td><td>12</td><td>9</td><td>+147</td><td><strong>24</strong></td></tr>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <p><?php echo $is_en ? 'Official standings are not yet available for this season.' : 'Offisiell tabell er ikke tilgjengelig for denne sesongen ennå.'; ?></p>
                    <?php endif; ?>
                </div>

                <!-- Side Intel -->
                <div class="standings-side-intel">
                    <?php if (storm_arena_managed_content()) : ?>
                    <h3 class="intel-title"><?php echo $is_en ? 'Follow the season' : 'Følg sesongen'; ?></h3>
                    <p><?php echo $is_en ? 'Fixtures and published results for the current season.' : 'Se terminliste og publiserte resultater for gjeldende sesong.'; ?></p>
                    <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('kampoversikt', home_url('/kampoversikt/'))); ?>">Kamper og resultater &rarr;</a>
                    <?php else : ?>
                    <h3 class="intel-title">Tromsø i Førersetet</h3>
                    <p class="intel-p">
                        Tromsø Storm kjemper helt i toppen av BLNO. Med Rødtindhallen som en ugjennomtrengelig arktisk festning har laget seriens skarpeste trepoengsprosent og mest intense lagforsvar.
                    </p>
                    
                    <div style="font-family: var(--font-tech); font-size: 0.8rem; color: var(--aurora-ice); margin-bottom: 4px;">
                        FORM (5 SISTE KAMPER):
                    </div>
                    <div class="form-guide-row">
                        <span class="form-pill win">S</span>
                        <span class="form-pill win">S</span>
                        <span class="form-pill win">S</span>
                        <span class="form-pill loss">T</span>
                        <span class="form-pill win">S</span>
                        <span style="font-family: var(--font-tech); font-size: 0.82rem; color: var(--text-dim); margin-left: 6px;">4-1</span>
                    </div>

                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(118,187,255,0.15);">
                        <a href="<?php echo esc_url($tickets_url); ?>" class="btn-card-ticket" style="display: block; text-decoration: none;">Sikre Sluttspillpass &rarr;</a>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 6: SAMFUNNSENGASJEMENT & SAMFUNNSLØFTET (KRAV: TYDELIG)   -->
    <!-- ================================================================= -->
    <section id="samfunn" class="section-community">
        <div class="container">
            <?php if (!storm_arena_editorial_content('community')) : ?>
            <div class="community-layout-grid">
                
                <div class="community-copy-col">
                    <div class="hero-pill-badge">
                        <span>SAMFUNNSLØFTET · FOR NORD-NORGE</span>
                    </div>

                    <h2 class="section-title" style="font-size: clamp(2.4rem, 4.5vw, 3.8rem);">
                        Større enn kampen.
                    </h2>

                    <p class="hero-lead-text">
                        Tromsø Storm har arbeidet for barn og ungdom i byen i mer enn 20 år. Gjennom samarbeidet med <strong>Samfunnsløftet</strong> og SpareBank 1 Nord-Norge kan klubben utvikle flere lavterskeltilbud, basketglede og sunne forbilder i nord.
                    </p>

                    <div class="community-impact-grid">
                        <div class="community-impact-card">
                            <span class="impact-num">01</span>
                            <div>
                                <h3>Basketglede for flere</h3>
                                <p>Lavere terskel for aktivitet, mestring og fellesskap – både i Storm Ungdom og i skolebesøkene rundt om i byen.</p>
                            </div>
                        </div>

                        <div class="community-impact-card">
                            <span class="impact-num">02</span>
                            <div>
                                <h3>Forbilder i nærmiljøet</h3>
                                <p>Eliteutøvere og trenere bruker erfaringen fra toppidretten til å inspirere, veilede og støtte neste generasjon.</p>
                            </div>
                        </div>

                        <div class="community-impact-card">
                            <span class="impact-num">03</span>
                            <div>
                                <h3>Trygge verdier & Rent Idrettslag</h3>
                                <p>Fair play, respekt, inkludering og sunne holdninger skal prege klubbens arbeid både på og utenfor banen.</p>
                            </div>
                        </div>
                    </div>

                    <div class="community-actions-row">
                        <a class="btn-primary-hero" href="<?php echo esc_url(home_url('/2023/10/13/pressemelding-fra-tromso-storm/')); ?>">Les om samarbeidet</a>
                        <a class="btn-secondary-hero" href="https://www.sparebank1.no/nb/nord-norge/om-oss/samfunnsutbytte.html" rel="noopener noreferrer" target="_blank">Om Samfunnsløftet &rarr;</a>
                    </div>
                </div>

                <div class="community-media-col">
                    <div class="community-gallery-layout">
                        <div class="community-photo-card wide">
                            <img src="<?php echo esc_url(content_url('/uploads/2023/10/Bilde-Storm-sponsorer-pressekonferanse-12.10.23-web.jpg')); ?>" loading="lazy" alt="Pressekonferanse Storm og samarbeidspartnere" onerror="this.src='<?php echo esc_url(storm_arena_asset_url('assets/hero-action-1600.webp')); ?>'">
                        </div>
                        <div class="community-photo-card">
                            <img src="<?php echo esc_url(content_url('/uploads/2021/09/51467807686_449779ec3d_w.jpg')); ?>" loading="lazy" alt="Ung profil i Tromsø Storm" onerror="this.src='<?php echo esc_url(storm_arena_asset_url('assets/hero-action-900.webp')); ?>'">
                        </div>
                        <div class="community-photo-card">
                            <img src="<?php echo esc_url(content_url('/uploads/2021/09/51468559009_83b32c0775_w.jpg')); ?>" loading="lazy" alt="Ungdomsbasket i Tromsø" onerror="this.src='<?php echo esc_url(storm_arena_asset_url('assets/hero-action-900.webp')); ?>'">
                        </div>
                    </div>

                    <div class="community-partner-card">
                        <img src="<?php echo esc_url(storm_arena_asset_url('assets/snn.png')); ?>" alt="SpareBank 1 Nord-Norge">
                        <p><strong>Samfunnsløftet</strong> bidrar til prosjekter som gjør Nord-Norge til en enda bedre plass å vokse opp og leve i.</p>
                    </div>

                    <a class="community-video-card" href="https://www.facebook.com/TromsoStorm/videos/" rel="noopener noreferrer" target="_blank">
                        <span class="community-play-icon">▶</span>
                        <div>
                            <strong>Se Storm i aktivitet</strong>
                            <span>Glimt fra basketglede og skolebesøk for barn og unge</span>
                        </div>
                    </a>
                </div>

            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 8: PARTNERE / HVORFOR STØTTE STORM? (LAGET BAK LAGET)    -->
    <!-- ================================================================= -->
    <section id="partnere" class="section-why-partner">
        <div class="container">
            <?php if (!storm_arena_editorial_content('partners')) : ?>
            <div class="why-partner-layout">
                <div>
                    <div class="section-header-block" style="border: none; margin-bottom: 16px;">
                        <div>
                            <span class="hero-pill-badge" style="margin-bottom: 12px;">NÆRINGSLIV I NORD</span>
                            <h2 class="section-title" style="font-size: clamp(2.4rem, 4.5vw, 3.8rem);">
                                Eliteklubben<br>i nord.
                            </h2>
                        </div>
                    </div>
                    <p class="hero-lead-text" style="margin-bottom: 24px;">
                        Tromsø Storm er en bauta i norsk basket – med røtter tilbake til 1976, sterke prestasjoner nasjonalt og en tydelig rolle som flaggskip for sporten i landsdelen.
                    </p>
                    <a class="btn-primary-hero" href="<?php echo esc_url(storm_arena_get_page_url_by_slug('samarbeidspartnere', '#partnere')); ?>">Se partnermulighetene &rarr;</a>
                </div>

                <div class="why-reasons-list">
                    <div class="why-reason-item">
                        <span class="why-reason-num">01</span>
                        <div>
                            <h3>Eliteidrett i nord</h3>
                            <p>Et partnerskap med Storm kobler merkevaren til ambisjon, rå viljestyrke og toppbasket på nasjonalt elitenivå.</p>
                        </div>
                    </div>

                    <div class="why-reason-item">
                        <span class="why-reason-num">02</span>
                        <div>
                            <h3>En klubb med tyngde</h3>
                            <p>Nesten 50 år med arktiske basketprofiler, store bragder og en helt spesiell plass i landsdelens idrettshjerte.</p>
                        </div>
                    </div>

                    <div class="why-reason-item">
                        <span class="why-reason-num">03</span>
                        <div>
                            <h3>Synlig i lokalmiljøet</h3>
                            <p>Fullsatte tribuner i Rødtindhallen, sterke digitale flater og et engasjert publikum gir solide møteplasser gjennom hele sesongen.</p>
                        </div>
                    </div>
                </div>
            </div>

            <?php endif; ?>
            <!-- Partner logo cards grid -->
            <div style="margin-top: 50px;">
                <div class="section-header-block">
                    <div>
                        <h3 class="section-title" style="font-size: 1.6rem;">Våre Samarbeidspartnere</h3>
                        <p class="section-subtitle">Laget bak laget</p>
                    </div>
                    <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('samarbeidspartnere', '#partnere')); ?>" class="section-meta-tag" style="text-decoration: none;">Bli Partner &rarr;</a>
                </div>

                <?php if (!empty($secondarySponsors)) : ?>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-top: 20px;">
                        <?php foreach ($secondarySponsors as $sponsor) : ?>
                            <a href="<?php echo esc_url($sponsor['link_url'] ?: '#partnere'); ?>" class="hero-sponsor-tile"<?php echo empty($sponsor['link_url']) || storm_arena_is_internal_url($sponsor['link_url']) ? '' : ' rel="noopener noreferrer" target="_blank"'; ?>>
                                <?php if (!empty($sponsor['logo_url'])) : ?>
                                    <img src="<?php echo esc_url($sponsor['logo_url']); ?>" alt="<?php echo esc_attr($sponsor['name']); ?>">
                                <?php else : ?>
                                    <span><?php echo esc_html($sponsor['name']); ?></span>
                                <?php endif; ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 9: SOSIALT / FØLG STORMEN (FACEBOOK & INSTAGRAM)          -->
    <!-- ================================================================= -->
    <?php if ($social_posts !== array()) : ?>
    <section id="sosialt" class="section-social">
        <div class="container">
            <div class="section-header-block">
                <div>
                    <h2 class="section-title">Bak kulissene.</h2>
                    <p class="section-subtitle">FØLG STORMEN PÅ SOSIALE MEDIER</p>
                </div>
                <span class="section-meta-tag">#UVÆRFRANORD</span>
            </div>

            <div class="social-grid">
                <?php foreach ($social_posts as $post) : ?>
                    <a class="social-card social-post-card" href="<?php echo esc_url($post['url']); ?>" rel="noopener noreferrer" target="_blank">
                        <img src="<?php echo esc_url(storm_arena_managed_content() ? $post['image'] : storm_arena_asset_url($post['image'])); ?>" width="900" height="1200" loading="lazy" alt="<?php echo esc_attr($post['alt']); ?>">
                        <span class="social-card__platform"><?php echo esc_html($post['platform']); ?></span>
                        <time datetime="<?php echo esc_attr($post['date']); ?>"><?php echo esc_html($post['label']); ?></time>
                        <strong><?php echo esc_html($post['title']); ?></strong>
                        <span class="social-card__excerpt"><?php echo esc_html($post['excerpt']); ?></span>
                        <span class="social-card__link">Se innlegget &rarr;</span>
                    </a>
                <?php endforeach; ?>
            </div>

            <div class="social-actions" style="justify-content: center; margin-top: 28px;">
                <a class="btn-secondary-hero" href="https://www.facebook.com/TromsoStorm" rel="noopener noreferrer" target="_blank">Flere innlegg på Facebook</a>
                <a class="btn-secondary-hero" href="https://www.instagram.com/tromsostorm/" rel="noopener noreferrer" target="_blank">Følg @tromsostorm på Instagram</a>
            </div>
            <p class="social-privacy" style="text-align: center; font-size: 0.78rem; color: var(--text-dim); margin-top: 14px;">Godkjente bilder og tekstutdrag lastes lokalt. Facebook og Instagram kontaktes først når du velger å åpne en kanal eller et innlegg.</p>
        </div>
    </section>
    <?php endif; ?>

    <!-- ================================================================= -->
    <!-- SECTION 10: BILLETT-SEKSJON / KJENN TRYKKET                      -->
    <!-- ================================================================= -->
    <section id="billetter" class="section-tickets">
        <div class="container">
            <?php if (!storm_arena_editorial_content('tickets')) : ?>
            <div class="tickets-cta-card">
                <div>
                    <div class="hero-pill-badge" style="margin-bottom: 12px;">
                        <span>HJEMMEKAMP I RØDTINDHALLEN</span>
                    </div>
                    <h2 class="hero-main-heading" style="font-size: clamp(2.6rem, 5vw, 4.2rem);">
                        Kjenn trykket.<br>
                        <span class="hero-orange-accent">Opplev live basket.</span>
                    </h2>
                    <p class="hero-lead-text" style="margin-top: 14px;">
                        Bli med og skap den arktiske heksegryta som ryster motstanderne. Billetter kjøpes enkelt med Vipps i døra eller på forhånd.
                    </p>
                    <div class="vipps-copy-row">
                        <button type="button" class="btn-vipps-copy" onclick="copyVippsNumber(this)">
                            <span>📱 Vipps #16355</span>
                            <small>(Klikk for å kopiere)</small>
                        </button>
                        <a href="<?php echo esc_url($tickets_url); ?>" class="btn-primary-hero">Se Billettoversikt &rarr;</a>
                    </div>
                    <p id="vippsCopyStatus" role="status"></p>
                </div>

                <div class="prices-grid">
                    <div class="price-item">
                        <span class="price-category">Voksen</span>
                        <span class="price-val">110,-</span>
                        <small style="color: var(--text-dim); font-size: 0.72rem;">Enkeltbillett</small>
                    </div>

                    <div class="price-item">
                        <span class="price-category">Student / Honnør</span>
                        <span class="price-val">80,-</span>
                        <small style="color: var(--text-dim); font-size: 0.72rem;">Gyldig bevis</small>
                    </div>

                    <div class="price-item">
                        <span class="price-category">Barn under 16</span>
                        <span class="price-val" style="color: var(--aurora-cyan);">Gratis</span>
                        <small style="color: var(--text-dim); font-size: 0.72rem;">Velkommen!</small>
                    </div>
                </div>
            </div>

            <!-- B2B Bedriftsbilletter (UX-15 krav) -->
            <div class="b2b-tickets-banner">
                <div>
                    <span class="hero-pill-badge" style="margin-bottom: 8px;">FOR NÆRINGSLIVET</span>
                    <h3 style="font-family: var(--font-head); font-size: 1.4rem; text-transform: uppercase; margin: 4px 0;">Sesongkort på faktura</h3>
                    <p style="font-size: 0.86rem; color: var(--text-dim); margin: 0; max-width: 580px;">
                        Gi ansatte og samarbeidspartnere faste opplevelser i Rødtindhallen. Send strukturert forespørsel til klubben.
                    </p>
                </div>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="mailto:storm@tromsostorm.no?subject=Bedriftsbestilling%20av%20sesongkort&amp;body=Hei%20Troms%C3%B8%20Storm,%0A%0AVi%20%C3%B8nsker%20%C3%A5%20bestille%20sesongkort%20p%C3%A5%20faktura.%0A%0AFirmanavn:%0AOrganisasjonsnummer:%0AAntall%20sesongkort:%0AKontaktperson:%0AFakturaepost:" class="btn-primary-hero" style="font-size: 0.88rem; padding: 10px 18px;">Bestill for bedrift (Faktura) &rarr;</a>
                    <a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('sesongkort', home_url('/sesongkort/'))); ?>" class="btn-secondary-hero" style="font-size: 0.88rem; padding: 10px 18px;">Les om sesongkort</a>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 11: ARENA & REISEGUIDE (RØDTINDHALLEN - KRAV A1)          -->
    <!-- ================================================================= -->
    <section id="arena" class="section-arena">
        <div class="container">
            <?php if (!storm_arena_editorial_content('arena')) : ?>
            <div class="section-header-block">
                <div>
                    <h2 class="section-title">Besøk Stormborgen</h2>
                    <p class="section-subtitle">RØDTINDHALLEN · KVALØYSLETTA</p>
                </div>
                <a href="<?php echo esc_url($arena_url); ?>" class="section-meta-tag" style="text-decoration: none;">Komplett Arena-guide &rarr;</a>
            </div>

            <div class="arena-guide-card">
                <div class="arena-info-block">
                    <span class="hero-pill-badge" style="margin-bottom: 12px;">HJEMMEARENA</span>
                    <h3 style="font-family: var(--font-head); font-size: clamp(1.8rem, 3.5vw, 2.6rem); text-transform: uppercase; margin-bottom: 8px;">Rødtindhallen</h3>
                    <p style="font-family: var(--font-tech); color: var(--aurora-ice); font-size: 0.95rem; margin-bottom: 16px;">
                        📍 Øvre Storvollen 77, 9104 Kvaløya
                    </p>
                    <p style="color: var(--text-dim); line-height: 1.6; font-size: 0.92rem; margin-bottom: 24px; max-width: 680px;">
                        Tromsø Storms arktiske hjemmebane på Kvaløysletta. Her skapes det beryktede uværet fra nord med intens stemning, arktisk trykk og fullsatte tribuner.
                    </p>

                    <div class="arena-facts-grid">
                        <div class="arena-fact-item">
                            <span class="fact-num">01</span>
                            <div>
                                <strong>Buss 42 & 24</strong>
                                <p>Rett fra Tromsø sentrum til Storelva eller Øvre Storvollen med Svipper.</p>
                            </div>
                        </div>
                        <div class="arena-fact-item">
                            <span class="fact-num">02</span>
                            <div>
                                <strong>Gratis Parkering</strong>
                                <p>Gode parkeringsmuligheter rett ved idrettshallen.</p>
                            </div>
                        </div>
                        <div class="arena-fact-item">
                            <span class="fact-num">03</span>
                            <div>
                                <strong>Kontantløs Kiosk</strong>
                                <p>Kiosk med kaffe, vafler og snacks. Betaling med Vipps #16355.</p>
                            </div>
                        </div>
                        <div class="arena-fact-item">
                            <span class="fact-num">04</span>
                            <div>
                                <strong>Universell Utforming</strong>
                                <p>Enkel tilgang for rullestolbrukere og bevegelseshemmede.</p>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 24px;">
                        <a href="https://www.google.com/maps/search/?api=1&amp;query=R%C3%B8dtindhallen,+%C3%98vre+Storvollen+77,+9104+Kval%C3%B8ya" rel="noopener noreferrer" target="_blank" class="btn-primary-hero">Åpne Kart (Google Maps) &rarr;</a>
                        <a href="<?php echo esc_url($arena_url); ?>" class="btn-secondary-hero">Les praktisk reisevei &rarr;</a>
                    </div>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </section>

</main>

<?php get_footer('new'); ?>
