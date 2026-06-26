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
      {/* 1. Custom Hero */}
      <div className={styles.shopHero}>
        <div className={styles.shopHeroLeft}>
          <div className={styles.breadcrumb}>
            <Link to="/">HOME</Link> / <span>SHOP ALL</span>
          </div>
          <div className={styles.shopHeroTextContent}>
            <h1 className={styles.shopHeroTitle}>{content.heroTitle || 'Shop All'}</h1>
            <p className={styles.shopHeroDesc}>
              {content.heroDescription?.[0]?.value || 'Save 35% when you subscribe. Build your Ritual this summer.'}
            </p>
          </div>
        </div>
        <div className={styles.shopHeroRight}>
          <div className={styles.shopHeroImageWrapper}>
            <img src={getImageUrl(content.heroImage) || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop'} alt={content.heroTitle || 'Shop All'} />
            {/* Summer Sale Floating Circles */}
            <div className={styles.floatingCircles}>
              {[
                { l: 'S', y: -20 },
                { l: 'U', y: 30 },
                { l: 'M', y: -10 },
                { l: 'M', y: 40 },
                { l: 'E', y: 30 },
                { l: 'R', y: -20 },
                { l: '', y: 0 },
                { l: 'S', y: -10 },
                { l: 'A', y: 30 },
                { l: 'L', y: -20 },
                { l: 'E', y: 20 }
              ].map((item, idx) => {
                if (!item.l) return <div key={idx} style={{ width: '24px' }}></div>;
                return <span key={idx} className={styles.circleLetter} style={{ transform: `translateY(${item.y}px)` }}>{item.l}</span>
              })}
            </div>
            {/* Badge */}
            <div className={styles.badgeOval}>
              <span className={styles.badgeTop}>Up To</span>
              <span className={styles.badgeBottom}>35% Off</span>
            </div>
          </div>
        </div>
      </div>

      

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
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#666666' }}>
                  <p style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', marginBottom: '1rem', color: '#000000' }}>No pieces available.</p>
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
                            style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: isWished ? 'red' : '#000000' }}
                          >
                            {isWished ? '♥' : '♡'}
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); addToCart(product); }}
                            disabled={stockStatus === 'out'}
                            style={{
                              background: stockStatus === 'out' ? '#cccccc' : '#000000',
                              color: '#ffffff',
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

      {/* 2. Special Products Section */}
      <div className={styles.specialSection}>
        <h2 className={styles.specialTitle}>More daily essentials backed by the first visible supply chain of its kind.</h2>
        <div className={styles.specialCategories}>
          {[
            { name: 'Multivitamin &\nNutrients', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80' },
            { name: 'Gut Health', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80' },
            { name: 'Skin Health', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80' },
            { name: 'Relaxation', image: 'https://images.unsplash.com/photo-1511295742362-92c96b12a818?auto=format&fit=crop&w=400&q=80' },
            { name: 'Performance &\nRecovery', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80' }
          ].map((cat, i) => (
            <div key={i} className={styles.specialCategoryCard}>
              <div className={styles.specialCategoryImgWrapper}>
                <img src={cat.image} alt={cat.name.replace('\n', ' ')} loading="lazy" />
              </div>
              <h4 className={styles.specialCategoryName}>{cat.name}</h4>
            </div>
          ))}
        </div>
        
        {/* Ticker */}
        <div className={styles.tickerWrapper}>
          <div className={styles.tickerContent}>
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: 'flex' }}>
                {[
                  { text: 'NO SYNTHETIC COLORANTS', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg> },
                  { text: 'TRACEABLE NUTRIENTS', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
                  { text: 'THIRD-PARTY TESTED (FOR MICROBES AND HEAVY METALS)', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
                  { text: 'NON-GMO', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg> },
                  { text: 'VEGAN', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path><path d="M8 12s1.5 2 4 2 4-2 4-2"></path><path d="M12 16v4"></path></svg> }
                ].map((item, j) => (
                  <div key={j} className={styles.tickerItem}>
                    <span className={styles.tickerIcon}>{item.icon}</span>
                    <span className={styles.tickerText}>{item.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 4. Collection Story */}
      {/* <Section className={styles.storySection} spacing="large">
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
      </Section> */}

      {/* 5. Ritual CTA Section */}
      <div className={styles.ritualCtaWrapper}>
        <div className={styles.ritualCtaTop}>
          <div className={styles.ritualCtaTopLeft}>
            <h2 className={styles.ritualCtaTitle}>You deserve a Ritual rooted in science.</h2>
          </div>
          <div className={styles.ritualCtaTopRight}>
            <p className={styles.ritualCtaDesc}>
              Whether you're looking to support your daily health with a multivitamin, discover groundbreaking support for stress and sleep, or just need a prenatal that you can trust—we've got you covered. We believe that clean, high-quality, and science-backed supplements should be the standard, not the exception.*
            </p>
          </div>
        </div>

        <div className={styles.ritualCtaBottom}>
          <div className={styles.ritualCtaBottomLeft}>
            <h3 className={styles.emailCtaTitle}>We have high standards<br/>for emails too.</h3>
          </div>
          <div className={styles.ritualCtaBottomRight}>
            <form className={styles.emailForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className={styles.emailInput} required />
              <button type="submit" className={styles.emailSubmitBtn}>Subscribe</button>
            </form>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a href="#" aria-label="Pinterest"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="12" x2="12" y2="22"></line><path d="M12 2a10 10 0 0 0-5.74 18.2C6 19 6.5 17 6.5 17s-.5-1-.5-2.5C6 10 8.5 8 11.5 8s5 2 5 5-2.5 5.5-5 5.5c-1 0-2-.5-2-1.5 0-1 .5-2 1.5-2"></path></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
              <a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg></a>
            </div>
          </div>
        </div>
        <div className={styles.ritualCtaFooterLine}></div>
      </div>

    </div>
  );
}
