import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getCompany, updateCompany } from '../../services/api/companyApi.js';
import styles from './AdminPages.module.css';

export default function Company() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await getCompany();
      if (res.success && res.data) {
        reset(res.data);
      }
    } catch (err) {
      toast.error('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateCompany(data);
      toast.success('Company profile updated');
    } catch (err) {
      toast.error('Failed to update company profile');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AdminCard title="Company Profile" action={<button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>Save</button>}>
          <div className={styles.formGrid}>
            <AdminFormField label="Company Name" {...register('name')} />
            <AdminFormField label="Tagline" {...register('tagline')} />
          </div>
          <AdminFormField label="Description" type="textarea" {...register('description')} />
        </AdminCard>

        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <AdminCard title="Social Links & Info" action={<button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>Save</button>}>
            <div className={styles.formGrid}>
              <AdminFormField label="Founder Name" {...register('founder')} />
              <AdminFormField label="Instagram" {...register('instagram')} />
              <AdminFormField label="LinkedIn" {...register('linkedin')} />
              <AdminFormField label="YouTube" {...register('youtube')} />
              <AdminFormField label="Pinterest" {...register('pinterest')} />
            </div>
          </AdminCard>
        </div>
      </form>
    </div>
  );
}
