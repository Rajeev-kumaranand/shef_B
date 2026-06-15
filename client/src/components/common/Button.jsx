/**
 * Button.jsx
 * Reusable luxury button component with variants.
 */
import { Link } from 'react-router-dom';
import styles from './Button.module.css';
import { cn } from '../../utils/cn.js';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const variantClass = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
    text: styles.text,
  }[variant] || styles.primary;

  const classes = cn(styles.base, variantClass, className);

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
