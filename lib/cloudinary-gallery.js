import { v2 as cloudinary } from 'cloudinary';
import {extractPublicId} from 'cloudinary-build-url';

function configureCloudinary() {
  cloudinary.config({
    secure: true,
  });
}

function captionFromResource(resource) {
  const context = resource?.context;
  if (!context) return '';

  return context.custom?.caption || context.caption || '';
}

/**
 * Resolve Cloudinary contextual metadata captions for gallery URL strings.
 * @param {string[] | undefined} urls
 * @returns {Promise<Array<{ src: string, caption: string }>>}
 */
export async function enrichGallery(urls) {
  if (!urls?.length) return [];

  configureCloudinary();

  return Promise.all(
    urls.map(async (src) => {
      const publicId = extractPublicId(src);
      if (!publicId) {
        console.warn(`[cloudinary-gallery] Could not extract public_id from URL: ${src}`);
        return { src, caption: '' };
      }

      try {
        const resource = await cloudinary.api.resource(publicId, { context: true });
        return { src, caption: captionFromResource(resource) };
      } catch (err) {
        console.warn(
          `[cloudinary-gallery] Failed to fetch metadata for ${publicId}: ${err.message}`,
        );
        return { src, caption: '' };
      }
    }),
  );
}
