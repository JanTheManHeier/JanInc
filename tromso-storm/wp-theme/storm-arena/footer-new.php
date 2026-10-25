<?php
/**
 * Footer for Tromsø Storm - Nytt Design 2026/27
 */
$is_en       = (function_exists('storm_arena_get_language') && storm_arena_get_language() === 'en');
$tickets_url = storm_arena_get_page_url_by_slug('billettpriser', home_url('/billettpriser/'));
$home_url    = home_url($is_en ? '/en/' : '/');
?>
    <!-- TACTICAL ARCTIC FOOTER -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand-col">
                    <h2>Tromsø Storm</h2>
                    <p>
                        <?php if ($is_en) : ?>
                            Northern Norway's premier basketball pride at the highest national level. Founded in 1976, fighting with storm power and Arctic identity in Rødtindhallen.
                        <?php else : ?>
                            Hele Nord-Norges basketballstolthet på øverste nasjonale nivå. Stiftet i 1976, kjemper med stormstyrke og arktisk identitet i Rødtindhallen.
                        <?php endif; ?>
                    </p>
                    <p style="margin-top: 12px; font-family: var(--font-tech); font-size: 0.82rem; color: var(--aurora-ice);">
                        Org.nr: 886 210 752 · Postboks 3621 Guleng, 9278 Tromsø
                    </p>
                </div>

                <div class="footer-nav-col">
                    <h3><?php echo $is_en ? 'Navigation' : 'Navigasjon'; ?></h3>
                    <ul>
                        <li><a href="<?php echo esc_url($home_url . '#hero'); ?>"><?php echo $is_en ? 'Home' : 'Forside'; ?></a></li>
                        <li><a href="<?php echo esc_url($home_url . '#resultat'); ?>"><?php echo $is_en ? 'Latest Result' : 'Siste Resultat'; ?></a></li>
                        <li><a href="<?php echo esc_url($home_url . '#kamper'); ?>"><?php echo $is_en ? 'Fixtures & Schedule' : 'Terminliste & Kamper'; ?></a></li>
                        <li><a href="<?php echo esc_url($home_url . '#spillere'); ?>"><?php echo $is_en ? 'Roster & Coaches' : 'Spillerstall & Trenere'; ?></a></li>
                        <li><a href="<?php echo esc_url($home_url . '#tabell'); ?>"><?php echo $is_en ? 'BLNO Standings' : 'BLNO Tabell'; ?></a></li>
                        <li><a href="<?php echo esc_url($home_url . '#nyheter'); ?>"><?php echo $is_en ? 'Latest News' : 'Siste Nytt'; ?></a></li>
                    </ul>
                </div>

                <div class="footer-nav-col">
                    <h3><?php echo $is_en ? 'Tickets & Arena' : 'Arena & Billetter'; ?></h3>
                    <ul>
                        <li><a href="<?php echo esc_url($tickets_url); ?>"><?php echo $is_en ? 'Buy Tickets (Vipps 16355)' : 'Kjøp Billetter (Vipps 16355)'; ?></a></li>
                        <li><a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('sesongkort', home_url('/sesongkort/'))); ?>"><?php echo $is_en ? 'Season Pass 2026/27' : 'Sesongkort 2026/27'; ?></a></li>
                        <li><a href="<?php echo esc_url(storm_arena_get_page_url_by_slug('besok-arenaen', home_url('/besok-arenaen/'))); ?>"><?php echo $is_en ? 'Visit Rødtindhallen' : 'Besøk Rødtindhallen'; ?></a></li>
                        <li><a href="https://www.norsk-tipping.no/grasrotandelen" rel="noopener noreferrer" target="_blank"><?php echo $is_en ? 'Grasrotandelen (Support Us)' : 'Støtt oss med Grasrotandelen'; ?></a></li>
                        <li><a href="mailto:storm@tromsostorm.no">Kontakt: storm@tromsostorm.no</a></li>
                    </ul>
                </div>

                <div class="footer-nav-col">
                    <h3><?php echo $is_en ? 'Partners & Community' : 'Partnere & Samfunn'; ?></h3>
                    <ul>
                        <li><a href="<?php echo esc_url($home_url . '#samfunn'); ?>">SpareBank 1 Nord-Norge</a></li>
                        <li><a href="<?php echo esc_url($home_url . '#samfunn'); ?>">Samfunnsløftet</a></li>
                        <li><a href="<?php echo esc_url($home_url . '#partnere'); ?>">Jekta Storsenter</a></li>
                        <li><a href="<?php echo esc_url($home_url . '#partnere'); ?>">Extra</a></li>
                        <li><a href="<?php echo esc_url($home_url . '#partnere'); ?>">Bedsys</a></li>
                        <li><a href="<?php echo esc_url($home_url . '#partnere'); ?>">Hermes AS</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom-bar">
                <span>&copy; <?php echo esc_html(gmdate('Y')); ?> Tromsø Storm Basketballklubb. <?php echo $is_en ? 'All rights reserved.' : 'Alle rettigheter reservert.'; ?></span>
                <span>LAT: 69° 39' 07" N · LONG: 18° 57' 12" E · BLNO · <?php echo $is_en ? 'A STORM FROM THE NORTH' : 'UVÆR FRA NORD'; ?></span>
            </div>
        </div>
    </footer>

</div><!-- /.site-wrapper -->

<!-- Interactive Scripts -->
<script>
    // Vipps Copy Function
    async function copyVippsNumber(btn) {
        const status = document.getElementById('vippsCopyStatus');
        try {
            await navigator.clipboard.writeText('16355');
            status.textContent = <?php echo wp_json_encode($is_en ? 'Vipps number 16355 copied.' : 'Vipps-nummer 16355 er kopiert.'); ?>;
        } catch (error) {
            console.warn('Storm Vipps number could not be copied.', error);
            status.textContent = <?php echo wp_json_encode($is_en ? 'Copy failed. Enter Vipps number 16355 manually.' : 'Kunne ikke kopiere. Skriv inn Vipps-nummer 16355 manuelt.'); ?>;
        }
    }

    // Coach's Playbook Switcher
    const plays = {
        '5out': {
            quote: '"DEFEND THE NORTH // SPREAD THE FLOOR"',
            svg: `
                <circle cx="220" cy="85" r="10" fill="#F5822B"/>
                <text x="220" y="89" fill="#0C0E12" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">4</text>
                <path d="M 210,80 Q 150,65 105,45" stroke="#76BBFF" stroke-width="2" stroke-dasharray="4 2"/>
                <polygon points="105,45 115,48 111,54" fill="#76BBFF"/>
                <circle cx="95" cy="40" r="10" fill="#171C24" stroke="#76BBFF" stroke-width="2"/>
                <text x="95" y="44" fill="#fff" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">0</text>
                <path d="M 105,40 Q 160,30 205,15" stroke="#F5822B" stroke-width="2"/>
                <polygon points="205,15 195,18 198,24" fill="#F5822B"/>
                <circle cx="345" cy="40" r="10" fill="#171C24" stroke="#76BBFF" stroke-width="2"/>
                <text x="345" y="44" fill="#fff" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">5</text>
            `
        },
        'trap': {
            quote: '"ICE THE PICK // FORCE BASELINE TURNOVER"',
            svg: `
                <circle cx="160" cy="65" r="10" fill="#F5822B"/>
                <text x="160" y="69" fill="#0C0E12" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">4</text>
                <circle cx="185" cy="60" r="10" fill="#F5822B"/>
                <text x="185" y="64" fill="#0C0E12" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">11</text>
                <circle cx="172" cy="80" r="9" fill="#E74C3C"/>
                <text x="172" y="84" fill="#fff" font-family="'Space Grotesk'" font-size="9" font-weight="bold" text-anchor="middle">X</text>
                <path d="M 170,75 L 130,105" stroke="#76BBFF" stroke-width="2" stroke-dasharray="3 3"/>
                <polygon points="130,105 140,103 136,98" fill="#76BBFF"/>
            `
        },
        'pick': {
            quote: '"HIGH PICK & POP // SITTON TOP OF KEY 3"',
            svg: `
                <circle cx="220" cy="85" r="10" fill="#F5822B"/>
                <text x="220" y="89" fill="#0C0E12" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">4</text>
                <line x1="230" y1="80" x2="245" y2="80" stroke="#F5822B" stroke-width="4"/>
                <path d="M 220,85 Q 260,70 270,45" stroke="#F5822B" stroke-width="2"/>
                <polygon points="270,45 264,54 272,56" fill="#F5822B"/>
                <circle cx="180" cy="80" r="10" fill="#171C24" stroke="#76BBFF" stroke-width="2"/>
                <text x="180" y="84" fill="#fff" font-family="'Space Grotesk'" font-size="10" font-weight="bold" text-anchor="middle">0</text>
                <path d="M 180,80 Q 200,60 220,45" stroke="#76BBFF" stroke-width="2" stroke-dasharray="3 2"/>
                <polygon points="220,45 212,52 218,56" fill="#76BBFF"/>
            `
        }
    };

    function switchTactics(key, btn) {
        document.querySelectorAll('.play-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const data = plays[key];
        const chalkText = document.getElementById('chalkText');
        const tacticalOverlay = document.getElementById('tacticalOverlay');
        if (chalkText) chalkText.textContent = data.quote;
        if (tacticalOverlay) tacticalOverlay.innerHTML = data.svg;
    }

    // Fixtures Filtering
    function filterFixtures(type, btn) {
        document.querySelectorAll('.filter-btn').forEach(function(b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const cards = document.querySelectorAll('.fixture-card');
        cards.forEach(function(card) {
            if (type === 'all' || card.dataset.venue === type) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    const motionToggle = document.getElementById('toggleBackgroundMotion');
    if (motionToggle) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let userPaused = false;
        try {
            userPaused = sessionStorage.getItem('storm_background_paused') === '1';
        } catch (error) {
            console.warn('Storm background preference could not be read.', error);
        }

        function updateBackgroundMotion() {
            const paused = userPaused || reducedMotion.matches;
            document.body.dataset.backgroundPaused = String(paused);
            motionToggle.setAttribute('aria-pressed', String(paused));
            motionToggle.disabled = reducedMotion.matches;
            motionToggle.textContent = reducedMotion.matches
                ? <?php echo wp_json_encode($is_en ? 'Reduced motion (system)' : 'Redusert bevegelse (system)'); ?>
                : <?php echo wp_json_encode($is_en ? 'Pause background' : 'Pause bakgrunn'); ?>;
        }

        motionToggle.addEventListener('click', function() {
            userPaused = !userPaused;
            updateBackgroundMotion();
            try {
                sessionStorage.setItem('storm_background_paused', userPaused ? '1' : '0');
            } catch (error) {
                console.warn('Storm background preference could not be saved.', error);
            }
        });
        reducedMotion.addEventListener('change', updateBackgroundMotion);
        updateBackgroundMotion();
        motionToggle.hidden = false;
    }
</script>

<?php wp_footer(); ?>
</body>
</html>
