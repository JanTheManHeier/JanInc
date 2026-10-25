<?php
if (is_paged()) {
    include locate_template('home.php', false, false);
    return;
}

$news_query        = new WP_Query(array('post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 3, 'ignore_sticky_posts' => true));
$matches           = storm_arena_get_schedule_entries('storm-current-fixtures');
$next_match        = storm_arena_get_next_match($matches);
$players           = storm_arena_get_roster_entries('storm-current-roster');
$players_by_name   = array();
foreach ($players as $player) {
    $players_by_name[remove_accents(mb_strtolower($player['name']))] = $player;
}

$featured_names = array(
    'johannes rydningen lange',
    'grant sitton',
    'garrett denbow',
);
$rotating_names = array(
    'isak emanuel ramirez nilsen',
    'aron nielsen finstad',
    'anders solem',
    'vakaris rogaciovas',
);
$rotation_index = (int) wp_date('z', current_time('timestamp')) % count($rotating_names);
$featured_names[] = $rotating_names[$rotation_index];

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
$tickets_url       = storm_arena_get_page_url_by_slug('billettpriser', home_url('/billettpriser/'));
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

get_header();
?>
<main id="main-content">
    <section id="top" class="hero">
        <img class="hero-image" src="<?php echo esc_url(storm_arena_asset_url('assets/hero-action-1600.webp')); ?>" width="1600" height="1320" fetchpriority="high" alt="Tromsø Storm-spiller i kamp">
        <div class="hero-panel">
            <span class="eyebrow">BLNO <?php echo esc_html(str_replace('/', '/', storm_arena_get_current_season_label())); ?> · Tromsø</span>
            <h1>Uværets<br>kraft.</h1>
            <p>Mer energi. Større ambisjoner. Hele Nord-Norges basketlag er tilbake på øverste nivå med mørk Arena-identitet og Tromsø Storms oransje signatur.</p>
            <div class="hero-actions">
                <a class="button primary" href="<?php echo esc_url($tickets_url); ?>">Kjøp billett</a>
                <a class="button secondary" href="#neste-kamp">Neste kamp</a>
            </div>
        </div>
        <div class="hero-tag" aria-hidden="true">#UVÆRFRANORD</div>
        <div class="hero-sponsors" aria-label="Tromsø Storms hovedsponsorer">
            <strong>Hovedsponsorer</strong>
            <?php foreach ($main_sponsors as $sponsor) : ?>
                <a href="<?php echo esc_url($sponsor['link_url'] ?: '#partnere'); ?>"<?php echo empty($sponsor['link_url']) || storm_arena_is_internal_url($sponsor['link_url']) ? '' : ' rel="noopener noreferrer" target="_blank"'; ?>>
                    <?php if (!empty($sponsor['logo_url'])) : ?>
                        <img src="<?php echo esc_url($sponsor['logo_url']); ?>" alt="<?php echo esc_attr($sponsor['name']); ?>">
                    <?php else : ?>
                        <span class="partner-card__name"><?php echo esc_html($sponsor['name']); ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="neste-kamp" class="next-game section-pad">
        <div class="section-label"><span>01</span><strong>Neste kamp</strong></div>
        <?php if ($next_match !== null && $next_match['date'] instanceof DateTimeInterface) : ?>
            <?php
            $days_remaining = (int) ceil(($next_match['timestamp'] - current_time('timestamp')) / DAY_IN_SECONDS);
            $countdown      = $days_remaining <= 0 ? 'Kampdag' : $days_remaining . ' dager igjen';
            ?>
            <div class="game-card">
                <div class="game-date">
                    <span><?php echo esc_html(storm_arena_get_day_name_short((int) $next_match['date']->format('w'))); ?></span>
                    <strong><?php echo esc_html(mb_strtoupper(storm_arena_format_short_date($next_match['date']))); ?></strong>
                    <time datetime="<?php echo esc_attr($next_match['date']->format(DATE_ATOM)); ?>"><?php echo esc_html($next_match['date']->format('H:i')); ?></time>
                </div>
                <div class="matchup">
                    <?php storm_arena_render_match_club($next_match['home']); ?>
                    <span class="versus">VS</span>
                    <?php storm_arena_render_match_club($next_match['away']); ?>
                </div>
                <div class="game-meta">
                    <strong><?php echo esc_html($countdown); ?></strong>
                    <span><?php echo esc_html($next_match['venue'] ?: 'Arena publiseres snart'); ?></span>
                    <div class="game-actions">
                        <a class="button primary" href="<?php echo esc_url($tickets_url); ?>">Kjøp billett</a>
                        <a class="text-link" href="<?php echo esc_url($next_match['stats_url'] ?: storm_arena_get_page_url_by_slug('kampoversikt', '#kamper')); ?>">Kampdetaljer →</a>
                    </div>
                </div>
            </div>
        <?php else : ?>
            <article class="content-card empty-state">
                <h2>Neste kamp publiseres snart.</h2>
                <p>Terminlisten er på vei inn. Følg med her eller gå til kampoversikten.</p>
            </article>
        <?php endif; ?>
    </section>

    <section id="nyheter" class="news section-pad">
        <div class="section-head">
            <div><div class="section-label"><span>02</span><strong>Siste nytt</strong></div><h2>Fra Stormen</h2></div>
            <a class="text-link" href="<?php echo esc_url(storm_arena_get_page_url_by_slug('arkiv', home_url('/page/2/'))); ?>">Alle nyheter →</a>
        </div>
        <div class="news-grid">
            <?php if ($news_query->have_posts()) : ?>
                <?php $card_index = 0; ?>
                <?php while ($news_query->have_posts()) : $news_query->the_post(); ?>
                    <article class="story<?php echo $card_index === 0 ? ' story-lead' : ''; ?>">
                        <?php storm_arena_render_post_image(get_the_ID(), $card_index); ?>
                        <div>
                            <?php
                            $categories = get_the_category();
                            if (!empty($categories)) {
                                echo '<span class="eyebrow">' . esc_html($categories[0]->name) . '</span>';
                            }
                            ?>
                            <time datetime="<?php echo esc_attr(get_the_date(DATE_ATOM)); ?>"><?php echo esc_html(get_the_date('j. F Y')); ?></time>
                            <h3><?php the_title(); ?></h3>
                            <p><?php echo esc_html(wp_trim_words(wp_strip_all_tags(get_the_excerpt() ?: get_the_content(null, false)), 24)); ?></p>
                            <a href="<?php the_permalink(); ?>">Les saken →</a>
                        </div>
                    </article>
                    <?php $card_index++; ?>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>
            <?php else : ?>
                <article class="content-card empty-state"><h3>Ingen nyheter er publisert ennå.</h3><p>Det redaksjonelle arkivet dukker opp her så snart innleggene er tilgjengelige.</p></article>
            <?php endif; ?>
        </div>
    </section>

    <section id="kamper" class="schedule section-pad">
        <div class="section-head">
            <div><div class="section-label"><span>03</span><strong>BLNO <?php echo esc_html(storm_arena_get_current_season_label()); ?></strong></div><h2>Kampene</h2></div>
            <a class="button secondary" href="<?php echo esc_url($calendar_url); ?>" download>Legg kampene i kalenderen</a>
        </div>
        <?php storm_arena_render_match_rows($matches, true); ?>
    </section>

    <section id="tabell" class="section-pad">
        <div class="section-head">
            <div><div class="section-label"><span>04</span><strong>BLNO <?php echo esc_html(storm_arena_get_current_season_label()); ?></strong></div><h2>Tabellen</h2></div>
            <a class="text-link" href="https://kamper.basket.no/standings?seasonId=201069&amp;tournamentId=449378" rel="noopener noreferrer" target="_blank">Se hos BasketLive →</a>
        </div>
        <div class="content-card table-scroll">
            <?php if (!empty($standings)) : ?>
                <table class="data-table">
                    <thead><tr><th scope="col">#</th><th scope="col">Lag</th><th scope="col">K</th><th scope="col">V</th><th scope="col">T</th><th scope="col">+/-</th><th scope="col">P</th></tr></thead>
                    <tbody>
                        <?php foreach ($standings as $row) : ?>
                            <tr<?php echo $row['team'] === 'Tromsø Storm' ? ' class="highlight"' : ''; ?>>
                                <td><?php echo esc_html((string) $row['position']); ?></td>
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
            <?php else : ?>
                <p>Tabellen kunne ikke lastes. <a href="https://kamper.basket.no/standings?seasonId=201069&amp;tournamentId=449378">Se tabellen hos BasketLive</a>.</p>
            <?php endif; ?>
        </div>
    </section>

    <section id="laget" class="roster section-pad">
        <div class="section-head roster-heading">
            <div>
                <div class="section-label"><span>05</span><strong>Spillerstall <?php echo esc_html(storm_arena_get_current_season_label()); ?></strong></div>
                <h2>Bygd i nord.</h2>
            </div>
            <p>Lokale profiler, unge talenter og internasjonal erfaring. Møt laget som tar Tromsø Storm videre med mørk Arena-energi og tydelig identitet.</p>
        </div>
        <?php if (!empty($featured_players)) : ?>
            <div class="roster-grid">
                <?php foreach ($featured_players as $player) : ?>
                    <article class="player-card">
                        <div class="player-photo">
                            <?php storm_arena_render_named_image_or_placeholder($player['photo_url'], $player['name'], 'player-photo__image'); ?>
                            <?php if ($player['number'] !== null && $player['number'] >= 0) : ?>
                                <span class="jersey-number"><?php echo esc_html((string) $player['number']); ?></span>
                            <?php endif; ?>
                        </div>
                        <div class="player-info">
                            <span class="player-meta"><?php echo esc_html(implode(' · ', array_filter(array($player['position'], $player['height'] > 0 ? $player['height'] . ' cm' : '', $player['born'] !== '' ? 'født ' . $player['born'] : '')))); ?></span>
                            <h3><?php echo esc_html($player['name']); ?></h3>
                            <?php if ($player['description'] !== '') : ?>
                                <details><summary>Om spilleren</summary><p><?php echo wp_kses_post($player['description']); ?></p></details>
                            <?php endif; ?>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
            <div class="roster-actions">
                <a class="button secondary" href="<?php echo esc_url(storm_arena_get_page_url_by_slug('spillere-trenere', home_url('/#laget'))); ?>">Se hele laget</a>
            </div>
        <?php else : ?>
            <article class="content-card empty-state"><h3>Spillerstallen er ikke publisert ennå.</h3><p>Spillerprofiler vises her når data er tilgjengelige.</p></article>
        <?php endif; ?>

        <?php if (!empty($coaches)) : ?>
            <div class="coaching-staff">
                <h3>Hovedtrener og støtteapparat</h3>
                <?php foreach ($coaches as $coach) : ?>
                    <article class="coach-card">
                        <?php storm_arena_render_named_image_or_placeholder($coach['photo_url'], $coach['name'], 'coach-card__image'); ?>
                        <div>
                            <span><?php echo esc_html($coach['role']); ?></span>
                            <strong><?php echo esc_html($coach['name']); ?></strong>
                            <?php if ($coach['description'] !== '') : ?>
                                <p><?php echo wp_kses_post($coach['description']); ?></p>
                            <?php endif; ?>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <figure class="team-photo">
            <picture>
                <source media="(max-width: 700px)" srcset="<?php echo esc_url(storm_arena_asset_url('assets/team-current-700.webp')); ?>">
                <img src="<?php echo esc_url(storm_arena_asset_url('assets/team-current-1200.webp')); ?>" width="1200" height="603" loading="lazy" alt="Tromsø Storms lagbilde">
            </picture>
            <figcaption>Lagbilde fra 2025/26 brukes som reserve frem til nytt offisielt sesongbilde er publisert.</figcaption>
        </figure>
    </section>

    <section class="why-partner section-pad">
        <div class="why-copy">
            <div class="section-label"><span>06</span><strong>Hvorfor støtte Tromsø Storm?</strong></div>
            <h2>Eliteklubben<br>i nord.</h2>
            <p class="why-lead">Tromsø Storm er en bauta i norsk basket – med røtter tilbake til 1976, sterke prestasjoner nasjonalt og en tydelig rolle som flaggskip for sporten i nord.</p>
            <a class="button primary" href="<?php echo esc_url(storm_arena_get_page_url_by_slug('samarbeidspartnere', '#partnere')); ?>">Se partnermulighetene</a>
        </div>
        <div class="partner-reasons">
            <article><strong>01</strong><h3>Eliteidrett i nord</h3><p>Et partnerskap med Storm kobler merkevaren til ambisjon, prestasjon og basket på øverste nivå.</p></article>
            <article><strong>02</strong><h3>En klubb med tyngde</h3><p>Nesten 50 år med profiler, store øyeblikk og en sentral plass i norsk baskethistorie.</p></article>
            <article><strong>03</strong><h3>Synlig i lokalmiljøet</h3><p>Hjemmekamper, digitale flater og et engasjert basketmiljø gir sterke møteplasser gjennom hele sesongen.</p></article>
        </div>
    </section>

    <section id="samfunn" class="community-section section-pad">
        <div class="community-layout">
            <div class="community-copy">
                <div class="section-label"><span>07</span><strong>Samfunnsengasjement</strong></div>
                <h2>Større enn kampen.</h2>
                <p class="community-lead">Tromsø Storm har arbeidet for barn og ungdom i byen i mer enn 20 år. Gjennom samarbeidet med Samfunnsløftet kan klubben utvikle flere aktiviteter, møteplasser og muligheter for unge i nord.</p>
                <div class="community-impact">
                    <article><strong>01</strong><h3>Basketglede for flere</h3><p>Lavere terskel for aktivitet, mestring og tilhørighet – både i Storm Ungdom og sammen med basketmiljøene rundt oss.</p></article>
                    <article><strong>02</strong><h3>Forbilder i nærmiljøet</h3><p>Spillere og trenere bruker erfaringen fra eliteidretten til å inspirere og støtte neste generasjon.</p></article>
                    <article><strong>03</strong><h3>Trygge verdier</h3><p>Fair play, sunne holdninger og Rent Idrettslag skal prege arbeidet både på og utenfor banen.</p></article>
                </div>
                <div class="community-actions">
                    <a class="button primary" href="<?php echo esc_url(home_url('/2023/10/13/pressemelding-fra-tromso-storm/')); ?>">Les om samarbeidet</a>
                    <a class="button secondary" href="https://www.sparebank1.no/nb/nord-norge/om-oss/samfunnsutbytte.html" rel="noopener noreferrer" target="_blank">Om Samfunnsløftet</a>
                </div>
            </div>
            <div class="community-media">
                <div class="community-gallery" aria-label="Samfunnsløftet og mennesker i Tromsø Storm">
                    <figure class="community-photo community-photo--wide">
                        <img src="<?php echo esc_url(content_url('/uploads/2023/10/Bilde-Storm-sponsorer-pressekonferanse-12.10.23-web.jpg')); ?>" width="1000" height="750" loading="lazy" alt="Tromsø Storm og samarbeidspartnerne under pressekonferansen i 2023">
                        <figcaption>Samarbeidet med SpareBank 1 Nord-Norge og Samfunnsløftet gir større rom for klubbens arbeid med barn og unge.</figcaption>
                    </figure>
                    <figure class="community-photo">
                        <img src="<?php echo esc_url(content_url('/uploads/2021/09/51467807686_449779ec3d_w.jpg')); ?>" width="300" height="400" loading="lazy" alt="Ung Tromsø Storm-profil i Uvær fra nord-genser">
                        <figcaption>Unge profiler og lokale forbilder er en viktig del av klubbmiljøet.</figcaption>
                    </figure>
                    <figure class="community-photo">
                        <img src="<?php echo esc_url(content_url('/uploads/2021/09/51468559009_83b32c0775_w.jpg')); ?>" width="300" height="400" loading="lazy" alt="Tromsø Storm-profil i Uvær fra nord-genser">
                        <figcaption>Storm skal skape tilhørighet og nye muligheter for basketinteresserte i nord.</figcaption>
                    </figure>
                </div>
                <a class="community-video" href="https://www.facebook.com/TromsoStorm/videos/" rel="noopener noreferrer" target="_blank">
                    <span class="community-video__play" aria-hidden="true">▶</span>
                    <span><strong>Se Storm i aktivitet</strong>Videoer og glimt fra laget og miljøet rundt klubben</span>
                </a>
                <div class="community-partner">
                    <img src="<?php echo esc_url(storm_arena_asset_url('assets/snn.png')); ?>" width="300" height="100" loading="lazy" alt="SpareBank 1 Nord-Norge">
                    <p>Samfunnsløftet bidrar til prosjekter som gjør Nord-Norge til en bedre plass å bo.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="partnere" class="partners section-pad">
        <div class="section-head partner-heading">
            <div><div class="section-label"><span>08</span><strong>Laget bak laget</strong></div><h2>Våre partnere</h2></div>
            <p>Samarbeidspartnerne gjør det mulig å utvikle elitebasket og bygge klubb i nord. Sammen skaper vi aktivitet, tilhørighet og store basketopplevelser.</p>
        </div>
        <?php storm_arena_render_sponsor_cards($secondarySponsors, false); ?>
        <a class="partner-cta" href="<?php echo esc_url(storm_arena_get_page_url_by_slug('samarbeidspartnere', '#partnere')); ?>">Vil du bli partner? <strong>Se mulighetene →</strong></a>
    </section>

    <section id="sosialt" class="social-section section-pad">
        <div class="section-head social-heading">
            <div>
                <div class="section-label"><span>09</span><strong>Følg Stormen</strong></div>
                <h2>Bak kulissene.</h2>
            </div>
            <p>Kampdag, garderobe, høydepunkter og livet rundt laget. Følg Tromsø Storm i sosiale medier for innholdet som skjer mellom kampene.</p>
        </div>
        <div class="social-grid">
            <?php foreach ($social_posts as $post) : ?>
                <a class="social-card social-post-card" href="<?php echo esc_url($post['url']); ?>" rel="noopener noreferrer" target="_blank">
                    <img src="<?php echo esc_url(storm_arena_asset_url($post['image'])); ?>" width="900" height="1200" loading="lazy" alt="<?php echo esc_attr($post['alt']); ?>">
                    <span class="social-card__platform"><?php echo esc_html($post['platform']); ?></span>
                    <time datetime="<?php echo esc_attr($post['date']); ?>"><?php echo esc_html($post['label']); ?></time>
                    <strong><?php echo esc_html($post['title']); ?></strong>
                    <span class="social-card__excerpt"><?php echo esc_html($post['excerpt']); ?></span>
                    <span class="social-card__link">Se innlegget →</span>
                </a>
            <?php endforeach; ?>
        </div>
        <div class="social-actions">
            <a class="button secondary" href="https://www.facebook.com/TromsoStorm" rel="noopener noreferrer" target="_blank">Flere innlegg på Facebook</a>
            <a class="button secondary" href="https://www.instagram.com/tromsostorm/" rel="noopener noreferrer" target="_blank">Følg @tromsostorm</a>
        </div>
        <p class="social-privacy">Godkjente bilder og tekstutdrag lastes lokalt. Facebook og Instagram kontaktes først når du velger å åpne en kanal eller et innlegg.</p>
    </section>

    <section id="billetter" class="ticket-section section-pad">
        <div><span class="eyebrow">Hjemmekamp i Rødtindhallen</span><h2>Kjenn<br>trykket.</h2></div>
        <div class="prices">
            <span>Voksen <strong>110,-</strong></span>
            <span>Student / honnør <strong>80,-</strong></span>
            <span>Barn under 16 <strong>Gratis</strong></span>
        </div>
        <a class="button primary" href="<?php echo esc_url($tickets_url); ?>">Kjøp billett</a>
    </section>
</main>
<?php get_footer(); ?>
