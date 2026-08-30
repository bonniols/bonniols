import { buildUrl, extractPublicId } from 'cloudinary-build-url';

import { loadCache } from './cloudinary-cache.js';

const THUMB_WIDTH = 600;
const LIGHTBOX_WIDTH = 1920;
const THUMB_WIDTHS = [300, 400, 600];
const SRCSET_WIDTHS = [400, 800, 1200, 1920];

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

function buildSrcset(src, widths) {
    return widths.map((width) => `${cloudinaryUrl(src, width)} ${width}w`).join(', ');
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
        width: resource?.width ?? null,
        height: resource?.height ?? null,
        thumbSrc: cloudinaryUrl(src, THUMB_WIDTH),
        thumbSrcset: buildSrcset(src, THUMB_WIDTHS),
        lightboxSrc,
        srcset: buildSrcset(src, SRCSET_WIDTHS),
        src: lightboxSrc,
    };
}

export function enrichGallery(urls) {
    if (!urls?.length) return [];

    const cache = loadCache();

    return urls.map((src) => {
        const publicId = extractPublicId(src);
        if (!publicId) {
            console.warn(`[cloudinary-gallery] Could not extract public_id from URL: ${src}`);
            return enrichUrls(src);
        }

        const resource = cache[publicId];
        if (!resource) {
            console.warn(
                `[cloudinary-gallery] No cached metadata for ${publicId}. Run npm run cache:cloudinary`,
            );
        }

        return enrichUrls(src, resource ?? null);
    });
}
