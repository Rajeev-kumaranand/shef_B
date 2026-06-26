import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEOManager from '../components/common/SEOManager.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import Container from '../components/common/Container.jsx';
import LoadingState from '../components/admin/states/LoadingState.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import ImageReveal from '../components/common/ImageReveal.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Magazine() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${API_URL}/magazine/articles?status=PUBLISHED`);
        if (res.data.success) {
          setArticles(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load magazine content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <LoadingState />;

  const featuredArticle = articles[0];
  const latestArticles = articles.slice(1);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--surface-primary)' }}>
      <SEOManager pageKey="magazine" />

      <Container width="wide">
        <FadeUp>
          <SectionTitle
            title="The Editorial"
            subtitle="Stories on design, craft, and the art of living well."
            alignment="center"
          />
        </FadeUp>

        {featuredArticle && (
          <FadeUp delay={0.2}>
            <Link to={`/magazine/${featuredArticle.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: '80px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                <ImageReveal>
                  <div style={{ aspectRatio: '4/5', background: 'var(--surface-secondary)' }}>
                    {featuredArticle.featuredImage && (
                      <img src={featuredArticle.featuredImage} alt={featuredArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                </ImageReveal>
                <div>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-secondary)', marginBottom: '16px', display: 'block' }}>
                    {featuredArticle.category?.name}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '48px', lineHeight: '1.1', marginBottom: '24px' }}>
                    {featuredArticle.title}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-secondary)', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '32px' }}>
                    {featuredArticle.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {featuredArticle.author?.image && (
                      <img src={featuredArticle.author.image} alt={featuredArticle.author.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '14px', fontWeight: 'bold' }}>{featuredArticle.author?.name}</div>
                      <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px', color: 'var(--text-secondary)' }}>{featuredArticle.readTime} min read</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </FadeUp>
        )}

        {latestArticles.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', paddingBottom: '80px' }}>
            {latestArticles.map((article, index) => (
              <FadeUp key={article.id} delay={index * 0.1}>
                <Link to={`/magazine/${article.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ aspectRatio: '3/4', background: 'var(--surface-secondary)', marginBottom: '24px' }}>
                    {article.featuredImage && (
                      <img src={article.featuredImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-secondary)', marginBottom: '12px', display: 'block' }}>
                    {article.category?.name}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '24px', lineHeight: '1.2', marginBottom: '12px' }}>
                    {article.title}
                  </h3>
                  <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    By {article.author?.name} · {article.readTime} min read
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
