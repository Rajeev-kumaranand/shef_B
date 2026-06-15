/**
 * NavLinkItem.jsx
 * Individual navigation link with animated hover state.
 */
import { NavLink } from 'react-router-dom';
import styles from './NavLinkItem.module.css';
import { cn } from '../../utils/cn.js';

export default function NavLinkItem({ item, onClick, className = '' }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) => cn(styles.link, isActive && styles.active, className)}
    >
      <span className={styles.text}>{item.label}</span>
      <span className={styles.indicator} />
    </NavLink>
  );
}
