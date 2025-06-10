import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import svgr from 'vite-plugin-svgr';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  redirects: {
    '/admin': '/admin/signin'
  },
   site: 'https://www.cangascup.es',
  integrations: [tailwind(), react(), sitemap()],
  prefetch: true,
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
    maxDuration: 60,
  }),
  vite: {
    plugins: [svgr()],
    build: {
      sourcemap: false,
    },
  },
   server: {
    host: 'localhost',
    port: 4321,
  },
});