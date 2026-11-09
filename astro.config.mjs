// @ts-check
import { defineConfig } from 'astro/config';

// User site on GitHub Pages: served from the domain root, so no `base` is needed.
export default defineConfig({
  site: 'https://tayyab-tahir1.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
