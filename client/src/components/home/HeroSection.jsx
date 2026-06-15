import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../common/Skeleton.jsx';
import styles from './HeroSection.module.css';

export default function HeroSection({ content, slidesData, loading }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const resolvedSlides = useMemo(() => {
    if (!slidesData || !Array.isArray(slidesData) || slidesData.length === 0) return [];

    // If data comes from the API, it has the 'active' property. Use dynamic slides.
    if (slidesData[0].hasOwnProperty('active')) {
      return slidesData
        .filter(s => s.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    // Otherwise, it's the static fallback data. Map it using the hardcoded IDs.
    if (content?.slides) {
      return content.slides
        .map(id => slidesData.find(s => s.id === id))
        .filter(Boolean);
    }

    return slidesData.slice(0, 5);
  }, [slidesData, content?.slides]);

  useEffect(() => {
    if (resolvedSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % resolvedSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [resolvedSlides.length]);

  return (
    <section className={styles.hero}>
      {loading ? (
        <Skeleton width="100%" height="100vh" />
      ) : (
        <>
          <div className={styles.slideshowContainer}>
            <AnimatePresence mode="popLayout">
              {resolvedSlides.length > 0 && (
                <motion.div
                  key={currentIndex}
                  className={styles.slide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  style={{ backgroundImage: `url(${resolvedSlides[currentIndex].url})` }}
                />
              )}
            </AnimatePresence>
            <div className={styles.overlay} />
          </div>

          <div className={styles.content}>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
            >
              {content?.title}
            </motion.h1>
            
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            >
              {content?.tagline}
            </motion.p>
          </div>

          <div className={styles.scrollIndicator}>
            <span className={styles.scrollText}>{content?.scrollText}</span>
            <div className={styles.scrollLineContainer}>
              <motion.div
                className={styles.scrollLine}
                animate={{ y: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
