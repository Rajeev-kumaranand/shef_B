import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHomeContent } from '../hooks/useApi.js';
import { slidesData } from '../data/slidesData.js';
import HeroSection from '../components/home/HeroSection.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Home.module.css';

// Keep old sections commented out for future reference per user request
/*
import StorySection from '../components/home/StorySection.jsx';
import VisionSection from '../components/home/VisionSection.jsx';
import FounderSection from '../components/home/FounderSection.jsx';
import ExperienceSection from '../components/home/ExperienceSection.jsx';
import GallerySection from '../components/home/GallerySection.jsx';
import JourneySection from '../components/home/JourneySection.jsx';
import ContactSection from '../components/home/ContactSection.jsx';
*/

export default function Home() {
  const { data: content, loading } = useHomeContent();
  const navigate = useNavigate();
  const shopTriggerRef = useRef(null);

  // Take a few nice slide images for the full-screen Zara-style experience
  // Filter out any slides that might not exist or use the first 5
  const fullScreenImages = slidesData.slice(1, 6);
  // Grab 9 images for the massive Zara-style collage grid
  const collageImages = slidesData.slice(6, 15);

  // Implement scroll-to-shop behavior with 5-second delay
  useEffect(() => {
    let timeoutId;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Start 5 second timer to navigate
          timeoutId = setTimeout(() => {
            navigate('/shop');
            // Force scroll to top immediately after navigation triggers
            window.scrollTo(0, 0);
          }, 5000);
        } else {
          // Clear timer if user scrolls away from the bottom
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      },
      {
        root: null, // Use viewport
        rootMargin: '0px',
        threshold: 0.1, // Trigger as soon as 10% of the trigger is visible
      }
    );

    if (shopTriggerRef.current) {
      observer.observe(shopTriggerRef.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (shopTriggerRef.current) observer.unobserve(shopTriggerRef.current);
    };
  }, [navigate]);

  return (
    <div className={styles.homeContainer}>
      <SEOManager pageKey="home" />
      
      {/* 
        Zara-Style Snap Scrolling:
        Each section inside homeContainer has height: 100vh and scroll-snap-align: start 
      */}

      {/* Slide 1: Existing Hero Section */}
      <section className={styles.snapSection}>
        <div style={{ height: '100%', width: '100%' }}>
          <HeroSection content={content?.hero} slidesData={slidesData} loading={loading} />
        </div>
      </section>

      {/* Slide 2: Zara Collage Grid */}
      {collageImages.length >= 9 && (
        <section className={styles.snapSection}>
          <div className={styles.imageOverlay} style={{ zIndex: 20 }}>
             <span className={styles.zaraBrandingText}>SHEF & B.</span>
             <div className={styles.scrollIndicator}>
                SCROLL DOWN
                <div className={styles.scrollLineContainer}>
                  <motion.div 
                    className={styles.line}
                    animate={{ y: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
             </div>
          </div>
          <div className={styles.collageGrid}>
            {collageImages.map((slide, i) => (
               <img key={slide.id} src={slide.url} alt={`Collage ${i}`} className={styles.collageImage} loading="lazy" />
            ))}
          </div>
        </section>
      )}

      {/* Slide 3-N: Full Screen Images */}
      {fullScreenImages.map((slide, index) => (
        <section key={slide.id} className={styles.snapSection}>
          <div className={styles.imageOverlay}>
             <span className={styles.zaraBrandingText}>SHEF & B.</span>
             <div className={styles.scrollIndicator}>
                SCROLL DOWN
                <div className={styles.scrollLineContainer}>
                  <motion.div 
                    className={styles.line}
                    animate={{ y: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
             </div>
          </div>
          <img 
            src={slide.url} 
            alt={`Home slide ${index}`} 
            className={styles.fullScreenImage} 
            loading={index > 0 ? "lazy" : "eager"}
          />
        </section>
      ))}

      {/* Zara-Style Home Footer */}
      <section className={styles.zaraHomeFooter}>
         <div className={styles.footerTop}>
           <h2 className={styles.footerHeading}>THE NEW</h2>
           <p className={styles.footerScrollText}>SCROLL DOWN</p>
           <div className={styles.footerLineContainer}>
             <motion.div 
               className={styles.footerLine}
               animate={{ y: ['0%', '100%'], opacity: [0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
             />
           </div>
         </div>

         <div className={styles.footerBottom}>
            <p className={styles.newsletterText}>JOIN OUR NEWSLETTER</p>
            <div className={styles.socialLinks}>
               <span>INSTAGRAM</span>
               <span>FACEBOOK</span>
               <span>PINTEREST</span>
               <span>YOUTUBE</span>
               <span>SPOTIFY</span>
            </div>
            
            <div className={styles.legalText}>
               <p>NAME AND ADDRESS OF THE MANUFACTURER:<br/>INDUSTRIA DE DISEÑO TEXTIL, S.A. (INDITEX, S.A.)<br/>AVENIDA DE LA DIPUTACIÓN, EDIFICIO INDITEX, 15143, ARTEIXO (A CORUÑA), SPAIN</p>
               <br/>
               <p>NAME AND ADDRESS OF THE IMPORTER:<br/>INDITEX TRENT RETAIL INDIA PRIVATE LIMITED<br/>8TH FLOOR, AMBIENCE CORPORATE TOWER II,<br/>UNIT 1 (OFFICE 1), AMBIENCE ISLAND, PLOT NO. 3, NH-8,<br/>GURGAON - 122002, HARYANA, INDIA</p>
            </div>
         </div>
      </section>

      {/* Final invisible slide to trigger navigation to shop */}
      <section ref={shopTriggerRef} className={styles.navigationTrigger}>
        {/* Invisible trigger block */}
      </section>

      {/* Old sections commented out below for reference */}
      {/*
      <StorySection content={content?.story} loading={loading} />
      <VisionSection content={content?.vision} slidesData={slidesData} loading={loading} />
      <FounderSection content={content?.founder} slidesData={slidesData} loading={loading} />
      <ExperienceSection content={content?.experience} slidesData={slidesData} loading={loading} />
      <GallerySection content={content?.gallery} slidesData={slidesData} loading={loading} />
      <JourneySection content={content?.journey} loading={loading} />
      <ContactSection content={content?.contact} loading={loading} />
      */}
    </div>
  );
}
