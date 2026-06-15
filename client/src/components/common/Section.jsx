/**
 * Section.jsx
 * Reusable semantic section wrapper with luxury spacing and optional background variants.
 */
import styles from './Section.module.css';
import { cn } from '../../utils/cn.js';

export default function Section({
  children,
  className = '',
  spacing = 'default',
  background = 'transparent',
  id,
  ...props
}) {
  const spacingClass = {
    none:    styles.spacingNone,
    compact: styles.spacingCompact,
    default: styles.spacingDefault,
    large:   styles.spacingLarge,
  }[spacing] || styles.spacingDefault;

  const bgClass = {
    transparent: '',
    dark:        styles.bgDark,
    darkGray:    styles.bgDarkGray,
  }[background] || '';

  return (
    <section id={id} className={cn(styles.base, spacingClass, bgClass, className)} {...props}>
      {children}
    </section>
  );
}
