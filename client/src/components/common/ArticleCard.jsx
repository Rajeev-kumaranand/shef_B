import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageReveal from './ImageReveal.jsx';
import styles from './ArticleCard.module.css';

export default function ArticleCard({ article, featured = false }) {
  return (
    <motion.div 
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={article.link || '#'} className={styles.link}>
        <div className={styles.imageWrapper}>
          <ImageReveal src={article.image?.url} alt={article.title} aspectRatio={featured ? 'landscape' : 'portrait'} />
        </div>
        <div className={styles.content}>
          <p className={styles.category}>{article.category} — {article.date}</p>
          <h3 className={styles.title}>{article.title}</h3>
          <p className={styles.excerpt}>{article.excerpt}</p>
          <span className={styles.readMore}>Read More</span>
        </div>
      </Link>
    </motion.div>
  );
}
