export default function ErrorState({ message }) {
  return (
    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--brand-red)', fontFamily: 'var(--font-secondary)', fontSize: 'var(--font-size-sm)' }}>
      Error: {message || 'Failed to load data'}
    </div>
  );
}
