import Container from '../common/Container.jsx';
import Section from '../common/Section.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import ImageReveal from '../common/ImageReveal.jsx';
import FadeUp from '../animation/FadeUp.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './GallerySection.module.css';

export default function GallerySection({ content, slidesData, loading }) {
  if (loading) {
    return (
      <Section id="gallery" background="transparent" spacing="large">
        <Container width="wide">
          <Skeleton width="40%" height="40px" style={{ margin: '0 auto' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '2rem' }}>
            <Skeleton width="100%" height="400px" />
            <Skeleton width="100%" height="400px" />
          </div>
        </Container>
      </Section>
    );
  }

  const { subtitle, title, items } = content || {};

  return (
    <Section id="gallery" background="transparent" spacing="large">
      <Container width="wide">
        <SectionTitle
          subtitle={subtitle}
          title={title}
          alignment="center"
          className={styles.titleOverride}
        />

        <div className={styles.grid}>
          {items?.map((item, index) => {
            const slide = slidesData?.find(s => s.id === item.slideId);
            if (!slide) return null;

            // Map layout styles according to index/item configuration
            const itemStyle = styles[`item${index + 1}`];

            return (
              <FadeUp
                key={item.id}
                delay={0.1 * index}
                className={`${styles.item} ${itemStyle}`}
              >
                <div className={styles.imageBox}>
                  <ImageReveal
                    src={slide.url}
                    alt={item.title}
                    aspectRatio={item.size}
                  />
                  <div className={styles.caption}>
                    <span className={styles.captionTitle}>{item.title}</span>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
