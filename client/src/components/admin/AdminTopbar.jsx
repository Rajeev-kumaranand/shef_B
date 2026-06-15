import styles from './AdminTopbar.module.css';

export default function AdminTopbar({ title, onMenuClick }) {
  return (
    <header className={styles.topbar}>
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <button className={styles.actionBtn}>
          New Entry
        </button>
      </div>
    </header>
  );
}
