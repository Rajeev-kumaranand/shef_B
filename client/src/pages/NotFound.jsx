import { Link } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import SEOManager from '../components/common/SEOManager.jsx';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <SEOManager pageKey="home" />
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontFamily: 'var(--font-primary)' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        style={{
          padding: '12px 24px',
          background: 'var(--brand-black)',
          color: 'var(--brand-white)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '12px',
          fontWeight: '600'
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
