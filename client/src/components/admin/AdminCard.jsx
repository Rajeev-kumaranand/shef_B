import styles from './AdminCard.module.css';

export default function AdminCard({ title, children, action }) {
  return (
    <div className={styles.card}>
      {(title || action) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
