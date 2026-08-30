(function () {
    // const root = document.querySelector('[data-gallery-swiper]');
    // if (!root) return;

    // const gallery = document.querySelector('[data-gallery]');
    // const backdrop = root.querySelector('[data-gallery-backdrop]');
    // const closeBtn = root.querySelector('[data-gallery-close]');
    const swiperEl = document.querySelector('.swiper');
    // const slideCount = Number(gallery?.dataset.slideCount) || 0;

    // let lastTrigger = null;

    // const desktop = window.matchMedia('(min-width: 768px)');

    const swiper = new Swiper(swiperEl, {
        autoHeight: true,
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        // loopAdditionalSlides: Math.min(slideCount, 3),
        navigation: {
            nextEl: swiperEl.querySelector('.swiper-button-next'),
            prevEl: swiperEl.querySelector('.swiper-button-prev'),
        },
        keyboard: { enabled: true, onlyInViewport: true },
        breakpoints: {
            // when window width is >= 768px
            768: {
                autoHeight: false,
            },
        },
    });

    /* function isOverlayOpen() {
        return root.classList.contains('gallery-swiper--open');
    }

    function openLightbox(index) {
        if (!desktop.matches) return;

        lastTrigger = document.activeElement;
        root.classList.remove('md:hidden');
        root.classList.add('gallery-swiper--open');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-hidden', 'false');
        document.body.classList.add('overflow-hidden');

        requestAnimationFrame(() => {
            swiper.slideTo(Number(index), 0);
            swiper.update();
            closeBtn?.focus();
        });
    }

    function closeLightbox() {
        if (!isOverlayOpen()) return;

        root.classList.remove('gallery-swiper--open');
        if (desktop.matches) {
            root.classList.add('md:hidden');
            root.setAttribute('aria-hidden', 'true');
        }
        root.setAttribute('aria-modal', 'false');
        document.body.classList.remove('overflow-hidden');

        if (lastTrigger && typeof lastTrigger.focus === 'function') {
            lastTrigger.focus();
        }
    }

    document.querySelectorAll('[data-gallery-open]').forEach((button) => {
        button.addEventListener('click', () => {
            openLightbox(button.dataset.galleryOpen);
        });
    });

    closeBtn?.addEventListener('click', closeLightbox);

    backdrop?.addEventListener('click', (event) => {
        if (event.target === backdrop) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOverlayOpen()) {
            event.stopImmediatePropagation();
            closeLightbox();
        }
    });

    desktop.addEventListener('change', () => {
        if (isOverlayOpen()) {
            closeLightbox();
        }
        swiper.update();

        if (!desktop.matches) {
            root.setAttribute('aria-hidden', 'false');
        } else if (!isOverlayOpen()) {
            root.setAttribute('aria-hidden', 'true');
        }
    });

    if (desktop.matches) {
        root.setAttribute('aria-hidden', 'true');
    }

    window.addEventListener('resize', () => {
        swiper.update();
    }); */
})();
