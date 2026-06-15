import { discoverData } from '../data/discoverData.js';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import EditorialHero from '../components/common/EditorialHero.jsx';
import ImageReveal from '../components/common/ImageReveal.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import LoadingState from '../components/admin/states/LoadingState.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Discover.module.css';

export default function Discover() {
  const { hero, philosophy, craftsmanship, valuesGrid, editorialGallery, cta } = discoverData;

  return (
    <div className={styles.discoverPage}>
      <SEOManager pageKey="discover" />
      {/* 1. Hero */}
      <EditorialHero 
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        image={hero.image}
      />

      {/* 2. Philosophy */}
      <Section className={styles.storySection} spacing="large">
        <Container width="narrow">
          <SectionTitle title={philosophy.heading} alignment="center" />
          <div className={styles.storyText}>
            {philosophy.paragraphs.map((p, idx) => (
              <FadeUp key={idx} delay={0.1 * idx}>
                <p>{p}</p>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Craftsmanship */}
      <Section className={styles.philosophySection} background="darkGray" spacing="large">
        <Container width="wide">
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyContent}>
              <SectionTitle title={craftsmanship.title} className={styles.philosophyTitle} />
              <div className={styles.philosophyList}>
                {craftsmanship.items.map((item, idx) => (
                  <FadeUp key={idx} delay={0.1 * idx} className={styles.philosophyItem}>
                    <span className={styles.philosophyNum}>{item.id}</span>
                    <div>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <p className={styles.itemDesc}>{item.description}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
            {craftsmanship.image && (
              <div className={styles.philosophyImage}>
                <ImageReveal src={craftsmanship.image.url} alt="Craftsmanship" aspectRatio="portrait" />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 4. Values Grid */}
      <Section spacing="large">
        <Container width="wide">
          <SectionTitle title={valuesGrid.title} />
          <div className={styles.expGrid}>
            {valuesGrid.cards.map((card, idx) => (
              <FadeUp key={card.id} delay={0.1 * idx} className={styles.expCard}>
                {card.image && (
                  <ImageReveal src={card.image.url} alt={card.title} aspectRatio="portrait" />
                )}
                <h4 className={styles.cardTitle}>{card.title}</h4>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Editorial Gallery */}
      <Section spacing="default" className={styles.gallerySection}>
        <Container width="full">
          <div className={styles.galleryWrapper}>
            {editorialGallery.images.map((img, idx) => img && (
              <div key={idx} className={styles.galleryItem}>
                <ImageReveal src={img.url} alt={`Gallery ${idx}`} aspectRatio={idx === 1 ? 'portrait' : 'square'} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. CTA */}
      <Section spacing="large" className={styles.closingSection}>
        <Container width="narrow" className={styles.closingContainer}>
          <FadeUp delay={0.1}>
            <h2 className={styles.closingTitle}>{cta.title}</h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <a href={cta.link} className={styles.closingCta}>{cta.buttonText}</a>
          </FadeUp>
        </Container>
      </Section>
    </div>
  );
}
