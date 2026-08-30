import fs from 'fs';
import path from 'path';

export const CACHE_PATH = path.resolve('src/_data/cloudinary-gallery-cache.json');

export function loadCache() {
    try {
        if (fs.existsSync(CACHE_PATH)) {
            return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
        }
    } catch (err) {
        console.warn(`[cloudinary-gallery] Failed to read cache: ${err.message}`);
    }

    return {};
}

export function writeCache(cache) {
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
}
