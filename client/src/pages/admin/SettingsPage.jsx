import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import styles from './AdminPages.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TABS = [
  { id: 'branding', label: 'Branding' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'social', label: 'Social Media' },
  { id: 'business', label: 'Business & Shipping' },
  { id: 'announcement', label: 'Announcement Bar' }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/settings`);
      if (res.data.success && res.data.data) {
        reset(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Settings updated successfully. Refresh the storefront to see changes!');
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Website Settings</h1>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
        {/* Sidebar Navigation */}
        <div style={{ width: '250px', background: 'white', border: '1px solid var(--border-color)', alignSelf: 'flex-start' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: 'var(--spacing-md)',
                background: activeTab === tab.id ? 'var(--surface-secondary)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-color)',
                fontFamily: 'var(--font-secondary)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'white', padding: 'var(--spacing-xl)', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-secondary)'  }}>{TABS.find(t => t.id === activeTab)?.label}</h2>
              <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                Save Changes
              </button>
            </div>

            {activeTab === 'branding' && (
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <AdminFormField label="Site Name" {...register('siteName', { required: true })} />
                <AdminFormField label="Site Tagline" {...register('siteTagline')} />
                <AdminFormField label="Footer Copyright Text" {...register('footerCopyrightText')} />
                <AdminFormField label="Logo Image URL" {...register('logoImage')} />
                <AdminFormField label="Favicon Image URL" {...register('faviconImage')} />
              </div>
            )}

            {activeTab === 'contact' && (
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <AdminFormField label="Contact Email" type="email" {...register('contactEmail')} />
                <AdminFormField label="Contact Phone" {...register('contactPhone')} />
                <AdminFormField label="WhatsApp Number" {...register('contactWhatsapp')} />
                <AdminFormField label="Physical Address" type="textarea" {...register('contactAddress')} />
                <AdminFormField label="Google Maps Embed URL" type="textarea" {...register('googleMapsUrl')} />
              </div>
            )}

            {activeTab === 'social' && (
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <AdminFormField label="Instagram URL" {...register('socialInstagram')} />
                <AdminFormField label="Facebook URL" {...register('socialFacebook')} />
                <AdminFormField label="LinkedIn URL" {...register('socialLinkedin')} />
                <AdminFormField label="YouTube URL" {...register('socialYoutube')} />
                <AdminFormField label="Pinterest URL" {...register('socialPinterest')} />
                <AdminFormField label="Twitter / X URL" {...register('socialTwitter')} />
              </div>
            )}

            {activeTab === 'business' && (
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <input type="checkbox" id="codEnabled" {...register('codEnabled')} />
                  <label htmlFor="codEnabled" style={{ fontFamily: 'var(--font-secondary)', color: 'var(--text-secondary)'  }}>Enable Cash on Delivery (COD)</label>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <input type="checkbox" id="onlinePaymentEnabled" {...register('onlinePaymentEnabled')} />
                  <label htmlFor="onlinePaymentEnabled" style={{ fontFamily: 'var(--font-secondary)', color: 'var(--text-secondary)'  }}>Enable Online Payments (Razorpay)</label>
                </div>
                <AdminFormField label="Flat Shipping Cost ($)" type="number" step="0.01" {...register('flatShippingCost')} />
                <AdminFormField label="Free Shipping Threshold ($) (0 to disable)" type="number" step="0.01" {...register('freeShippingThreshold')} />
                <AdminFormField label="Tax Percentage (%)" type="number" step="0.01" {...register('taxPercentage')} />
              </div>
            )}

            {activeTab === 'announcement' && (
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <input type="checkbox" id="announcementEnabled" {...register('announcementEnabled')} />
                  <label htmlFor="announcementEnabled" style={{ fontFamily: 'var(--font-secondary)', color: 'var(--text-secondary)'  }}>Enable Global Announcement Bar</label>
                </div>
                <AdminFormField label="Announcement Text" {...register('announcementText')} />
                <AdminFormField label="Call to Action Text (Optional)" {...register('announcementCtaText')} />
                <AdminFormField label="Call to Action Link (Optional)" {...register('announcementCtaLink')} />
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
