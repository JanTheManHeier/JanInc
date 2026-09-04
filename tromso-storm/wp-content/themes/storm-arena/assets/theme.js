document.addEventListener('DOMContentLoaded', () => {
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
                    toggle.textContent = expanded ? 'Vis de seks neste ↑' : `Vis alle ${matchingRows.length} kamper →`;
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
});
