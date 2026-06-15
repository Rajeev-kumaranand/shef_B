import Container from '../common/Container.jsx';
import Section from '../common/Section.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import RevealText from '../common/RevealText.jsx';
import LuxuryButton from '../common/LuxuryButton.jsx';
import FadeUp from '../animation/FadeUp.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './StorySection.module.css';

export default function StorySection({ content, loading }) {
  if (loading) {
    return (
      <Section id="story" background="transparent" spacing="large">
        <Container width="wide">
          <Skeleton width="40%" height="40px" />
          <Skeleton width="100%" height="200px" style={{ marginTop: '2rem' }} />
        </Container>
      </Section>
    );
  }

  const { subtitle, title, paragraphs } = content || {};

  return (
    <Section id="story" background="transparent" spacing="large">
      <Container width="wide">
        <div className={styles.grid}>
          {/* Left Side: Title & Statement */}
          <div className={styles.leftCol}>
            <SectionTitle subtitle={subtitle} title={title} className={styles.sectionTitle} />
            <div className={styles.textReveal}>
              {paragraphs?.[0] && <RevealText text={paragraphs[0]} className={styles.lead} />}
            </div>
          </div>

          {/* Right Side: Narrative detail and action */}
          <div className={styles.rightCol}>
            <FadeUp delay={0.4} className={styles.contentWrap}>
              {paragraphs?.[1] && <p className={styles.bodyText}>{paragraphs[1]}</p>}
              <div className={styles.action}>
                <LuxuryButton to="/discover" variant="outline">
                  Our Methodology
                </LuxuryButton>
              </div>
            </FadeUp>
          </div>
        </div>
      </Container>
    </Section>
  );
}
