import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

const seoCache = new Map();

export default function SEOManager({ pageKey, productSeo = null }) {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    // If product SEO is provided, use it directly (don't fetch)
    if (productSeo) {
      setSeoData({
        title: productSeo.seoTitle || productSeo.name,
        description: productSeo.seoDescription || productSeo.shortDesc || '',
        keywords: productSeo.seoKeywords || '',
        canonicalUrl: `${FRONTEND_URL}/shop/${productSeo.slug}`,
        ogTitle: productSeo.seoTitle || productSeo.name,
        ogDescription: productSeo.seoDescription || productSeo.shortDesc || '',
        ogImage: productSeo.image ? `${FRONTEND_URL}${productSeo.image}` : '',
        twitterTitle: productSeo.seoTitle || productSeo.name,
        twitterDescription: productSeo.seoDescription || productSeo.shortDesc || '',
        twitterImage: productSeo.image ? `${FRONTEND_URL}${productSeo.image}` : '',
      });
      return;
    }

    if (!pageKey) return;

    // Check cache
    if (seoCache.has(pageKey)) {
      setSeoData(seoCache.get(pageKey));
      return;
    }

    // Fetch from API
    const fetchSeo = async () => {
      try {
        const res = await axios.get(`${API_URL}/seo/${pageKey}`);
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          seoCache.set(pageKey, data);
          setSeoData(data);
        }
      } catch (err) {
        console.error('Failed to fetch SEO for', pageKey);
      }
    };

    fetchSeo();
  }, [pageKey, productSeo]);

  if (!seoData) return null;

  const defaultTitle = "shef&B - Elegant Home Goods";
  const title = seoData.title || defaultTitle;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={seoData.description || ''} />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      {seoData.canonicalUrl && <link rel="canonical" href={seoData.canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={seoData.ogTitle || title} />
      <meta property="og:description" content={seoData.ogDescription || seoData.description || ''} />
      {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoData.canonicalUrl || window.location.href} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.twitterTitle || seoData.ogTitle || title} />
      <meta name="twitter:description" content={seoData.twitterDescription || seoData.ogDescription || seoData.description || ''} />
      {seoData.twitterImage && <meta name="twitter:image" content={seoData.twitterImage} />}

      {/* JSON-LD Schema */}
      {seoData.schemaMarkup && (
        <script type="application/ld+json">
          {seoData.schemaMarkup}
        </script>
      )}
    </Helmet>
  );
}
