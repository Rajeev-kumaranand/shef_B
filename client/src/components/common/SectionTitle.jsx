/**
 * SectionTitle.jsx
 * Highly tracked editorial title header with split details.
 */
import styles from './SectionTitle.module.css';
import { cn } from '../../utils/cn.js';
import FadeUp from '../animation/FadeUp.jsx';

export default function SectionTitle({
  subtitle,
  title,
  alignment = 'left', // left | center
  className = '',
  description = ''
}) {
  const alignClass = alignment === 'center' ? styles.center : styles.left;

  return (
    <div className={cn(styles.base, alignClass, className)}>
      {subtitle && (
        <FadeUp delay={0.1}>
          <span className={styles.subtitle}>{subtitle}</span>
        </FadeUp>
      )}
      {title && (
        <FadeUp delay={0.2}>
          <h2 className={styles.title}>{title}</h2>
        </FadeUp>
      )}
      {description && (
        <FadeUp delay={0.3}>
          <p className={styles.description}>{description}</p>
        </FadeUp>
      )}
    </div>
  );
}
