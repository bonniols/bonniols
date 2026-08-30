import 'dotenv/config';

import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

import { writeCache, CACHE_PATH } from '../lib/cloudinary-cache.js';
import { collectGalleryUrls } from '../lib/collect-gallery-urls.js';

cloudinary.config({ secure: true });

const urls = collectGalleryUrls();
const cache = {};

for (const src of urls) {
    const publicId = extractPublicId(src);
    if (!publicId) {
        console.warn(`[cache-cloudinary] Could not extract public_id from URL: ${src}`);
        continue;
    }

    try {
        cache[publicId] = await cloudinary.api.resource(publicId, { context: true });
        console.log(`[cache-cloudinary] Cached ${publicId}`);
    } catch (err) {
        console.warn(
            `[cache-cloudinary] Failed to fetch ${publicId}: ${err.error?.message || err.message}`,
        );
    }
}

writeCache(cache);
console.log(`[cache-cloudinary] Wrote ${Object.keys(cache).length} resources to ${CACHE_PATH}`);
