import { useLatestContent } from '../hooks/useApi.js';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import EditorialHero from '../components/common/EditorialHero.jsx';
import ArticleCard from '../components/common/ArticleCard.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './TheLatest.module.css';

export default function TheLatest() {
  const { data: content, loading } = useLatestContent();

  if (loading || !content) return <div style={{ minHeight: '100vh', background: 'var(--surface-primary)' }} />;

  const { hero, featuredArticle, articles, highlights, newsletter } = content;

  return (
    <div className={styles.latestPage}>
      <SEOManager pageKey="latest" />
      <EditorialHero 
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
      />

      <Section spacing="large" className={styles.featuredSection}>
        <Container width="wide">
          <SectionTitle title="Featured" />
          <ArticleCard article={featuredArticle} featured={true} />
        </Container>
      </Section>

      <Section spacing="large" background="darkGray" className={styles.gridSection}>
        <Container width="wide">
          <SectionTitle title="Recent Publications" className={styles.inverseTitle} />
          <div className={styles.articleGrid}>
            {articles.map((article, idx) => (
              <FadeUp key={article.id} delay={idx * 0.1}>
                <ArticleCard article={article} />
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="large">
        <Container width="narrow">
          <div className={styles.newsletterWrapper}>
            <FadeUp delay={0.1}>
              <h2 className={styles.newsTitle}>{newsletter.title}</h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className={styles.newsDesc}>{newsletter.description}</p>
            </FadeUp>
            <FadeUp delay={0.3} className={styles.formWrapper}>
              <form className={styles.newsForm} onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className={styles.newsInput}
                  required
                />
                <button type="submit" className={styles.newsSubmit}>
                  {newsletter.cta}
                </button>
              </form>
            </FadeUp>
            <FadeUp delay={0.4} className={styles.highlightsWrapper}>
              <p className={styles.highlightsTitle}>{highlights.title}</p>
              <div className={styles.topics}>
                {highlights.topics.map((topic, idx) => (
                  <span key={idx} className={styles.topic}>{topic}</span>
                ))}
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>
    </div>
  );
}
