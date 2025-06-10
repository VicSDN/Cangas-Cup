export const prerender = true;

const SITE_URL = 'https://www.cangascup.es';

// Define your main pages
const staticPages = [
  '',
  '/user/2025',
  '/user/2025/rankings',
  '/user/2025/regulations',
  '/user/2025/directo',
  '/user/2024',
  '/user/2024/teams',
  '/user/2024/rankings',
  '/user/2024/regulations',
  '/user/2024/teamsandresults',
  '/user/2024/results',
];

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map((page) => {
    return `  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' ? 'daily' : page === '/user/2025' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page === '/user/2025' ? '0.9' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=86400', // 24 hours
    },
  });
}
