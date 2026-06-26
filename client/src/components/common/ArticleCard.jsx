import { Link } from 'react-router-dom';
import styles from './ArticleCard.module.css';

// Dummy articles for the side column of the composite card
const dummySmallArticles = [
  {
    id: 'd1',
    category: 'DIGESTION',
    title: 'How Berberine Supports Your Gut Microbiome',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'd2',
    category: 'HORMONES',
    title: 'How to Eat for Your Menstrual Cycle: Nutritional Support for Each Phase',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'd3',
    category: 'WEIGHT',
    title: 'Can Magnesium Help You Lose Weight?',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=300&auto=format&fit=crop'
  }
];

export default function ArticleCard({ article, featured = false, small = false, middle = false }) {
  if (!article) return null;

  // Image 1 Variant: Small side card
  if (small) {
    return (
      <Link to={article.link || '#'} className={styles.smallCard}>
        <div className={styles.smallImage}>
          <img src={article.image?.url || 'https://via.placeholder.com/300'} alt={article.title} />
        </div>
        <div className={styles.smallContent}>
          <h4 className={styles.smallTitle}>{article.title}</h4>
        </div>
      </Link>
    );
  }

  // Image 1 Variant: Middle large card
  if (middle) {
    return (
      <Link to={article.link || '#'} className={styles.middleCard}>
        <div className={styles.middleImageWrapper}>
          <img src={article.image?.url || 'https://via.placeholder.com/600'} alt={article.title} />
          <div className={styles.middleOverlay}>
            <span>{article.category || 'SUPPLEMENTS'}</span>
          </div>
        </div>
        <div className={styles.middleContent}>
          <h3 className={styles.middleTitle}>{article.title}</h3>
          <p className={styles.middleExcerpt}>{article.excerpt}</p>
        </div>
      </Link>
    );
  }

  // Image 2 Variant: Composite Card (Default)
  return (
    <div className={styles.compositeCard}>
      <div className={styles.compositeHeader}>
        <h2 className={styles.categoryHeader}>{article.category || 'BODY'}</h2>
        <span className={styles.headerLink}>Science-Backed Advice on Weight Loss, Digestion, & Fitness &gt;</span>
      </div>
      <div className={styles.compositeBody}>
        {/* Left Side: Main Article */}
        <Link to={article.link || '#'} className={styles.mainArticle}>
          <div className={styles.mainImageWrapper}>
            <img src={article.image?.url || 'https://via.placeholder.com/800'} alt={article.title} />
            <div className={styles.mainOverlay}>
              <span>{article.category || 'BODY'}</span>
            </div>
          </div>
          <div className={styles.mainContent}>
            <p className={styles.mainCategory}>{article.category || 'FITNESS'}</p>
            <h3 className={styles.mainTitle}>{article.title}</h3>
            <p className={styles.mainExcerpt}>{article.excerpt}</p>
          </div>
        </Link>
        
        {/* Right Side: Small Articles List */}
        <div className={styles.sideArticles}>
          {dummySmallArticles.map(item => (
            <Link key={item.id} to="#" className={styles.sideItem}>
              <div className={styles.sideImage}>
                <img src={item.image} alt={item.title} />
              </div>
              <div className={styles.sideContent}>
                <p className={styles.sideCategory}>{item.category}</p>
                <h4 className={styles.sideTitle}>{item.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
