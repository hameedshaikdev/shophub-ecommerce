import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xqqrptlpuvkljebmszca.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MHsKz-fsSai4NX04ETbT-g_m4Gewlvc';
const BASE_URL = 'https://asmalabel.in';

async function generateSitemap() {
  console.log('Generating sitemap.xml...');

  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
  ];

  let productUrls = [];

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,updated_at,active&active=eq.true`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const products = await response.json();
      if (Array.isArray(products)) {
        productUrls = products.map(p => ({
          loc: `${BASE_URL}/product/${p.id}`,
          lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          priority: '0.7',
          changefreq: 'weekly'
        }));
        console.log(`Fetched ${products.length} active products for sitemap.`);
      }
    } else {
      console.warn('Could not fetch products from Supabase. Status:', response.status);
    }
  } catch (err) {
    console.error('Error fetching products for sitemap:', err.message);
  }

  const allUrls = [...staticUrls, ...productUrls];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
  console.log(`Successfully generated sitemap.xml with ${allUrls.length} URLs at ${sitemapPath}`);
}

generateSitemap();
