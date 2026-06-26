import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useLatestContent } from '../hooks/useApi.js';
import ArticleCard from '../components/common/ArticleCard.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './TheLatest.module.css';

function TheLatestScrollable({ content }) {
  const targetRef = useRef(null);
  const trackRef = useRef(null);
  const trackWidth = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    if (!trackRef.current) return;
    
    const updateWidth = () => {
      trackWidth.set(trackRef.current.scrollWidth - window.innerWidth);
    };
    
    // Initial measurement
    updateWidth();
    
    // Watch for dynamic content changes (images loading, window resizing)
    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    
    observer.observe(trackRef.current);
    window.addEventListener('resize', updateWidth);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [content]);

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  
  // Map vertical scroll progress to horizontal translation
  const x = useTransform(() => `${smoothProgress.get() * -trackWidth.get()}px`);
  
  // Map scroll section height perfectly 1:1 with track width
  const sectionHeight = useTransform(() => `calc(100vh + ${trackWidth.get()}px)`);

  const { featuredArticle, articles, highlights, newsletter } = content;

  return (
    <div className={styles.latestPage}>
      <SEOManager pageKey="latest" />

      <motion.section ref={targetRef} className={styles.scrollSection} style={{ height: sectionHeight }}>
        <div className={styles.stickyContainer}>
          <motion.div ref={trackRef} style={{ x }} className={styles.horizontalTrack}>
            
            {/* Feature Blog Section -> Slide 1 */}
            <div className={styles.slideBlock} style={{ width: '90vw', padding: '0 2vw', flexShrink: 0 }}>
              <div className={styles.image1FeatureSection} style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                 <div className={styles.image1Grid}>
                    <div className={styles.image1SideCol}>
                       {articles[0] && <ArticleCard article={articles[0]} small={true} />}
                       {articles[1] && <ArticleCard article={articles[1]} small={true} />}
                    </div>
                    <div className={styles.image1MidCol}>
                       {featuredArticle && <ArticleCard article={featuredArticle} middle={true} />}
                    </div>
                    <div className={styles.image1SideCol}>
                       {articles[2] && <ArticleCard article={articles[2]} small={true} />}
                       {articles[3] && <ArticleCard article={articles[3]} small={true} />}
                    </div>
                 </div>
              </div>
            </div>

            {/* Title Slide for Recent Publications */}
            <div className={styles.slideBlock} style={{ width: '20vw', padding: '0 5vw', display: 'flex', alignItems: 'center' }}>
                <h2 className={styles.inverseTitle}>Recent Publications</h2>
            </div>

            {/* Recent Publications -> Slide 2+ */}
            {articles.slice(4).map((article, idx) => (
              <div key={article.id} className={styles.slideBlock} style={{ width: '90vw', padding: '0 4vw', flexShrink: 0 }}>
                <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                  <ArticleCard article={article} />
                </div>
              </div>
            ))}

            {/* Newsletter & Highlights -> Final Slide */}
            <div className={styles.slideBlock} style={{ width: '50vw', padding: '0 5vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className={styles.newsletterWrapper}>
                <h2 className={styles.newsTitle}>{newsletter.title}</h2>
                <p className={styles.newsDesc}>{newsletter.description}</p>
                <div className={styles.formWrapper}>
                  <form className={styles.newsForm} onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className={styles.newsInput}
                      required
                    />
                    <button type="submit" className={styles.newsSubmit}>
                      {newsletter.cta}
                    </button>
                  </form>
                </div>
                <div className={styles.highlightsWrapper}>
                  <p className={styles.highlightsTitle}>{highlights.title}</p>
                  <div className={styles.topics}>
                    {highlights.topics.map((topic, idx) => (
                      <span key={idx} className={styles.topic}>{topic}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default function TheLatest() {
  const { data: content, loading } = useLatestContent();

  if (loading || !content) return <div style={{ minHeight: '100vh', background: 'var(--surface-primary)' }} />;

  return <TheLatestScrollable content={content} />;
}
