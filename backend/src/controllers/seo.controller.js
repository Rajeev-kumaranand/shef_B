import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get SEO for a specific page key
export const getSeoByPage = async (req, res, next) => {
  try {
    const { pageKey } = req.params;
    let seo = await prisma.sEO.findUnique({ where: { pageKey } });
    
    // If doesn't exist, return empty object with success so frontend doesn't crash
    if (!seo) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: seo });
  } catch (error) {
    next(error);
  }
};

// Update SEO for a specific page key
export const updateSeo = async (req, res, next) => {
  try {
    const { pageKey } = req.params;
    const data = req.body;

    const seo = await prisma.sEO.upsert({
      where: { pageKey },
      update: data,
      create: { ...data, pageKey }
    });

    res.json({ success: true, data: seo });
  } catch (error) {
    next(error);
  }
};

// Generate Sitemap XML
export const generateSitemap = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true }
    });

    const pages = ['home', 'shop', 'discover', 'community', 'contact', 'latest', 'note'];
    const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Pages
    pages.forEach(page => {
      const url = page === 'home' ? BASE_URL : `${BASE_URL}/${page}`;
      xml += `  <url>\n`;
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${page === 'home' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Product Pages
    products.forEach(product => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/shop/${product.slug}</loc>\n`;
      xml += `    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    next(error);
  }
};

// Generate Robots.txt
export const generateRobotsTxt = async (req, res, next) => {
  try {
    const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    let txt = `User-agent: *\n`;
    txt += `Allow: /\n`;
    txt += `Disallow: /admin/\n`;
    txt += `Disallow: /account/\n`;
    txt += `Disallow: /checkout/\n`;
    txt += `\n`;
    txt += `Sitemap: ${BASE_URL}/api/seo/sitemap.xml\n`;

    res.header('Content-Type', 'text/plain');
    res.send(txt);
  } catch (error) {
    next(error);
  }
};
