(function () {
    const figure = document.querySelector('[data-home-hero]');
    const img = figure?.querySelector('img');
    const caption = figure?.querySelector('figcaption');

    if (!figure || !img) return;

    const gallery = JSON.parse(document.getElementById('home-gallery-data')?.textContent || '[]');

    // console.log(gallery);

    if (!Array.isArray(gallery) || gallery.length === 0) return;

    function debounce(fn, ms) {
        let timeoutId;

        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), ms);
        };
    }

    function viewportPreference() {
        const ratio = window.innerWidth / window.innerHeight;
        if (ratio > 1) return 'landscape';
        if (ratio < 1) return 'portrait';
        return 'square';
    }

    function imageMatchesPreference(item, preference) {
        if (!item.width || !item.height) return true;

        const ratio = item.width / item.height;
        if (ratio === 1) return true;
        if (preference === 'square') return true;
        if (preference === 'landscape') return ratio > 1;
        return ratio < 1;
    }

    function poolForPreference(preference) {
        const pool = gallery.filter((item) => imageMatchesPreference(item, preference));
        return pool.length > 0 ? pool : gallery;
    }

    function pickRandomItem(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function showItem(item) {
        if (caption) {
            if (item.caption) {
                caption.textContent = item.caption;
            } else {
                caption.textContent = '';
            }
        }

        img.alt = item.alt || item.caption || '';

        if (item.srcset) {
            img.srcset = item.srcset;
        } else {
            img.removeAttribute('srcset');
        }

        img.sizes = '100vw';

        figure.hidden = true;
        if (caption) caption.hidden = true;

        const onLoad = () => {
            figure.hidden = false;
            if (caption && item.caption) caption.hidden = false;
        };

        const onError = () => {
            figure.hidden = true;
            caption.hidden = true;
        };

        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onError, { once: true });

        img.src = item.src;
    }

    function pickHero() {
        const item = pickRandomItem(poolForPreference(viewportPreference()));
        showItem(item);
    }

    window.addEventListener('resize', debounce(pickHero, 500));
    pickHero();
})();
