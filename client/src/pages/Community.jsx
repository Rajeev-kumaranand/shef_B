import { communityData } from '../data/communityData.js';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import EditorialHero from '../components/common/EditorialHero.jsx';
import TestimonialCard from '../components/common/TestimonialCard.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import ImageReveal from '../components/common/ImageReveal.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Community.module.css';

export default function Community() {
  const { hero, memberStories, testimonials, experiences, gallery, cta } = communityData;

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
          <div className={styles.storiesGrid}>
            {memberStories.stories.map((story, idx) => (
              <FadeUp key={story.id} delay={idx * 0.2} className={styles.storyCard}>
                <div className={styles.storyImage}>
                  <ImageReveal src={story.image?.url} alt={story.name} aspectRatio="portrait" />
                </div>
                <div className={styles.storyContent}>
                  <p className={styles.storyQuote}>"{story.quote}"</p>
                  <div className={styles.storyAuthor}>
                    <h4>{story.name}</h4>
                    <p>{story.role}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="large" background="darkGray" className={styles.testimonialsSection}>
        <Container width="wide">
          <SectionTitle title={testimonials.title} className={styles.inverseTitle} />
          <div className={styles.testGrid}>
            {testimonials.items.map((test, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <TestimonialCard testimonial={test} />
              </FadeUp>
            ))}
          </div>
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
