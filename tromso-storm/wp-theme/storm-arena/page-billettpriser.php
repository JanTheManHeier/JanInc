<?php
get_header();

$arena_url = storm_arena_get_page_url_by_slug('besok-arenaen', home_url('/besok-arenaen/'));
$season_url = storm_arena_get_page_url_by_slug('sesongkort', home_url('/sesongkort/'));
?>
<main id="main-content" class="site-main site-shell">
    <article class="entry-page ticket-hub">
        <header class="page-hero">
            <span class="eyebrow">Sesongen 2026/27</span>
            <h1>Billetter</h1>
            <p>Finn priser, sesongkort og praktisk informasjon før hjemmekampene i Rødtindhallen.</p>
        </header>

        <section class="content-section">
            <div class="content-grid">
                <article class="content-card prose">
                    <span class="section-label"><span>01</span><strong>Enkeltbilletter</strong></span>
                    <h2>Pris på kampdag</h2>
                    <div class="prices">
                        <span>Voksen <strong>110 kr</strong></span>
                        <span>Student / militær / honnør <strong>80 kr</strong></span>
                        <span>Barn under 16 år <strong>Gratis</strong></span>
                    </div>
                    <p>Betaling er kontantløs. Dagens betalingsinformasjon er Vipps til Tromsø Storm på nummer <strong>16355</strong>.</p>
                    <button class="copy-action" type="button" data-copy-value="16355" aria-live="polite">Kopier Vipps-nummer 16355</button>
                </article>

                <article class="content-card prose">
                    <span class="section-label"><span>02</span><strong>Sesongkort</strong></span>
                    <h2>Fast plass hele sesongen</h2>
                    <div class="prices">
                        <span>Voksen <strong>1 100 kr</strong></span>
                        <span>Student <strong>800 kr</strong></span>
                    </div>
                    <p>Sesongkort gir lavere pris enn enkeltbilletter og støtter laget gjennom hele sesongen.</p>
                    <a class="button primary" href="<?php echo esc_url($season_url); ?>">Se og kjøp sesongkort</a>
                </article>
            </div>
        </section>

        <section class="content-section">
            <article class="content-card prose">
                <span class="section-label"><span>03</span><strong>Før kampen</strong></span>
                <h2>Velkommen til Rødtindhallen</h2>
                <p>Se adresse, kollektivtransport, parkering, tilgjengelighet og annen praktisk kampdagsinformasjon i arenaguiden.</p>
                <div class="hero-actions">
                    <a class="button secondary" href="<?php echo esc_url($arena_url); ?>">Besøk arenaen</a>
                    <a class="button secondary" href="mailto:storm@tromsostorm.no?subject=Spørsmål%20om%20billetter">Spør om billetter</a>
                </div>
            </article>
        </section>
    </article>
</main>
<?php get_footer(); ?>
