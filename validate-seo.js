
const https = require('https');
const http = require('http');

const SITE_URL = 'https://www.cangascup.es';
const PAGES_TO_CHECK = [
  '/',
  '/user/2025',
  '/user/2025/rankings',
  '/user/2025/regulations',
  '/sitemap.xml',
  '/robots.txt',
  '/user/2026',
  '/user/2026/rankings',
  '/user/2026/regulations'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          hasContent: data.length > 0,
          hasRedirect: res.statusCode >= 300 && res.statusCode < 400
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT'
      });
    });
  });
}

async function validateSEO() {
  console.log('🔍 Validando SEO de Cangas Cup...');
  console.log('=' .repeat(50));
  
  for (const page of PAGES_TO_CHECK) {
    const fullUrl = SITE_URL + page;
    console.log(`\n📄 Verificando: ${fullUrl}`);
    
    const result = await checkUrl(fullUrl);
    
    if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
    } else if (result.status === 'TIMEOUT') {
      console.log(`⏰ TIMEOUT: La página tardó más de 5 segundos`);
    } else {
      console.log(`📊 Status: ${result.status}`);
      
      if (result.hasRedirect) {
        console.log(`🔄 REDIRECCIÓN detectada - Esto puede afectar SEO`);
        console.log(`📍 Location: ${result.headers.location || 'No especificado'}`);
      } else if (result.status === 200) {
        console.log(`✅ OK - Página accesible`);
        console.log(`📝 Contenido: ${result.hasContent ? 'Sí' : 'No'}`);
      } else {
        console.log(`⚠️  Status no esperado: ${result.status}`);
      }
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Validación completada');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Si hay redirecciones, considera quitarlas');
  console.log('2. Sube el sitemap a Google Search Console');
  console.log('3. Verifica que robots.txt sea accesible');
  console.log('4. Crea contenido regular para mejorar indexación');
}

validateSEO().catch(console.error);

