import { enrichGallery } from '../lib/cloudinary-gallery.js';

export default {
    eleventyComputed: {
        homeGalleryItems: (data) => enrichGallery(data.home?.home_gallery),
    },
};
