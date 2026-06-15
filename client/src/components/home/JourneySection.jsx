import Container from '../common/Container.jsx';
import Section from '../common/Section.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import FadeUp from '../animation/FadeUp.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './JourneySection.module.css';

export default function JourneySection({ content, loading }) {
  if (loading) {
    return (
      <Section id="journey" background="transparent" spacing="large">
        <Container width="wide">
          <Skeleton width="40%" height="40px" />
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Skeleton width="100%" height="150px" />
            <Skeleton width="100%" height="150px" />
          </div>
        </Container>
      </Section>
    );
  }

  const { subtitle, title, steps } = content || {};

  return (
    <Section id="journey" background="transparent" spacing="large">
      <Container width="wide">
        <SectionTitle subtitle={subtitle} title={title} className={styles.sectionTitle} />

        <div className={styles.timeline}>
          {steps?.map((step, index) => (
            <div key={index} className={styles.stepRow}>
              {/* Year marker side */}
              <div className={styles.yearColumn}>
                <FadeUp delay={0.1 * index}>
                  <span className={styles.year}>{step.year}</span>
                </FadeUp>
              </div>

              {/* Detail side */}
              <div className={styles.detailColumn}>
                <FadeUp delay={0.2 * index}>
                  <div className={styles.card}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.description}</p>
                  </div>
                </FadeUp>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
