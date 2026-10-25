<?php
get_header();

$address        = 'Øvre Storvollen 77, 9104 Kvaløya';
$map_url        = 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode('Rødtindhallen, ' . $address);
$journey_url    = 'https://svipper.no/';
$facility_url   = 'https://www.bookup.no/utleie/Index/2169';
$tickets_url    = storm_arena_get_page_url_by_slug('billettpriser', home_url('/#billetter'));
$fixtures_url   = storm_arena_get_page_url_by_slug('kampoversikt', home_url('/#kamper'));
$matches        = storm_arena_get_schedule_entries('storm-current-fixtures');
$next_home_game = null;
$now            = current_time('timestamp') - HOUR_IN_SECONDS;

foreach ($matches as $match) {
    if ($match['is_home'] && $match['timestamp'] !== null && $match['timestamp'] >= $now) {
        $next_home_game = $match;
        break;
    }
}
?>
<main id="main-content" class="site-main">
    <article class="venue-page">
        <header class="page-hero venue-hero site-shell">
            <div>
                <span class="eyebrow">Hjemmekamp i Rødtindhallen</span>
                <h1>Besøk arenaen</h1>
                <p>Her finner du det viktigste før en hjemmekamp med Tromsø Storm: adresse, reise, parkering, tilgjengelighet, billetter og kontakt.</p>
                <div class="hero-actions">
                    <a class="button primary" href="<?php echo esc_url($map_url); ?>" rel="noopener noreferrer" target="_blank">Åpne kart</a>
                    <a class="button secondary" href="<?php echo esc_url($tickets_url); ?>">Se billetter</a>
                </div>
            </div>
            <aside class="venue-address" aria-label="Adresse">
                <span>Rødtindhallen</span>
                <strong><?php echo esc_html($address); ?></strong>
                <p>Kontroller alltid arenaen på kampkortet. Enkelte lag eller arrangementer kan bruke et annet spillested.</p>
            </aside>
        </header>

        <section class="venue-gallery site-shell" aria-labelledby="venue-gallery-title">
            <div class="section-head">
                <div>
                    <div class="section-label"><span>00</span><strong>Hjemmebanen</strong></div>
                    <h2 id="venue-gallery-title">Velkommen inn.</h2>
                </div>
                <p>Rødtindhallen på Kvaløysletta er Tromsø Storms hjemmebane, med tribuner tett på banen og gode fasiliteter for publikum.</p>
            </div>
            <div class="venue-gallery__grid">
                <figure class="venue-gallery__feature">
                    <img src="<?php echo esc_url(storm_arena_asset_url('assets/venue/rodtindhallen-exterior.webp')); ?>" width="1015" height="1027" loading="eager" alt="Fasaden og hovedinngangen til Rødtindhallen">
                    <figcaption>Rødtindhallen · Øvre Storvollen 77</figcaption>
                </figure>
                <figure>
                    <img src="<?php echo esc_url(storm_arena_asset_url('assets/venue/rodtindhallen-interior-1.webp')); ?>" width="1250" height="610" loading="lazy" alt="Idrettsflaten i Rødtindhallen sett fra tribunen">
                    <figcaption>Tribunene ligger tett på spilleflaten.</figcaption>
                </figure>
                <figure>
                    <img src="<?php echo esc_url(storm_arena_asset_url('assets/venue/rodtindhallen-interior-2.webp')); ?>" width="1250" height="610" loading="lazy" alt="Rødtindhallen med spilleflate, kurver og tribuner">
                    <figcaption>Moderne hall med god oversikt fra tribunen.</figcaption>
                </figure>
                <figure>
                    <img src="<?php echo esc_url(storm_arena_asset_url('assets/venue/rodtindhallen-interior-3.webp')); ?>" width="1250" height="610" loading="lazy" alt="Spilleflaten og tribunene i Rødtindhallen">
                    <figcaption>Her spiller Tromsø Storm sine hjemmekamper.</figcaption>
                </figure>
            </div>
        </section>

        <section class="venue-facts section-pad">
            <article><span>01</span><strong>Gratis parkering</strong><p>Det er parkeringsmuligheter ved hallen.</p></article>
            <article><span>02</span><strong>Kontantløst</strong><p>Tromsø Storm bruker kontantløs betaling. Dagens billettside oppgir Vipps 16355.</p></article>
            <article><span>03</span><strong>Universelt utformet</strong><p>Rødtindhallen er registrert med universell utforming. Kontakt klubben ved behov for kampdagshjelp.</p></article>
            <article><span>04</span><strong>Barn under 16</strong><p>Dagens billettordning gir gratis inngang for barn under 16 år.</p></article>
        </section>

        <section class="venue-planning section-pad site-shell">
            <div class="section-head">
                <div><div class="section-label"><span>01</span><strong>Planlegg reisen</strong></div><h2>Finn frem uten stress.</h2></div>
                <p>Beregn ekstra tid før kampstart. Døråpning og eventuelle kampdagstilpasninger publiseres sammen med kampinformasjonen når de er bekreftet.</p>
            </div>
            <div class="venue-route-grid">
                <article class="content-card">
                    <span class="eyebrow">Med buss</span>
                    <h3>Planlegg til Storelva eller Øvre Storvollen</h3>
                    <p>Bruk Svipper for oppdaterte avgangstider, holdeplasser og billetter. Ruter kan endres, så kontroller reisen samme dag.</p>
                    <a class="text-link" href="<?php echo esc_url($journey_url); ?>" rel="noopener noreferrer" target="_blank">Planlegg hos Svipper →</a>
                </article>
                <article class="content-card">
                    <span class="eyebrow">Med bil</span>
                    <h3>Kjør til Rødtindhallen</h3>
                    <p>Bruk adressen <?php echo esc_html($address); ?>. Det er gratis parkering ved hallen, men kapasiteten kan variere ved store arrangementer.</p>
                    <a class="text-link" href="<?php echo esc_url($map_url); ?>" rel="noopener noreferrer" target="_blank">Vis kjørerute →</a>
                </article>
                <article class="content-card">
                    <span class="eyebrow">Tilgjengelighet</span>
                    <h3>Gi beskjed hvis du trenger hjelp</h3>
                    <p>Hallen er universelt utformet. Kontakt Tromsø Storm før kamp dersom du trenger informasjon om inngang, plassering eller ledsager.</p>
                    <a class="text-link" href="mailto:storm@tromsostorm.no?subject=Tilgjengelighet%20på%20hjemmekamp">Kontakt klubben →</a>
                </article>
            </div>
        </section>

        <?php if ($next_home_game !== null && $next_home_game['date'] instanceof DateTimeInterface) : ?>
            <section class="venue-next-game section-pad">
                <div class="site-shell">
                    <div class="section-head">
                        <div><div class="section-label"><span>02</span><strong>Neste hjemmekamp</strong></div><h2>Velkommen til Stormen.</h2></div>
                    </div>
                    <div class="game-card">
                        <div class="game-date">
                            <span><?php echo esc_html(storm_arena_get_day_name_short((int) $next_home_game['date']->format('w'))); ?></span>
                            <strong><?php echo esc_html(mb_strtoupper(storm_arena_format_short_date($next_home_game['date']))); ?></strong>
                            <time datetime="<?php echo esc_attr($next_home_game['date']->format(DATE_ATOM)); ?>"><?php echo esc_html($next_home_game['date']->format('H:i')); ?></time>
                        </div>
                        <div class="matchup">
                            <?php storm_arena_render_match_club($next_home_game['home']); ?>
                            <span class="versus">VS</span>
                            <?php storm_arena_render_match_club($next_home_game['away']); ?>
                        </div>
                        <div class="game-meta">
                            <strong><?php echo esc_html($next_home_game['venue']); ?></strong>
                            <span><?php echo esc_html($address); ?></span>
                            <a class="button primary" href="<?php echo esc_url($tickets_url); ?>">Billettinformasjon</a>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <section class="venue-matchday section-pad site-shell">
            <div class="section-head">
                <div><div class="section-label"><span>03</span><strong>På kampdag</strong></div><h2>Det du bør vite.</h2></div>
            </div>
            <div class="venue-checklist">
                <article><strong>Billetter</strong><p>Voksen 110 kroner, student/militær/honnør 80 kroner og barn under 16 år gratis etter dagens ordning.</p><a href="<?php echo esc_url($tickets_url); ?>">Se full billettinformasjon →</a></article>
                <article><strong>Betaling</strong><p>Klubben bruker kontantløs betaling. Ha Vipps eller annen oppgitt betalingsløsning klar.</p></article>
                <article><strong>Døråpning</strong><p>Tidspunkt publiseres på kampinformasjonen når det er bekreftet. Kom tidlig dersom du trenger hjelp til plassering.</p></article>
                <article><strong>Servering</strong><p>Utvalg og åpning kan variere mellom kampene. Kampinformasjonen oppdateres når tilbudet er bekreftet.</p></article>
            </div>
        </section>

        <section class="venue-contact section-pad">
            <div class="site-shell venue-contact__inner">
                <div>
                    <span class="eyebrow">Spørsmål før kampen?</span>
                    <h2>Vi hjelper deg.</h2>
                    <p>Kontakt klubben om billetter, tilgjengelighet eller praktiske forhold rundt Tromsø Storms hjemmekamper.</p>
                </div>
                <div class="hero-actions">
                    <a class="button primary" href="mailto:storm@tromsostorm.no?subject=Spørsmål%20om%20hjemmekamp">storm@tromsostorm.no</a>
                    <a class="button secondary" href="<?php echo esc_url($fixtures_url); ?>">Se alle kamper</a>
                    <a class="text-link" href="<?php echo esc_url($facility_url); ?>" rel="noopener noreferrer" target="_blank">Fakta om hallen →</a>
                </div>
            </div>
        </section>
    </article>
</main>
<?php get_footer(); ?>
