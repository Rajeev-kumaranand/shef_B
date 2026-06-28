import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Discover.module.css';

// Import static images
import img23_1 from '../assets/slidesImages/slide23-1.jpg';
import img23_2 from '../assets/slidesImages/slide23-2.jpg';
import img23_3 from '../assets/slidesImages/slide23-3.jpg';
import img24_1 from '../assets/slidesImages/slide24-1.jpg';
import img24_2 from '../assets/slidesImages/slide24-2.jpg';
import img24_3 from '../assets/slidesImages/slide24-3.jpg';
import img21 from '../assets/slidesImages/slide21.jpg';
import img22 from '../assets/slidesImages/slide22.jpg';

import img1 from '../assets/slidesImages/slide1.jpg';
import img2 from '../assets/slidesImages/slide2.jpg';
import img3 from '../assets/slidesImages/slide3.jpg';
import img4 from '../assets/slidesImages/slide4.jpg';
import img5 from '../assets/slidesImages/slide5.jpg';
import img6 from '../assets/slidesImages/slide6.jpg';

export default function Discover() {
  const targetRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  
  // We have 6 slides with explicit widths:
  // Slide 1 (Portfolio 1): 80vw
  // Slide 2 (Portfolio 2): 80vw
  // Slide 3 (Intro): 40vw
  // Slide 4 (Gallery 1): 80vw
  // Slide 5 (Gallery 2): 80vw
  // Slide 6 (Outro): 40vw
  // Total Width = 400vw.
  // To reach the end, we translate by -(400vw - 100vw viewport) = -300vw.
  const x = useTransform(smoothProgress, [0, 1], ["0vw", "-300vw"]);

  return (
    <div className={styles.discoverPage}>
      <SEOManager pageKey="discover" />
      
      <section ref={targetRef} className={styles.scrollSection}>
        <div className={styles.stickyContainer}>
          <motion.div style={isDesktop ? { x } : {}} className={styles.horizontalTrack}>
            
            {/* Slide 1 - Portfolio 1 */}
            <div className={styles.portfolioSlide} style={{ width: '80vw' }}>
              <img src={img23_1} alt="Portfolio" className={`${styles.absImg} ${styles.img23_1}`} loading="eager" />
              <img src={img23_2} alt="Portfolio" className={`${styles.absImg} ${styles.img23_2}`} loading="eager" />
              <img src={img23_3} alt="Portfolio" className={`${styles.absImg} ${styles.img23_3}`} loading="eager" />
              <img src={img21} alt="Portfolio" className={`${styles.absImg} ${styles.img21}`} loading="eager" />
            </div>

            {/* Slide 2 - Portfolio 2 */}
            <div className={styles.portfolioSlide} style={{ width: '80vw' }}>
              <img src={img24_1} alt="Portfolio" className={`${styles.absImg} ${styles.img24_1}`} loading="eager" />
              <img src={img24_2} alt="Portfolio" className={`${styles.absImg} ${styles.img24_2}`} loading="eager" />
              <img src={img24_3} alt="Portfolio" className={`${styles.absImg} ${styles.img24_3}`} loading="eager" />
              <img src={img22} alt="Portfolio" className={`${styles.absImg} ${styles.img22}`} loading="eager" />
            </div>

            {/* Slide 3 - Intro / Hero (Compact width to reduce empty space) */}
            <div style={{ width: '40vw', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <div className={styles.introSlide} style={{ width: '100%', padding: '0 2vw' }}>
                <h1 className={styles.heroTitle}>Discover</h1>
                <p className={styles.heroSubtitle}>Design that defines you</p>
                <p className={styles.heroDesc}>Explore our extensive portfolio of interior designs, where every space tells a unique story of style, comfort, and innovation.</p>
              </div>
            </div>

            {/* Slide 4 - Gallery Collage 1 */}
            <div className={styles.portfolioSlide} style={{ width: '80vw' }}>
              <img src={img1} alt="Gallery" className={`${styles.absImg} ${styles.img23_1}`} loading="lazy" />
              <img src={img2} alt="Gallery" className={`${styles.absImg} ${styles.img23_2}`} loading="lazy" />
              <img src={img3} alt="Gallery" className={`${styles.absImg} ${styles.img23_3}`} loading="lazy" />
            </div>

            {/* Slide 5 - Gallery Collage 2 */}
            <div className={styles.portfolioSlide} style={{ width: '80vw' }}>
              <img src={img4} alt="Gallery" className={`${styles.absImg} ${styles.img24_1}`} loading="lazy" />
              <img src={img5} alt="Gallery" className={`${styles.absImg} ${styles.img24_2}`} loading="lazy" />
              <img src={img6} alt="Gallery" className={`${styles.absImg} ${styles.img24_3}`} loading="lazy" />
            </div>

            {/* Slide 6 - Outro (Compact width) */}
            <div style={{ width: '40vw', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <div className={styles.outroSlide}>
                <h2 className={styles.outroTitle}>Explore Further</h2>
                <a href="/shop" className={styles.outroCta}>Shop Now</a>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

    </div>
  );
}
