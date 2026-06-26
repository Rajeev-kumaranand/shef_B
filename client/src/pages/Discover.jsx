import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useDiscoverContent } from '../hooks/useApi.js';
import LoadingState from '../components/admin/states/LoadingState.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Discover.module.css';

// Import static portfolio images
import img23_1 from '../assets/slidesImages/slide23-1.jpg';
import img23_2 from '../assets/slidesImages/slide23-2.jpg';
import img23_3 from '../assets/slidesImages/slide23-3.jpg';
import img24_1 from '../assets/slidesImages/slide24-1.jpg';
import img24_2 from '../assets/slidesImages/slide24-2.jpg';
import img24_3 from '../assets/slidesImages/slide24-3.jpg';
import img21 from '../assets/slidesImages/slide21.jpg';
import img22 from '../assets/slidesImages/slide22.jpg';

export default function Discover() {
  const { data: content, loading } = useDiscoverContent();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Scroll track horizontally as user scrolls vertically
  // Using consistent calc strings allows Framer Motion to interpolate the values smoothly
  const x = useTransform(scrollYProgress, [0, 1], ["calc(0% + 0vw)", "calc(-100% + 100vw)"]);

  // Combine images to create a continuous overlapping collage
  const allImages = useMemo(() => {
    const images = [];
    if (!content) return images;

    const { hero, values: valuesGrid, gallery: editorialGallery } = content;

    if (hero?.image) {
      images.push({ url: hero.image, type: 'hero', title: hero.title || '' });
    }
    
    if (valuesGrid?.cards) {
      valuesGrid.cards.forEach(c => {
        if (c.image?.url) images.push({ url: c.image.url, type: 'value', title: c.title });
      });
    }

    if (editorialGallery?.images) {
      editorialGallery.images.forEach(img => {
        if (img?.url) images.push({ url: img.url, type: 'gallery', title: '' });
      });
    }

    return images;
  }, [content]);

  if (loading || !content) return <LoadingState />;

  const { hero } = content;

  const getImageUrl = (path) => {
    if (!path) return '';
    const pathStr = typeof path === 'object' ? (path.url || path.src || '') : path;
    if (!pathStr || typeof pathStr !== 'string') return '';
    if (pathStr.startsWith('http')) return pathStr;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${pathStr}`;
  };

  return (
    <div className={styles.discoverPage}>
      <SEOManager pageKey="discover" />
      
      <section ref={targetRef} className={styles.scrollSection}>
        <div className={styles.stickyContainer}>
          <motion.div style={{ x }} className={styles.horizontalTrack}>
            
            {/* Custom Portfolio Slide 1 */}
            <div className={styles.portfolioSlide}>
              <img src={img23_1} alt="Portfolio Living Room" className={`${styles.absImg} ${styles.img23_1}`} loading="eager" />
              <img src={img23_2} alt="Portfolio Bathroom" className={`${styles.absImg} ${styles.img23_2}`} loading="eager" />
              <img src={img23_3} alt="Portfolio Bedroom" className={`${styles.absImg} ${styles.img23_3}`} loading="eager" />
              <img src={img21} alt="Portfolio Extra 1" className={`${styles.absImg} ${styles.img21}`} loading="eager" />
            </div>

            {/* Custom Portfolio Slide 2 */}
            <div className={styles.portfolioSlide}>
              <img src={img24_1} alt="Portfolio Cafe/Lounge" className={`${styles.absImg} ${styles.img24_1}`} loading="lazy" />
              <img src={img24_2} alt="Portfolio Top Down Living Room" className={`${styles.absImg} ${styles.img24_2}`} loading="lazy" />
              <img src={img24_3} alt="Portfolio Plaid Bedroom" className={`${styles.absImg} ${styles.img24_3}`} loading="lazy" />
              <img src={img22} alt="Portfolio Extra 2" className={`${styles.absImg} ${styles.img22}`} loading="lazy" />
            </div>

            {/* Intro Slide */}
            <div className={styles.introSlide}>
              <h1 className={styles.heroTitle}>{hero?.title || 'Discover'}</h1>
              <p className={styles.heroSubtitle}>{hero?.subtitle}</p>
              <p className={styles.heroDesc}>{hero?.description}</p>
            </div>

            {/* Collage Slides */}
            {allImages.map((item, idx) => {
              // Generate pseudo-random layouts based on index
              const sizeClass = idx % 3 === 0 ? styles.sizeLarge : idx % 3 === 1 ? styles.sizeMedium : styles.sizeSmall;
              const alignClass = idx % 2 === 0 ? styles.alignTop : styles.alignBottom;
              const offsetClass = idx % 4 === 0 ? styles.offsetRight : idx % 4 === 2 ? styles.offsetLeft : '';

              return (
                <div key={idx} className={`${styles.imageSlide} ${alignClass}`}>
                  <div className={`${styles.imageWrapper} ${sizeClass} ${offsetClass}`}>
                    <img src={getImageUrl(item.url)} alt={item.title || `Gallery image ${idx}`} loading="lazy" />
                    {item.title && <h3 className={styles.imageOverlayTitle}>{item.title}</h3>}
                  </div>
                </div>
              );
            })}

            {/* Outro Slide */}
            <div className={styles.outroSlide}>
              <h2 className={styles.outroTitle}>{content.cta?.title || "Explore Further"}</h2>
              <a href={content.cta?.link || "/shop"} className={styles.outroCta}>{content.cta?.buttonText || "Shop Now"}</a>
            </div>

          </motion.div>
        </div>
      </section>

    </div>
  );
}
