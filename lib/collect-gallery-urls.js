import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src');

function galleryUrlsFromMarkdown(content) {
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) return [];

    const frontmatter = frontmatterMatch[1];
    if (!/^gallery:/m.test(frontmatter)) return [];

    const urls = [];
    let inGallery = false;

    for (const line of frontmatter.split('\n')) {
        if (/^gallery:\s*$/.test(line)) {
            inGallery = true;
            continue;
        }

        if (!inGallery) continue;

        const itemMatch = line.match(/^\s+-\s+(https?:\/\/.+)/);
        if (itemMatch) {
            urls.push(itemMatch[1].trim());
            continue;
        }

        if (/^\S/.test(line)) break;
    }

    return urls;
}

export function collectGalleryUrls() {
    const urls = new Set();

    const homePath = path.join(ROOT, '_data/home.json');
    const home = JSON.parse(fs.readFileSync(homePath, 'utf8'));
    for (const src of home.home_gallery ?? []) {
        urls.add(src);
    }

    const projectsDir = path.join(ROOT, 'projects');
    for (const filename of fs.readdirSync(projectsDir)) {
        if (!filename.endsWith('.md')) continue;

        const content = fs.readFileSync(path.join(projectsDir, filename), 'utf8');
        for (const src of galleryUrlsFromMarkdown(content)) {
            urls.add(src);
        }
    }

    return [...urls];
}
