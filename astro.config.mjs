import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  redirects: {
    '/': '/user/2025',
    '/admin': '/admin/signin'
  },

  integrations: [
    tailwind(),
    react()
  ],
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
