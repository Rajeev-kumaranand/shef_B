import { motion } from 'framer-motion';
import styles from './TestimonialCard.module.css';

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div 
      className={styles.card}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className={styles.quote}>"{testimonial.quote}"</p>
      <div className={styles.authorInfo}>
        <p className={styles.author}>{testimonial.author}</p>
        {testimonial.role && <p className={styles.role}>{testimonial.role}</p>}
      </div>
    </motion.div>
  );
}
