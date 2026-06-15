/**
 * SectionHeading.jsx
 * Standardized luxury typography for section titles and subtitles.
 */
import styles from './SectionHeading.module.css';
import { cn } from '../../utils/cn.js';
import FadeUp from '../animation/FadeUp.jsx';

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  className = '',
  titleAs: TitleTag = 'h2',
}) {
  return (
    <div className={cn(styles.base, centered && styles.centered, className)}>
      {subtitle && (
        <FadeUp delay={0.1}>
          <span className={styles.subtitle}>{subtitle}</span>
        </FadeUp>
      )}
      {title && (
        <FadeUp delay={0.2}>
          <TitleTag className={styles.title}>{title}</TitleTag>
        </FadeUp>
      )}
    </div>
  );
}
