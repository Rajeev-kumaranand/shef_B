import Container from '../common/Container.jsx';
import Section from '../common/Section.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import ImageReveal from '../common/ImageReveal.jsx';
import FadeUp from '../animation/FadeUp.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './ExperienceSection.module.css';

export default function ExperienceSection({ content, slidesData, loading }) {
  if (loading) {
    return (
      <Section id="experience" background="transparent" spacing="large">
        <Container width="wide">
          <Skeleton width="40%" height="40px" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
            <Skeleton width="100%" height="300px" />
            <Skeleton width="100%" height="300px" />
            <Skeleton width="100%" height="300px" />
          </div>
        </Container>
      </Section>
    );
  }

  const { subtitle, title, items } = content || {};
console.log(title,)
  return (
    <Section id="experience" background="transparent" spacing="large">
      <Container width="wide">
        <SectionTitle subtitle={subtitle} title={title} className={styles.sectionTitle} />

        <div className={styles.grid}>
          {items?.map((item, index) => {
            const slide = slidesData?.find(s => s.id === item.slideId);

            return (
              <FadeUp key={item.id} delay={0.1 * index} className={styles.card}>
                <div className={styles.imageBox}>
                  {slide && (
                    <ImageReveal
                      src={slide.url}
                      alt={item.title}
                      aspectRatio="portrait"
                      className={styles.revealOverride}
                    />
                  )}
                </div>
                
                <div className={styles.details}>
                  <span className={styles.number}>0{index + 1}</span>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemDesc}>{item.description}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
