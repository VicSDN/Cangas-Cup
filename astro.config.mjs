import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import svgr from 'vite-plugin-svgr';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.cangascup.es',
  integrations: [
    tailwind(), 
    react(), 
    sitemap({
      filter: (page) => !page.includes('/admin/'),
      customPages: [
        'https://www.cangascup.es/',
        'https://www.cangascup.es/user/2026',
        'https://www.cangascup.es/user/2025',
        'https://www.cangascup.es/user/2024'
      ]
    })
  ],
  redirects: {
    '/': '/user/2026',
    '/admin': '/admin/signin'
  },
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