import { enrichGallery } from '../lib/cloudinary-gallery.js';

function getActiveHomeGallery(home) {
    if (!home) return { gallery: [], url: '' };

    const source = home.use_alt_home_gallery ? home.alt_gallery : home.standard_gallery;

    return {
        gallery: source?.gallery ?? [],
        url: source?.url?.trim() ?? '',
    };
}

export default {
    eleventyComputed: {
        homeGalleryItems: (data) => enrichGallery(getActiveHomeGallery(data.home).gallery),
        homeGalleryUrl: (data) => getActiveHomeGallery(data.home).url,
    },
};
