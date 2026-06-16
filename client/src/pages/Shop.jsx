import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useShopContent } from '../hooks/useShopContent.js';
import { useProducts } from '../hooks/useProducts.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import ImageReveal from '../components/common/ImageReveal.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import EditorialHero from '../components/common/EditorialHero.jsx';
import LoadingState from '../components/admin/states/LoadingState.jsx';
import styles from './Shop.module.css';

import SEOManager from '../components/common/SEOManager.jsx';

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: content, loading: contentLoading } = useShopContent();
  const { data: products, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const dynamicCategories = useMemo(() => {
    if (!products) return [{ id: 'all', label: 'All Objects' }];
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return [
      { id: 'all', label: 'All Objects' },
      ...Array.from(cats).map(c => ({ id: c.toLowerCase(), label: c }))
    ];
  }, [products]);

  if (contentLoading || productsLoading) return <LoadingState />;
  if (!content) return null;

  // Derive product collections from the single source of truth (DB)
  const activeProducts = products.filter(p => p.active);
  const featuredProducts = activeProducts.filter(p => p.featured);
  const filteredProducts = activeCategory === 'all' 
    ? activeProducts 
    : activeProducts.filter(p => p.category?.toLowerCase() === activeCategory);

  const getImageUrl = (path) => {
    if (!path) return '/logo.png';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${path}`;
  };

  return (
    <div className={styles.shopPage}>
      <SEOManager pageKey="shop" />
      {/* 1. Hero */}
      <EditorialHero 
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        description={content.heroDescription?.[0]?.value || ''}
        image={content.heroImage}
        // image={slide0}
      />

      {/* 2. Featured Collection (From Live Products) */}
      {featuredProducts.length > 0 && (
        <Section className={styles.featuredSection} spacing="large" background="darkGray">
          <Container width="wide">
            <SectionTitle title="Featured Objects" className={styles.inverseTitle} />
            <div className={styles.featuredGrid}>
              {featuredProducts.map((product, idx) => (
                <FadeUp key={product.id} delay={idx * 0.1} className={styles.featuredCard}>
                  <Link to={`/shop/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.featuredImageWrapper}>
                      <ImageReveal src={getImageUrl(product.image)} alt={product.name} aspectRatio="portrait" />
                    </div>
                    <div className={styles.featuredInfo}>
                      <h3 className={styles.productNameInverse}>{product.name}</h3>
                      <p className={styles.productPriceInverse}>${parseFloat(product.price).toFixed(2)}</p>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 3. Product Grid */}
      <Section className={styles.listingSection} spacing="large">
        <Container width="wide">
          <SectionTitle title="The Collection" alignment="center" />
          
          <div className={styles.categoryNav}>
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <motion.div layout className={styles.productGrid}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                  <p style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', marginBottom: '1rem' }}>No pieces available.</p>
                  <p style={{ fontSize: '0.875rem' }}>Our artisans are currently crafting new items for this collection.</p>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isWished = isInWishlist(product.id);
                  
                  // Compute rating
                  const reviews = product.reviews || [];
                  const avgRating = reviews.length > 0 
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
                    : null;

                  // Compute stock status
                  let stockStatus = null;
                  if (product.trackInventory) {
                    if (product.stock === 0) stockStatus = 'out';
                    else if (product.stock <= product.lowStockThreshold) stockStatus = 'low';
                  }

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={styles.productCard}
                    >
                      <Link to={`/shop/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', position: 'relative', display: 'block' }}>
                        <div className={styles.cardImageWrapper}>
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name} 
                            className={styles.cardImageMain} 
                            loading="lazy"
                            style={stockStatus === 'out' ? { opacity: 0.5, filter: 'grayscale(1)' } : {}}
                          />
                          {stockStatus === 'out' && <div className={styles.outOfStockBadge}>Out of Stock</div>}
                        </div>
                      </Link>
                      <div className={styles.cardInfo}>
                        <div>
                          <Link to={`/shop/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h4 className={styles.cardTitle}>{product.name}</h4>
                          </Link>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p className={styles.cardPrice}>${parseFloat(product.price).toFixed(2)}</p>
                            {avgRating && (
                              <span style={{ fontSize: '12px', color: '#eab308', display: 'flex', alignItems: 'center' }}>
                                ★ {avgRating}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                            style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: isWished ? 'red' : 'inherit' }}
                          >
                            {isWished ? '♥' : '♡'}
                          </button>
                          <button 
                            onClick={(e) => { e.preventDefault(); addToCart(product); }}
                            disabled={stockStatus === 'out'}
                            style={{ 
                              background: stockStatus === 'out' ? '#ccc' : 'var(--brand-black)', 
                              color: 'white', 
                              border: 'none', 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              cursor: stockStatus === 'out' ? 'not-allowed' : 'pointer', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className={styles.cardDescription}>{product.shortDesc}</p>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        </Container>
      </Section>

      {/* 4. Collection Story */}
      <Section className={styles.storySection} spacing="large">
        <Container width="narrow">
          <SectionTitle title={content.storyTitle} alignment="center" />
          <div className={styles.storyText}>
            {content.storyParagraphs?.map((p, idx) => (
              <FadeUp key={idx} delay={0.1 * idx}>
                <p className={styles.storyParagraph}>{typeof p === 'object' ? p.value : p}</p>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. CTA */}
      <Section spacing="large" className={styles.ctaSection}>
        <Container width="narrow" className={styles.ctaContainer}>
          <FadeUp delay={0.1}>
            <h2 className={styles.ctaTitle}>{content.ctaTitle}</h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className={styles.ctaDesc}>{content.ctaDescription}</p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <a href={content.ctaLink} className={styles.ctaBtn}>{content.ctaButtonText}</a>
          </FadeUp>
        </Container>
      </Section>

    </div>
  );
}
