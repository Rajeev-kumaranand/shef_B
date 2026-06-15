import Container from './Container.jsx';
import Section from './Section.jsx';
import FadeUp from '../animation/FadeUp.jsx';
import ImageReveal from './ImageReveal.jsx';
import styles from './EditorialHero.module.css';

export default function EditorialHero({ title, subtitle, description, image, align = 'center' }) {
  const alignClass = align === 'left' ? styles.alignLeft : styles.alignCenter;

  return (
    <Section className={styles.heroSection} spacing="none">
      <Container width="wide" className={styles.heroContainer}>
        <div className={`${styles.heroContent} ${alignClass}`}>
          {subtitle && (
            <FadeUp delay={0.1}>
              <p className={styles.heroSubtitle}>{subtitle}</p>
            </FadeUp>
          )}
          {title && (
            <FadeUp delay={0.2}>
              <h1 className={styles.heroTitle}>{title}</h1>
            </FadeUp>
          )}
          {description && (
            <FadeUp delay={0.3}>
              <p className={styles.heroDescription}>{description}</p>
            </FadeUp>
          )}
        </div>
        {image && (
          <div className={styles.heroImageWrapper}>
            <ImageReveal src={image.url || image} alt={title} aspectRatio="cinematic" />
          </div>
        )}
      </Container>
    </Section>
  );
}
