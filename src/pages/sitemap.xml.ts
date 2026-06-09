export const prerender = true;

const SITE_URL = 'https://www.cangascup.es';

const pages = [
  { url: '',                          changefreq: 'daily',   priority: '1.0' },
  { url: '/user/2026',                changefreq: 'daily',   priority: '1.0' },
  { url: '/user/2026/rankings',       changefreq: 'daily',   priority: '0.9' },
  { url: '/user/2026/regulations',    changefreq: 'monthly', priority: '0.7' },
  { url: '/user/2026/directo',        changefreq: 'daily',   priority: '0.8' },
  { url: '/user/2025',                changefreq: 'monthly', priority: '0.6' },
  { url: '/user/2025/rankings',       changefreq: 'monthly', priority: '0.5' },
  { url: '/user/2025/regulations',    changefreq: 'yearly',  priority: '0.4' },
  { url: '/user/2025/directo',        changefreq: 'yearly',  priority: '0.3' },
  { url: '/user/2024',                changefreq: 'yearly',  priority: '0.4' },
  { url: '/user/2024/teams',          changefreq: 'yearly',  priority: '0.3' },
  { url: '/user/2024/rankings',       changefreq: 'yearly',  priority: '0.3' },
  { url: '/user/2024/regulations',    changefreq: 'yearly',  priority: '0.3' },
  { url: '/user/2024/teamsandresults',changefreq: 'yearly',  priority: '0.3' },
  { url: '/user/2024/results',        changefreq: 'yearly',  priority: '0.3' },
];

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(({ url, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600',
    },
  });
}
