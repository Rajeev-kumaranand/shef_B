/**
 * LuxuryButton.jsx
 * Reusable, elevated Brutalist luxury button component.
 * Features an animated character slide overlay and arrow indicator on hover.
 */
import { Link } from 'react-router-dom';
import styles from './LuxuryButton.module.css';
import { cn } from '../../utils/cn.js';

export default function LuxuryButton({
  children,
  to,
  href,
  onClick,
  className = '',
  type = 'button',
  variant = 'dark', // dark | light | outline
  ...props
}) {
  const variantClass = {
    dark: styles.dark,
    light: styles.light,
    outline: styles.outline,
  }[variant] || styles.dark;

  const classes = cn(styles.button, variantClass, className);

  const innerContent = (
    <span className={styles.wrapper}>
      <span className={styles.text}>{children}</span>
      <span className={styles.arrow}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svg}>
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
    </span>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {innerContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {innerContent}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {innerContent}
    </button>
  );
}
