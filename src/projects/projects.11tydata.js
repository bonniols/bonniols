import { enrichGallery } from '../../lib/cloudinary-gallery.js';

export default {
  eleventyComputed: {
    galleryItems: (data) => enrichGallery(data.gallery),
  },
};
