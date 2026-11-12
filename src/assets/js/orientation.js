// Rotating a phone can leave the layout in a broken state (sliders, viewport units…).
// A reload is the simplest reliable fix. Limited to touch devices so resizing a
// desktop window doesn't trigger it, and to real orientation changes so the mobile
// URL bar showing/hiding (which fires `resize`) doesn't either.
(function () {
    if (!window.matchMedia('(pointer: coarse)').matches) return;

    window.matchMedia('(orientation: portrait)').addEventListener('change', () => {
        window.location.reload();
    });
})();
