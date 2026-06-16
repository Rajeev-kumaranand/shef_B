import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import EmptyState from '../../components/admin/states/EmptyState.jsx';
import styles from './AdminPages.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/magazine/authors`);
      setAuthors(res.data.data);
    } catch (err) { toast.error('Failed to load authors'); } 
    finally { setLoading(false); }
  };

  const openCreateModal = () => {
    reset({ name: '', designation: '', bio: '', image: '' });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/magazine/authors`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Author created');
      setIsModalOpen(false);
      fetchData();
    } catch (err) { toast.error('Failed to create author'); }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Magazine Authors</h1>
        <button className={styles.primaryBtn} onClick={openCreateModal}>Add Author</button>
      </div>

      {authors.length === 0 ? (
        <EmptyState title="No Authors" message="Add authors to write articles." onAction={openCreateModal} actionLabel="Add Author" />
      ) : (
        <div className={styles.grid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {authors.map(author => (
            <div key={author.id} style={{ border: '1px solid var(--border-color)', padding: '24px', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--surface-secondary)', overflow: 'hidden' }}>
                  {author.image && <img src={author.image} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '18px' }}>{author.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{author.designation}</p>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>{author.bio}</p>
              <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--brand-black)', fontWeight: 'bold' }}>
                {author._count?.articles || 0} Articles Published
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal2}>
            <div className={styles.modalHeader}>
              <h2>New Author</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.modalBody}>
                <AdminFormField label="Name" {...register('name', { required: true })} />
                <AdminFormField label="Designation" {...register('designation')} />
                <AdminFormField label="Profile Image URL" {...register('image')} />
                <AdminFormField label="Biography" type="textarea" {...register('bio')} />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Save Author</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
