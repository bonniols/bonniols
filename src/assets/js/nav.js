(function () {
  const header = document.querySelector('[data-nav-header]');
  if (!header) return;

  const toggle = header.querySelector('[data-nav-toggle]');
  const drawer = document.querySelector('[data-nav-drawer]');
  const backdrop = document.querySelector('[data-nav-backdrop]');
  const closeBtn = drawer?.querySelector('[data-nav-close]');

  function isOpen() {
    return toggle?.getAttribute('aria-expanded') === 'true';
  }

  function openDrawer() {
    drawer?.classList.remove('translate-x-full');
    drawer?.setAttribute('aria-hidden', 'false');
    backdrop?.classList.remove('opacity-0', 'pointer-events-none');
    backdrop?.setAttribute('aria-hidden', 'false');
    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.setAttribute('aria-label', 'Fermer le menu');
    document.body.classList.add('overflow-hidden');
  }

  function closeDrawer() {
    drawer?.classList.add('translate-x-full');
    drawer?.setAttribute('aria-hidden', 'true');
    backdrop?.classList.add('opacity-0', 'pointer-events-none');
    backdrop?.setAttribute('aria-hidden', 'true');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.classList.remove('overflow-hidden');
  }

  toggle?.addEventListener('click', () => {
    isOpen() ? closeDrawer() : openDrawer();
  });

  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      closeDrawer();
    }
  });

  drawer?.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  drawer?.querySelectorAll('[data-nav-accordion]').forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const panel = button.nextElementSibling;
      const icon = button.querySelector('[data-nav-accordion-icon]');

      button.setAttribute('aria-expanded', String(!expanded));
      panel?.classList.toggle('hidden', expanded);
      icon?.classList.toggle('rotate-90', !expanded);
    });
  });
})();
