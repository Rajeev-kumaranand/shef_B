import Container from '../common/Container.jsx';
import Section from '../common/Section.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import ParallaxImage from '../common/ParallaxImage.jsx';
import FadeUp from '../animation/FadeUp.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './VisionSection.module.css';

export default function VisionSection({ content, slidesData, loading }) {
  if (loading) {
    return (
      <Section id="vision" background="dark" spacing="large">
        <Container width="wide">
          <Skeleton width="50%" height="40px" style={{ margin: '0 auto' }} />
          <Skeleton width="100%" height="400px" style={{ marginTop: '2rem' }} />
        </Container>
      </Section>
    );
  }

  const { subtitle, title, description, slideId, stats } = content || {};
  const slide = slidesData?.find(s => s.id === slideId);

  return (
    <Section id="vision" background="dark" spacing="large">
      <Container width="wide" className={styles.container}>
        <SectionTitle
          subtitle={subtitle}
          title={title}
          alignment="center"
          className={styles.titleOverride}
        />
        
        {/* Parallax Image Block */}
        {slide && (
          <FadeUp delay={0.2} className={styles.imageWrap}>
            <ParallaxImage
              src={slide.url}
              alt="Brand Vision Landscape"
              aspectRatio="wide"
              speed={12}
            />
          </FadeUp>
        )}

        <div className={styles.bottom}>
          <FadeUp delay={0.3} className={styles.descCol}>
            <p className={styles.description}>{description}</p>
          </FadeUp>
          
          {/* Editorial Stats Grid */}
          <div className={styles.statsCol}>
            {stats?.map((stat, index) => (
              <FadeUp key={index} delay={0.2 + index * 0.1} className={styles.statBox}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </FadeUp>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
