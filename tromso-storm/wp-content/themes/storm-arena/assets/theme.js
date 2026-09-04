document.addEventListener('DOMContentLoaded', () => {
    const isEnglish = document.documentElement.lang.startsWith('en');
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
    const rodtindhallenMapUrl = 'https://www.google.com/maps/search/?api=1&query=69.68730591004379%2C18.791627726316968';

    document.querySelectorAll('.venue, .game-meta > span').forEach((venue) => {
        if (venue.textContent.trim() !== 'Rødtindhallen') {
            return;
        }

        const link = document.createElement('a');
        link.className = venue.className;
        link.href = rodtindhallenMapUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = venue.textContent;
        link.setAttribute('aria-label', isEnglish
            ? 'Open Rødtindhallen in Google Maps'
            : 'Åpne Rødtindhallen i Google Maps');
        venue.replaceWith(link);
    });

    const menuButton = document.querySelector('.menu-button');
    const navigation = document.querySelector('.site-nav');

    if (menuButton && navigation) {
        const closeMenu = () => {
            navigation.classList.remove('open');
            menuButton.setAttribute('aria-expanded', 'false');
        };

        menuButton.addEventListener('click', () => {
            const open = navigation.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(open));
        });

        navigation.addEventListener('click', (event) => {
            if (event.target instanceof HTMLElement && event.target.closest('a')) {
                closeMenu();
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
