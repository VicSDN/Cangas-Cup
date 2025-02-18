import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel';


// https://astro.build/config
export default defineConfig({
  redirects: {
    '/': '/user/2025',
  },
  integrations: [ tailwind()],
  prefetch: true,
  adapter: vercel(),
});