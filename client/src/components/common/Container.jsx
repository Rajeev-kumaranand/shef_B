/**
 * Container.jsx
 * Reusable layout container with configurable width modes.
 * Supports: narrow | standard | wide | full
 */
import styles from './Container.module.css';
import { cn } from '../../utils/cn.js';

export default function Container({
  children,
  width = 'standard',
  className = '',
  as: Tag = 'div',
  ...props
}) {
  const widthClass = {
    narrow:   styles.narrow,
    standard: styles.standard,
    wide:     styles.wide,
    full:     styles.full,
  }[width] || styles.standard;

  return (
    <Tag className={cn(styles.base, widthClass, className)} {...props}>
      {children}
    </Tag>
  );
}
