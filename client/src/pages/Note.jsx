import { useNoteContent } from '../hooks/useApi.js';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import EditorialHero from '../components/common/EditorialHero.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import ImageReveal from '../components/common/ImageReveal.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Note.module.css';

export default function Note() {
  const { data: content, loading } = useNoteContent();

  if (loading || !content) return <div style={{ minHeight: '100vh', background: 'var(--surface-primary)' }} />;

  const { hero, letter: foundersLetter, editorial: longFormEditorial, signature: signatureBlock } = content;
  
  return (
    <div className={styles.notePage}>
      <SEOManager pageKey="note" />
      <EditorialHero 
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
      />

      <Section spacing="large" className={styles.letterSection}>
        <Container width="narrow">
          <FadeUp delay={0.1}>
            <h2 className={styles.sectionTitle}>{foundersLetter.title}</h2>
          </FadeUp>
          
          <div className={styles.letterContent}>
            <FadeUp delay={0.2}>
              <p className={styles.salutation}>{foundersLetter.salutation}</p>
            </FadeUp>
            {foundersLetter.paragraphs.map((p, idx) => (
              <FadeUp key={idx} delay={0.3 + (idx * 0.1)}>
                <p className={styles.paragraph}>{p}</p>
              </FadeUp>
            ))}
          </div>

          {foundersLetter.image && (
            <FadeUp delay={0.6} className={styles.imageBlock}>
              <ImageReveal src={foundersLetter.image.url} alt="Letter Image" aspectRatio="landscape" />
            </FadeUp>
          )}
        </Container>
      </Section>

      <Section spacing="large" className={styles.editorialSection}>
        <Container width="narrow">
          <FadeUp>
            <h2 className={styles.sectionTitle}>{longFormEditorial.title}</h2>
          </FadeUp>
          
          <div className={styles.editorialFlow}>
            {longFormEditorial.content.map((block, idx) => {
              if (block.type === 'text') {
                return (
                  <FadeUp key={idx}>
                    <p className={styles.paragraph}>{block.value}</p>
                  </FadeUp>
                );
              }
              if (block.type === 'image') {
                return (
                  <FadeUp key={idx} className={styles.imageBlock}>
                    <ImageReveal src={block.value.url} alt="Editorial Image" aspectRatio="landscape" />
                  </FadeUp>
                );
              }
              if (block.type === 'quote') {
                return (
                  <FadeUp key={idx} className={styles.quoteBlock}>
                    <p className={styles.pullQuote}>"{block.value}"</p>
                  </FadeUp>
                );
              }
              return null;
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="large" className={styles.signatureSection}>
        <Container width="narrow">
          <div className={styles.signatureFlex}>
            <div className={styles.signatureText}>
              <FadeUp delay={0.1}>
                <h3 className={styles.sigName}>{signatureBlock.name}</h3>
                <p className={styles.sigRole}>{signatureBlock.role}</p>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className={styles.sigBio}>{signatureBlock.bio}</p>
              </FadeUp>
            </div>
            {signatureBlock.image && (
              <FadeUp delay={0.3} className={styles.sigImage}>
                <ImageReveal src={signatureBlock.image.url} alt={signatureBlock.name} aspectRatio="square" />
              </FadeUp>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
