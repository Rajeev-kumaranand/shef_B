import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-secondary), sans-serif',
          background: 'var(--brand-white)',
          color: 'var(--brand-black)'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-primary)' }}>
            Something went wrong.
          </h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            We've encountered an unexpected error. Our team has been notified.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              background: 'var(--brand-black)',
              color: 'var(--brand-white)',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            Return to Homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
