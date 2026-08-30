import { enrichGallery } from '../../lib/cloudinary-gallery.js';

export default {
    eleventyComputed: {
        hasGallery: (data) => Boolean(data.gallery?.length),
        galleryItems: (data) => enrichGallery(data.gallery),
        eleventyNavigation: (data) => {
            if (data.show_in_nav === false) return undefined;
            return {
                key: data.page.fileSlug,
                parent: 'projects',
                title: data.title,
                order: data.order ?? 0,
            };
        },
    },
};
