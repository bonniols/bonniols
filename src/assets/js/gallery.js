(function () {
    const root = document.querySelector('[data-gallery-swiper]');
    if (!root) return;

    const backdrop = root.querySelector('[data-gallery-backdrop]');
    const closeBtn = root.querySelector('[data-gallery-close]');
    const fullscreenBtn = root.querySelector('[data-gallery-fullscreen]');
    const swiperEl = root.querySelector('.swiper');
    const slideCount = Number(document.querySelector('[data-gallery]')?.dataset.slideCount) || 0;

    let lastTrigger = null;

    const desktop = window.matchMedia('(min-width: 768px)');

    const swiper = new Swiper(swiperEl, {
        autoHeight: true,
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 16,
        rewind: slideCount > 1,
        navigation: {
            enabled: false,
            nextEl: swiperEl.querySelector('.swiper-button-next'),
            prevEl: swiperEl.querySelector('.swiper-button-prev'),
        },
        pagination: {
            enabled: true,
            el: swiperEl.querySelector('.swiper-pagination'),
            type: 'fraction',
        },
        keyboard: { enabled: true, onlyInViewport: true },
        breakpoints: {
            768: {
                autoHeight: false,
                spaceBetween: 0,
                navigation: {
                    enabled: true,
                    hideOnClick: true,
                },
                pagination: {
                    enabled: false,
                },
            },
        },
    });

    function isOverlayOpen() {
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
            setControlsHidden(false);
            closeBtn?.focus();
        });
    }

    const enterIcon = fullscreenBtn?.querySelector('.gallery-swiper__icon-enter');
    const exitIcon = fullscreenBtn?.querySelector('.gallery-swiper__icon-exit');

    function getFullscreenElement() {
        return (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            null
        );
    }

    function isGalleryFullscreen() {
        return getFullscreenElement() === root;
    }

    function requestGalleryFullscreen() {
        const request =
            root.requestFullscreen ||
            root.webkitRequestFullscreen ||
            root.mozRequestFullScreen ||
            root.msRequestFullscreen;

        if (!request) return;

        const result = request.call(root);
        if (result && typeof result.catch === 'function') {
            result.catch(() => {});
        }
    }

    function exitGalleryFullscreen() {
        if (!isGalleryFullscreen()) return;

        const exit =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen;

        if (exit) {
            exit.call(document);
        }
    }

    function setHidden(el, hidden) {
        if (!el) return;

        if (hidden) {
            el.setAttribute('hidden', '');
        } else {
            el.removeAttribute('hidden');
        }
    }

    function setControlsHidden(hidden) {
        const method = hidden ? 'add' : 'remove';

        swiperEl
            .querySelectorAll('.swiper-button-prev, .swiper-button-next')
            .forEach((btn) => btn.classList[method]('swiper-button-hidden'));

        [closeBtn, fullscreenBtn].forEach((btn) => {
            btn?.classList[method]('swiper-button-hidden');
        });
    }

    function setCustomControlsHidden(hidden) {
        [closeBtn, fullscreenBtn].forEach((btn) => {
            btn?.classList[hidden ? 'add' : 'remove']('swiper-button-hidden');
        });
    }

    function updateFullscreenState() {
        const isFullscreen = isGalleryFullscreen();

        root.classList.toggle('gallery-swiper--native-fullscreen', isFullscreen);
        fullscreenBtn?.setAttribute('aria-pressed', String(isFullscreen));
        fullscreenBtn?.setAttribute(
            'aria-label',
            isFullscreen ? 'Quitter le plein écran' : 'Plein écran',
        );
        setHidden(closeBtn, isFullscreen);
        setHidden(enterIcon, isFullscreen);
        setHidden(exitIcon, !isFullscreen);
    }

    function closeLightbox() {
        if (!isOverlayOpen()) return;

        exitGalleryFullscreen();
        updateFullscreenState();
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

    swiper.on('navigationHide', () => {
        if (!desktop.matches || !isOverlayOpen()) return;

        setCustomControlsHidden(true);
    });

    swiper.on('navigationShow', () => {
        if (!desktop.matches || !isOverlayOpen()) return;

        setCustomControlsHidden(false);
        updateFullscreenState();
    });

    closeBtn?.addEventListener('click', closeLightbox);

    fullscreenBtn?.addEventListener('click', () => {
        if (isGalleryFullscreen()) {
            exitGalleryFullscreen();
            return;
        }

        requestGalleryFullscreen();
    });

    [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange',
    ].forEach((eventName) => {
        document.addEventListener(eventName, updateFullscreenState);
    });

    backdrop?.addEventListener('click', (event) => {
        if (event.target === backdrop) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOverlayOpen()) {
            if (getFullscreenElement()) return;

            event.stopImmediatePropagation();
            closeLightbox();
        }
    });

    desktop.addEventListener('change', () => {
        if (isOverlayOpen()) {
            closeLightbox();
        }

        if (!desktop.matches) {
            root.setAttribute('aria-hidden', 'false');
        } else if (!isOverlayOpen()) {
            root.setAttribute('aria-hidden', 'true');
        }
    });

    if (desktop.matches) {
        root.setAttribute('aria-hidden', 'true');
    }
})();
