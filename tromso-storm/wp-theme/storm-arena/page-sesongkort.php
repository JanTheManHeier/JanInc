<?php
get_header();

$tickets_url = storm_arena_get_page_url_by_slug('billettpriser', home_url('/billettpriser/'));
$business_email = 'storm@tromsostorm.no';
$business_subject = 'Bedriftsbestilling av sesongkort';
$business_template = "Hei Tromsø Storm,\n\nVi ønsker å bestille sesongkort på faktura.\n\nFirmanavn:\nOrganisasjonsnummer:\nAntall sesongkort:\nKontaktperson:\nFakturaepost:\n\nVennlig hilsen";
$business_mailto = 'mailto:' . $business_email . '?subject=' . rawurlencode($business_subject) . '&body=' . rawurlencode($business_template);
?>
<main id="main-content" class="site-main site-shell">
    <article class="entry-page">
        <header class="page-hero">
            <span class="eyebrow">2026/27 · Salget er åpnet</span>
            <h1>Sesongkort</h1>
            <p>Vær med på alle seriekampene på hjemmebane og støtt Storm gjennom hele sesongen.</p>
            <div class="hero-actions">
                <a class="button primary" href="#kjop">Kjøp med Vipps</a>
                <a class="button secondary" href="<?php echo esc_url($tickets_url); ?>">Alle billettpriser</a>
            </div>
        </header>

        <section class="content-section">
            <div class="content-grid">
                <article class="content-card prose">
                    <span class="section-label"><span>01</span><strong>Mer Storm for pengene</strong></span>
                    <h2>Fast plass hele sesongen</h2>
                    <p>Terminlisten har 13 seriekamper på hjemmebane. Med sesongkort sparer en voksen 330 kr og en student 240 kr sammenlignet med enkeltbilletter.</p>
                    <div class="prices">
                        <span>Voksen <strong>1 100 kr</strong></span>
                        <span>Student <strong>800 kr</strong></span>
                    </div>
                    <p>Studentbevis må vises ved første hjemmekamp.</p>
                </article>

                <article class="content-card prose" id="kjop">
                    <span class="section-label"><span>02</span><strong>Slik kjøper du</strong></span>
                    <h2>Betal med Vipps</h2>
                    <ol>
                        <li>Åpne Vipps og velg «Send».</li>
                        <li>Søk opp Tromsø Storm på Vipps-nummer <strong>16355</strong>.</li>
                        <li>Betal 1 100 kr for voksen eller 800 kr for student.</li>
                        <li>Skriv «Sesongkort voksen – fullt navn» eller «Sesongkort student – fullt navn» i meldingen.</li>
                    </ol>
                    <button class="copy-action" type="button" data-copy-value="16355" aria-live="polite">Kopier Vipps-nummer 16355</button>
                </article>
            </div>
        </section>

        <section class="content-section">
            <article class="content-card prose">
                <span class="section-label"><span>03</span><strong>Dette får du</strong></span>
                <h2>Fordeler med sesongkort</h2>
                <ul>
                    <li>Eget område å sitte i hallen for dem som ønsker det.</li>
                    <li>Lavere pris enn ved kjøp av enkeltbilletter.</li>
                    <li>Bilde med den Tromsø Storm-spilleren du ønsker.</li>
                    <li>Du støtter laget direkte gjennom hele sesongen.</li>
                </ul>
                <p>Har du spørsmål om kjøpet, kontakt <a href="mailto:storm@tromsostorm.no">storm@tromsostorm.no</a>.</p>
            </article>
        </section>

        <section class="content-section">
            <article class="content-card prose">
                <span class="section-label"><span>04</span><strong>For bedrifter</strong></span>
                <h2>Sesongkort på faktura</h2>
                <p>Gi ansatte eller kunder faste basketopplevelser, samtidig som bedriften støtter lokal eliteidrett i nord.</p>
                <p>Send en strukturert forespørsel til <a href="mailto:<?php echo esc_attr($business_email); ?>"><?php echo esc_html($business_email); ?></a>. Klubben bekrefter pris, antall og fakturadetaljer før bestillingen er bindende.</p>
                <div class="hero-actions">
                    <a class="button primary" href="<?php echo esc_url($business_mailto); ?>">Start bedriftsforespørsel</a>
                    <button class="copy-action" type="button" data-copy-value="<?php echo esc_attr($business_template); ?>" aria-live="polite">Kopier bestillingsmal</button>
                </div>
                <p class="supporting-copy">Nettsiden lagrer ingen kontakt- eller fakturaopplysninger. Forespørselen sendes fra ditt eget e-postprogram.</p>
            </article>
        </section>
    </article>
</main>
<?php get_footer(); ?>
