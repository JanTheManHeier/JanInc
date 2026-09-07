document.addEventListener('DOMContentLoaded', () => {
    const isEnglish = window.location.pathname === '/en' || window.location.pathname.startsWith('/en/');
    const labels = isEnglish
        ? {
            showNext: 'Show the next six ↑',
            showAll: (count) => `Show all ${count} games →`,
            copied: 'Copied',
            iosInstall: 'On iPhone: open the Share menu and choose “Add to Home Screen”.',
        }
        : {
            showNext: 'Vis de seks neste ↑',
            showAll: (count) => `Vis alle ${count} kamper →`,
            copied: 'Kopiert',
            iosInstall: 'På iPhone: åpne Del-menyen og velg «Legg til på Hjem-skjerm».',
        };
    const menuButton = document.querySelector('.menu-button');
    const navigation = document.querySelector('.site-nav');
    const focusSection = (target) => {
        if (target instanceof HTMLElement) {
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    };

    document.querySelector('.skip-link')?.addEventListener('click', () => {
        focusSection(document.getElementById('main-content'));
    });

    if (menuButton && navigation) {
        const closeMenu = () => {
            navigation.classList.remove('open');
            menuButton.setAttribute('aria-expanded', 'false');
        };

        menuButton.addEventListener('click', () => {
            const open = navigation.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(open));
            if (open) {
                navigation.querySelector('a')?.focus();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navigation.classList.contains('open')) {
                closeMenu();
                menuButton.focus();
            }
        });

        document.addEventListener('focusin', (event) => {
            if (navigation.classList.contains('open') && event.target !== menuButton && !navigation.contains(event.target)) {
                closeMenu();
            }
        });

        navigation.addEventListener('click', (event) => {
            const link = event.target instanceof Element ? event.target.closest('a') : null;
            if (link instanceof HTMLAnchorElement) {
                closeMenu();
                const url = new URL(link.href);
                const target = url.origin === location.origin && url.pathname === location.pathname && url.hash
                    ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
                    : null;
                focusSection(target);
            }
        });
    }

    document.querySelectorAll('[data-schedule]').forEach((scheduleSection) => {
        const rows = Array.from(scheduleSection.querySelectorAll('.game-row'));
        const toggle = scheduleSection.parentElement?.querySelector('.schedule-toggle');
        const filters = scheduleSection.parentElement?.querySelectorAll('.filter') || [];
        const initialLimit = Number(scheduleSection.getAttribute('data-initial-limit') || '6');
        let activeFilter = 'all';
        let expanded = false;

        const render = () => {
            const matchingRows = rows.filter((row) => activeFilter === 'all' || row.getAttribute('data-filter-group') === activeFilter);

            rows.forEach((row) => {
                const visible = matchingRows.includes(row);
                row.hidden = !visible;
            });

            matchingRows.forEach((row, index) => {
                row.hidden = !expanded && index >= initialLimit;
            });

            if (toggle instanceof HTMLButtonElement) {
                const needsToggle = matchingRows.length > initialLimit;
                toggle.hidden = !needsToggle;
                if (needsToggle) {
                    toggle.textContent = expanded ? labels.showNext : labels.showAll(matchingRows.length);
                    toggle.setAttribute('aria-expanded', String(expanded));
                }
            }
        };

        filters.forEach((button) => {
            button.addEventListener('click', () => {
                filters.forEach((item) => {
                    const selected = item === button;
                    item.classList.toggle('active', selected);
                    item.setAttribute('aria-pressed', String(selected));
                });

                activeFilter = button.getAttribute('data-filter') || 'all';
                expanded = false;
                render();
            });
        });

        if (toggle instanceof HTMLButtonElement) {
            toggle.addEventListener('click', () => {
                expanded = !expanded;
                render();
            });
        }

        render();
    });

    document.querySelectorAll('[data-copy-value]').forEach((button) => {
        button.addEventListener('click', async () => {
            const value = button.getAttribute('data-copy-value') || '';
            const originalLabel = button.textContent;

            try {
                await navigator.clipboard.writeText(value);
                button.textContent = labels.copied;
            } catch {
                const input = document.createElement('input');
                input.value = value;
                input.setAttribute('readonly', '');
                input.style.position = 'fixed';
                input.style.opacity = '0';
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                input.remove();
                button.textContent = labels.copied;
            }

            window.setTimeout(() => {
                button.textContent = originalLabel;
            }, 2200);
        });
    });

    const config = window.stormArenaConfig || {};
    if ('serviceWorker' in navigator && config.serviceWorkerUrl) {
        navigator.serviceWorker.register(config.serviceWorkerUrl, {
            scope: config.serviceWorkerScope || '/',
        }).catch((error) => {
            console.warn('Storm service worker could not be registered.', error);
        });
    }

    const installButtons = document.querySelectorAll('[data-install-app]');
    const installHelp = document.querySelector('[data-install-help]');
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    let installPrompt = null;

    if (!isStandalone && isIos && installHelp) {
        installHelp.hidden = false;
        installHelp.textContent = labels.iosInstall;
    }

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        installPrompt = event;
        installButtons.forEach((button) => {
            button.hidden = false;
        });
    });

    installButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            if (!installPrompt) {
                return;
            }

            await installPrompt.prompt();
            await installPrompt.userChoice;
            installPrompt = null;
            installButtons.forEach((item) => {
                item.hidden = true;
            });
        });
    });
});
