import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getContact, updateContact } from '../../services/api/contactApi.js';
import styles from './AdminPages.module.css';

export default function Contact() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await getContact();
      if (res.success && res.data) {
        reset(res.data);
      }
    } catch (err) {
      toast.error('Failed to load contact info');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateContact(data);
      toast.success('Contact info updated');
    } catch (err) {
      toast.error('Failed to update contact info');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AdminCard title="Contact Information" action={<button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>Save</button>}>
          <div className={styles.formGrid}>
            <AdminFormField label="Email" {...register('email')} />
            <AdminFormField label="Phone" {...register('phone')} />
          </div>
          <AdminFormField label="Address" type="textarea" {...register('address')} />
        </AdminCard>
      </form>
    </div>
  );
}
