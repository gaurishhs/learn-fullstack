// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import liveCodeBlocks, { preserveFenceMetadata } from './src/plugins/live-code-blocks.js';
import markdownCallouts from './src/plugins/markdown-callouts.js';

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: satteri({ hastPlugins: [liveCodeBlocks, markdownCallouts] }),
    shikiConfig: { transformers: [preserveFenceMetadata] },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
