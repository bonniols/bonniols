import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addCollection('projectsSorted', (collectionApi) => {
    const orderValue = (item) => {
      const n = Number(item.data.order);
      return Number.isFinite(n) ? n : Infinity;
    };
    return collectionApi.getFilteredByTag('projects').sort((a, b) => {
      const diff = orderValue(a) - orderValue(b);
      if (diff !== 0) return diff;
      return String(a.data.title || '').localeCompare(String(b.data.title || ''), undefined, {
        sensitivity: 'base',
      });
    });
  });

  // Decap / Netlify CMS loads /admin/config.yml (path is project-root-relative)
  eleventyConfig.addPassthroughCopy('src/admin/config.yml');
  eleventyConfig.addPassthroughCopy('src/assets/img');
  eleventyConfig.addPassthroughCopy('src/assets/js');
  eleventyConfig.addPassthroughCopy({
    'node_modules/swiper/swiper-bundle.min.js': 'assets/vendor/swiper/swiper-bundle.min.js',
    'node_modules/swiper/swiper-bundle.min.css': 'assets/vendor/swiper/swiper-bundle.min.css',
  });

  //compile tailwind before eleventy processes the files
  eleventyConfig.on('eleventy.before', async () => {
    const tailwindInputPath = path.resolve('./src/assets/css/main.css');

    const tailwindOutputPath = './_site/assets/css/main.css';

    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');

    const outputDir = path.dirname(tailwindOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await processor.process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  const processor = postcss([
    //compile tailwind
    tailwindcss(),

    //minify tailwind css
    cssnano({
      preset: 'default',
    }),
  ]);

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
    },
    htmlTemplateEngine: 'liquid',
    markdownTemplateEngine: 'liquid',
  };
}