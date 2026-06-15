export default function EmptyState({ message }) {
  return (
    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-secondary)', fontSize: 'var(--font-size-sm)' }}>
      {message || 'No data available'}
    </div>
  );
}
