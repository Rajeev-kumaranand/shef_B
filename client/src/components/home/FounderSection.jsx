import Container from '../common/Container.jsx';
import Section from '../common/Section.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import ParallaxImage from '../common/ParallaxImage.jsx';
import FadeUp from '../animation/FadeUp.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './FounderSection.module.css';

export default function FounderSection({ content, slidesData, loading }) {
  if (loading) {
    return (
      <Section id="leadership" background="transparent" spacing="large">
        <Container width="wide">
           <Skeleton width="40%" height="40px" />
           <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
             <Skeleton width="50%" height="400px" />
             <Skeleton width="50%" height="400px" />
           </div>
        </Container>
      </Section>
    );
  }

  const { subtitle, title, members } = content || {};

  return (
    <Section id="leadership" background="transparent" spacing="large">
      <Container width="wide">
        <SectionTitle subtitle={subtitle} title={title} className={styles.sectionTitle} />

        <div className={styles.members}>
          {members?.map((member, index) => {
            const slide = slidesData?.find(s => s.id === member.slideId);
            const isAlternate = index % 2 === 1;

            return (
              <div
                key={index}
                className={`${styles.memberRow} ${isAlternate ? styles.alternate : ''}`}
              >
                {/* Visual block */}
                <div className={styles.imageColumn}>
                  {slide && (
                    <FadeUp delay={0.2} className={styles.parallaxWrap}>
                      <ParallaxImage
                        src={slide.url}
                        alt={member.name}
                        aspectRatio="portrait"
                        speed={10}
                      />
                    </FadeUp>
                  )}
                </div>

                {/* Profile detail block */}
                <div className={styles.infoColumn}>
                  <FadeUp delay={0.3} className={styles.infoContent}>
                    <span className={styles.memberRole}>{member.role}</span>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    
                    <blockquote className={styles.blockquote}>
                      <p>“{member.quote}”</p>
                    </blockquote>
                    
                    <p className={styles.memberBio}>{member.bio}</p>
                  </FadeUp>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
