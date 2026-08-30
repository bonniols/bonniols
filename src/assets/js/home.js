(function () {
    const figure = document.querySelector('[data-home-hero]');
    const img = figure?.querySelector('img');
    const caption = figure?.querySelector('figcaption');

    if (!figure || !img) return;

    let gallery;
    try {
        gallery = JSON.parse(figure.dataset.gallery || '[]');
    } catch {
        return;
    }

    if (!Array.isArray(gallery) || gallery.length === 0) return;

    const item = gallery[Math.floor(Math.random() * gallery.length)];

    // console.log(item);

    if (caption && item.caption) {
        caption.textContent = item.caption;
    }

    img.alt = item.alt || item.caption || '';

    if (item.srcset) img.srcset = item.srcset;
    img.sizes = '100vw';

    img.addEventListener(
        'load',
        () => {
            figure.hidden = false;
            if (caption && item.caption) caption.hidden = false;
        },
        { once: true },
    );

    img.addEventListener(
        'error',
        () => {
            figure.hidden = true;
        },
        { once: true },
    );

    img.src = item.src;
})();
