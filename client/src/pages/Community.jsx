import { useState } from 'react';
import { useCommunityContent, useCommunityReviews } from '../hooks/useApi.js';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import EditorialHero from '../components/common/EditorialHero.jsx';
import TestimonialCarousel from '../components/common/TestimonialCarousel.jsx';
import CommunityReviewForm from '../components/common/CommunityReviewForm.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import ImageReveal from '../components/common/ImageReveal.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Community.module.css';

export default function Community() {
  const { data: content, loading } = useCommunityContent();
  const { data: dbReviews, loading: dbLoading } = useCommunityReviews();
  const [expandedStoryIndex, setExpandedStoryIndex] = useState(null);

  if (loading || !content) return <div style={{ minHeight: '100vh', background: 'var(--surface-primary)' }} />;

  const { hero, memberStories, testimonials, experiences, gallery, cta } = content;

  // Format database reviews to match the testimonial component's expected structure
  const formattedDbReviews = (dbReviews || []).map(r => ({
    quote: r.message,
    author: r.name,
    role: r.role || 'Community Member',
    rating: r.rating
  }));

  // Combine static CMS testimonials with dynamic DB reviews
  const allTestimonials = [...(testimonials?.items || []), ...formattedDbReviews];

  return (
    <div className={styles.communityPage}>
      <SEOManager pageKey="community" />
      <EditorialHero 
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        image={hero.image}
      />

      <Section spacing="large" className={styles.storiesSection}>
        <Container width="wide">
          <SectionTitle title={memberStories.title} />
          <div className={styles.caseStudyGrid}>
            {memberStories.stories.map((story, idx) => {
              const isExpanded = expandedStoryIndex === idx;
              return (
                <FadeUp key={story.id || idx} delay={0.2} className={styles.caseStudyContainer}>
                  <div className={`${styles.caseStudyRow} ${idx % 2 !== 0 ? styles.caseStudyReverse : ''}`}>
                    <div className={styles.caseStudyImage}>
                      <ImageReveal src={story.image?.url} alt={story.name} aspectRatio="landscape" />
                    </div>
                    <div className={styles.caseStudyContent}>
                      <div className={styles.caseStudyHeader}>
                        <p className={styles.caseStudyRole}>{story.role}</p>
                        <h4 className={styles.caseStudyName}>{story.name}</h4>
                      </div>
                      <p className={styles.caseStudyQuote}>"{story.quote}"</p>
                      
                      <button 
                        className={styles.caseStudyBtn}
                        onClick={() => setExpandedStoryIndex(isExpanded ? null : idx)}
                        style={{ position: 'relative', overflow: 'hidden' }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={isExpanded ? 'close' : 'read'}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'inline-block' }}
                          >
                            {isExpanded ? 'Close Profile' : 'Read Profile'}
                          </motion.span>
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && story.fullContent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div 
                          className={styles.caseStudyFullContent}
                          dangerouslySetInnerHTML={{ __html: story.fullContent }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FadeUp>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="large" className={styles.testimonialsSection}>
        <Container width="wide">
          <SectionTitle title={testimonials.title} alignment="center" />
          <TestimonialCarousel testimonials={allTestimonials} />
          <CommunityReviewForm />
        </Container>
      </Section>

      <Section spacing="large" className={styles.experiencesSection}>
        <Container width="narrow">
          <SectionTitle title={experiences.title} alignment="center" />
          <div className={styles.eventsList}>
            {experiences.events.map((event, idx) => (
              <FadeUp key={idx} delay={idx * 0.1} className={styles.eventRow}>
                <div className={styles.eventInfo}>
                  <p className={styles.eventDate}>{event.date}</p>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                </div>
                <p className={styles.eventLocation}>{event.location}</p>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="large" className={styles.gallerySection}>
        <Container width="full">
          <SectionTitle title={gallery.title} alignment="center" />
          <div className={styles.masonryGrid}>
            {gallery.images.map((img, idx) => (
              <FadeUp key={idx} delay={idx * 0.1} className={styles.masonryItem}>
                <img src={img?.url} alt={`Gallery ${idx}`} loading="lazy" />
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="large" className={styles.ctaSection}>
        <Container width="narrow" className={styles.ctaContainer}>
          <FadeUp delay={0.1}>
            <h2 className={styles.ctaTitle}>{cta.title}</h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className={styles.ctaDesc}>{cta.description}</p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <button className={styles.ctaBtn}>{cta.buttonText}</button>
          </FadeUp>
        </Container>
      </Section>
    </div>
  );
}
