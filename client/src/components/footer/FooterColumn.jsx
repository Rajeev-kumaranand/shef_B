/**
 * FooterColumn.jsx
 * Reusable column for footer links.
 */
import { Link } from 'react-router-dom';
import styles from './FooterColumn.module.css';

export default function FooterColumn({ title, links }) {
  return (
    <div className={styles.column}>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.list}>
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.path} className={styles.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
