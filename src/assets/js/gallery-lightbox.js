(function () {
    const lightbox = document.querySelector('[data-gallery-lightbox]');
    if (!lightbox) return;

    const backdrop = lightbox.querySelector('[data-gallery-backdrop]');
    const closeBtn = lightbox.querySelector('[data-gallery-close]');
    const playBtn = lightbox.querySelector('[data-gallery-play]');
    const playIcon = lightbox.querySelector('.gallery-lightbox__icon-play');
    const pauseIcon = lightbox.querySelector('.gallery-lightbox__icon-pause');
    const swiperEl = lightbox.querySelector('.swiper');
    const openButtons = document.querySelectorAll('[data-gallery-open]');

    let swiper = null;
    let lastTrigger = null;

    const autoplayOnOpen = lightbox.dataset.autoplay === 'true';
    const autoplayDelayMs = (parseInt(lightbox.dataset.autoplayDelay, 10) || 5) * 1000;

    function isOpen() {
        return !lightbox.classList.contains('hidden');
    }

    function updatePlayButton(playing) {
        if (!playBtn) return;

        playBtn.setAttribute('aria-pressed', String(playing));
        playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Lecture');
        playIcon?.classList.toggle('hidden', playing);
        pauseIcon?.classList.toggle('hidden', !playing);
    }

    function destroySwiper() {
        if (!swiper) return;

        swiper.destroy(true, true);
        swiper = null;
    }

    function createSwiper() {
        destroySwiper();

        swiper = new Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            navigation: {
                nextEl: swiperEl.querySelector('.swiper-button-next'),
                prevEl: swiperEl.querySelector('.swiper-button-prev'),
            },
            keyboard: { enabled: true, onlyInViewport: true },
            /*zoom: { maxRatio: 3 },*/
            autoplay: {
                delay: autoplayDelayMs,
                disableOnInteraction: true,
            },
        });

        if (!autoplayOnOpen) {
            swiper.autoplay.stop();
        }

        return swiper;
    }

    function open(index) {
        lastTrigger = document.activeElement;
        lightbox.classList.remove('hidden');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('overflow-hidden');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const instance = createSwiper();
                instance.slideTo(Number(index), 0);
                instance.zoom.out();

                if (autoplayOnOpen) {
                    instance.autoplay.start();
                    updatePlayButton(true);
                } else {
                    instance.autoplay.stop();
                    updatePlayButton(false);
                }

                closeBtn?.focus();
            });
        });
    }

    function close() {
        lightbox.classList.add('hidden');
        lightbox.setAttribute('aria-hidden', 'true');
        destroySwiper();
        document.body.classList.remove('overflow-hidden');

        if (lastTrigger && typeof lastTrigger.focus === 'function') {
            lastTrigger.focus();
        }
    }

    openButtons.forEach((button) => {
        button.addEventListener('click', () => {
            open(button.dataset.galleryOpen);
        });
    });

    closeBtn?.addEventListener('click', close);

    backdrop?.addEventListener('click', (event) => {
        if (event.target === backdrop) {
            close();
        }
    });

    playBtn?.addEventListener('click', () => {
        if (!swiper) return;

        const playing = playBtn.getAttribute('aria-pressed') === 'true';

        if (playing) {
            swiper.autoplay.stop();
            updatePlayButton(false);
            return;
        }

        swiper.autoplay.start();
        updatePlayButton(true);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen()) {
            event.stopImmediatePropagation();
            close();
        }
    });
})();
