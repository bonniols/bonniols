(function () {
    const header = document.querySelector('[data-nav-header]');
    if (!header) return;

    const openButton = header.querySelector('[data-nav-open]');
    const drawer = document.querySelector('[data-nav-drawer]');
    const closeButton = drawer?.querySelector('[data-nav-close]');

    function isOpen() {
        return openButton?.getAttribute('aria-expanded') === 'true';
    }

    function openDrawer() {
        drawer?.classList.remove('translate-x-full');
        drawer?.setAttribute('aria-hidden', 'false');

        openButton?.setAttribute('aria-expanded', 'true');
        openButton?.setAttribute('aria-label', 'Fermer le menu');

        document.body.classList.add('overflow-hidden');
    }

    function closeDrawer() {
        drawer?.classList.add('translate-x-full');
        drawer?.setAttribute('aria-hidden', 'true');

        openButton?.setAttribute('aria-expanded', 'false');
        openButton?.setAttribute('aria-label', 'Ouvrir le menu');

        document.body.classList.remove('overflow-hidden');
    }

    openButton?.addEventListener('click', () => {
        isOpen() ? closeDrawer() : openDrawer();
    });

    closeButton?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen()) {
            closeDrawer();
        }
    });

    drawer?.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener('click', closeDrawer);
    });

    function setAccordion(button, expanded) {
        const panel = button.nextElementSibling;
        const icon = button.querySelector('[data-nav-accordion-icon]');

        button.setAttribute('aria-expanded', String(expanded));
        panel?.classList.toggle('hidden', !expanded);
        icon?.classList.toggle('rotate-90', expanded);
    }

    drawer?.querySelectorAll('[data-nav-accordion]').forEach((button) => {
        // Root sections start collapsed unless they contain the current page.
        if (button.dataset.navDepth === '0') {
            const containsCurrent =
                button.nextElementSibling?.querySelector('[aria-current="page"]');
            setAccordion(button, Boolean(containsCurrent));
        }

        button.addEventListener('click', () => {
            setAccordion(button, button.getAttribute('aria-expanded') !== 'true');
        });
    });

    // document.addEventListener('DOMContentLoaded', openDrawer);
})();
