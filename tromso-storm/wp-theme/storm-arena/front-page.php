<?php
/**
 * Front Page Router for Tromsø Storm
 * Dispatches to either front-page-new.php (default) or front-page-classic.php
 */

if (is_paged()) {
    include locate_template('home.php', false, false);
    return;
}

if (function_exists('storm_arena_get_active_design') && storm_arena_get_active_design() === 'classic') {
    include locate_template('front-page-classic.php', false, false);
    return;
}

include locate_template('front-page-new.php', false, false);
