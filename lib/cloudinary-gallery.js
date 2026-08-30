import { v2 as cloudinary } from 'cloudinary';
import { buildUrl, extractPublicId } from 'cloudinary-build-url';

const THUMB_WIDTH = 600;
const LIGHTBOX_WIDTH = 1920;
const SRCSET_WIDTHS = [800, 1200, 1920];

function configureCloudinary() {
    cloudinary.config({
        secure: true,
    });
}

function parseCloudName(src) {
    const match = src.match(/res\.cloudinary\.com\/([^/]+)\//);
    return match?.[1] ?? null;
}

function cloudinaryUrl(src, width) {
    const cloudName = parseCloudName(src);
    const publicId = extractPublicId(src);
    if (!cloudName || !publicId) return src;

    return buildUrl(publicId, {
        cloud: { cloudName },
        transformations: {
            resize: { type: 'limit', width },
        },
    });
}

function buildSrcset(src) {
    return SRCSET_WIDTHS.map((width) => `${cloudinaryUrl(src, width)} ${width}w`).join(', ');
}

function metadataFromResource(resource) {
    const context = resource?.context;
    if (!context) {
        return { caption: '', alt: '' };
    }

    return {
        caption: context.custom?.caption || context.caption || '',
        alt: context.custom?.alt || context.alt || '',
    };
}

function enrichUrls(src, resource = null) {
    const { caption, alt } = metadataFromResource(resource);
    const lightboxSrc = cloudinaryUrl(src, LIGHTBOX_WIDTH);

    return {
        caption,
        alt,
        thumbSrc: cloudinaryUrl(src, THUMB_WIDTH),
        lightboxSrc,
        srcset: buildSrcset(src),
        src: lightboxSrc,
    };
}

export async function enrichGallery(urls) {
    if (!urls?.length) return [];

    configureCloudinary();

    return Promise.all(
        urls.map(async (src) => {
            const publicId = extractPublicId(src);
            if (!publicId) {
                console.warn(`[cloudinary-gallery] Could not extract public_id from URL: ${src}`);
                return enrichUrls(src);
            }
            try {
                const resource = await cloudinary.api.resource(publicId, { context: true });
                return enrichUrls(src, resource);
            } catch (err) {
                console.warn(
                    `[cloudinary-gallery] Failed to fetch metadata for ${publicId}: ${err.error?.message || err.message}`,
                );
                return enrichUrls(src);
            }
        }),
    );
}
