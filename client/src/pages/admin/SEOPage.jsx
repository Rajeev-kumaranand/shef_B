import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import styles from './AdminPages.module.css';

const PAGES = [
  { id: 'home', label: 'Home Page' },
  { id: 'shop', label: 'Shop Page' },
  { id: 'discover', label: 'Discover Page' },
  { id: 'community', label: 'Community Page' },
  { id: 'latest', label: 'The Latest Page' },
  { id: 'note', label: 'Note Page' },
  { id: 'contact', label: 'Contact Page' }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SEOPage() {
  const [activePage, setActivePage] = useState('home');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm();

  // Watch for character counts
  const title = watch('title') || '';
  const description = watch('description') || '';

  useEffect(() => {
    fetchSeoData(activePage);
  }, [activePage]);

  const fetchSeoData = async (pageKey) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/seo/${pageKey}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.data) {
        reset(res.data.data);
      } else {
        reset({
          title: '', description: '', keywords: '', canonicalUrl: '',
          ogTitle: '', ogDescription: '', ogImage: '',
          twitterTitle: '', twitterDescription: '', twitterImage: '', schemaMarkup: ''
        });
      }
    } catch (err) {
      toast.error('Failed to load SEO data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/seo/${activePage}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('SEO updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update SEO');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>SEO Management</h1>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
        {/* Sidebar Navigation */}
        <div style={{ width: '250px', background: 'white', border: '1px solid var(--border-color)', alignSelf: 'flex-start' }}>
          {PAGES.map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: 'var(--spacing-md)',
                background: activePage === page.id ? 'var(--surface-secondary)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-color)',
                fontFamily: 'var(--font-secondary)',
                cursor: 'pointer'
              }}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          {loading ? (
            <LoadingState />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'white', padding: 'var(--spacing-xl)', border: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-secondary)' }}>General Meta Tags</h2>
                <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                  Save Changes
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px', color: 'var(--text-secondary)'  }}>Meta Title</label>
                    <span style={{ fontSize: '12px', color: title.length > 60 ? '#ef4444' : 'var(--text-secondary)' }}>{title.length} / 60</span>
                  </div>
                  <input {...register('title')} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)' }} />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px', color: 'var(--text-secondary)'  }}>Meta Description</label>
                    <span style={{ fontSize: '12px', color: description.length > 160 ? '#ef4444' : 'var(--text-secondary)' }}>{description.length} / 160</span>
                  </div>
                  <textarea {...register('description')} rows="3" style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)' }} />
                </div>

                <AdminFormField label="Keywords (Comma separated)" {...register('keywords')} />
                <AdminFormField label="Canonical URL (Optional)" {...register('canonicalUrl')} />
              </div>

              <h2 style={{ fontFamily: 'var(--font-primary)', marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)'  }}>Open Graph (Facebook/LinkedIn)</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                <AdminFormField label="OG Title" {...register('ogTitle')} />
                <AdminFormField label="OG Description" type="textarea" {...register('ogDescription')} />
                <AdminFormField type="media" label="OG Image URL" {...register('ogImage')} />
              </div>

              <h2 style={{ fontFamily: 'var(--font-primary)', marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)'  }}>Twitter Cards</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                <AdminFormField label="Twitter Title" {...register('twitterTitle')} />
                <AdminFormField label="Twitter Description" type="textarea" {...register('twitterDescription')} />
                <AdminFormField type="media" label="Twitter Image URL" {...register('twitterImage')} />
              </div>

              <h2 style={{ fontFamily: 'var(--font-primary)', marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)'  }}>Advanced</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <AdminFormField label="JSON-LD Schema Markup" type="textarea" style={{ minHeight: '150px', fontFamily: 'monospace' }} {...register('schemaMarkup')} placeholder="{ &quot;@context&quot;: &quot;https://schema.org&quot;, ... }" />
              </div>
            </form>
          )}

          {/* Live Preview Panel */}
          <div style={{ background: 'white', padding: 'var(--spacing-xl)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontFamily: 'var(--font-primary)', marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)'  }}>Google Search Preview</h2>
            <div style={{ padding: '16px', background: '#f8f9fa', border: '1px solid #dfe1e5', borderRadius: '8px', maxWidth: '600px' }}>
              <div style={{ fontSize: '14px', color: '#202124', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#ddd', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-block' }}></span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ lineHeight: 1.2 }}>shef&amp;B</span>
                  <span style={{ fontSize: '12px', color: '#4d5156', lineHeight: 1.2 }}>https://shefandb.com {watch('canonicalUrl') ? `› ${watch('canonicalUrl').split('/').pop()}` : ''}</span>
                </div>
              </div>
              <div style={{ fontSize: '20px', color: '#1a0dab', marginBottom: '4px', cursor: 'pointer' }}>
                {title || 'Page Title'}
              </div>
              <div style={{ fontSize: '14px', color: '#4d5156', lineHeight: 1.58 }}>
                {description || 'Provide a meta description by editing the fields above. A good description is a brief summary of the page content that encourages users to click.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
