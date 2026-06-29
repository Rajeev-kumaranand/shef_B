import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SEOManager from '../components/common/SEOManager.jsx';
import Container from '../components/common/Container.jsx';
import LoadingState from '../components/admin/states/LoadingState.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import ImageReveal from '../components/common/ImageReveal.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ArticleDetails() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_URL}/magazine/articles/${slug}`);
        if (res.data.success) {
          setArticle(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load article', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading || !article) return <LoadingState />;

  // Manually construct an SEO object if fields exist
  const articleSeo = {
    seoTitle: article.metaTitle || article.title,
    seoDescription: article.metaDescription || article.excerpt,
    seoKeywords: article.keywords || article.tags?.map(t => t.tag.name).join(', '),
    slug: `magazine/${article.slug}`,
    image: article.ogImage || article.featuredImage,
    name: article.title,
    shortDesc: article.excerpt
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-primary)', paddingBottom: '120px' }}>
      <SEOManager productSeo={articleSeo} />

      {/* Article Hero */}
      <div style={{ position: 'relative', height: '80vh', width: '100%', background: 'var(--surface-secondary)' }}>
        {article.featuredImage && (
          <img src={article.featuredImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)' }} />

        <Container width="standard" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: '80px', color: 'white' }}>
          <FadeUp>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-secondary)', marginBottom: '16px', display: 'block' }}>
              {article.category?.name}
            </span>
            <h1 style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: '1.1', marginBottom: '24px', maxWidth: '900px' }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {article.author?.image && (
                <img src={article.author.image} alt={article.author.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '16px', fontWeight: 'bold' }}>{article.author?.name}</div>
                <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '14px', opacity: 0.8 }}>
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {article.readTime} min read
                </div>
              </div>
            </div>
          </FadeUp>
        </Container>
      </div>

      {/* Article Content */}
      <Container width="narrow" style={{ marginTop: '80px' }}>
        <FadeUp delay={0.2}>
          {article.excerpt && (
            <p style={{ fontFamily: 'var(--font-secondary)', fontSize: '24px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '60px', fontStyle: 'italic' }}>
              {article.excerpt}
            </p>
          )}

          {/* Render Rich Text */}
          <div
            className="rich-text-content"
            style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: '18px',
              lineHeight: '1.8',
              color: 'var(--text-primary)'
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {article.tags.map(t => (
                <span key={t.tag.id} style={{ padding: '8px 16px', background: 'var(--surface-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t.tag.name}
                </span>
              ))}
            </div>
          )}
        </FadeUp>
      </Container>
    </div>
  );
}
