import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import ErrorState from '../../components/admin/states/ErrorState.jsx';
import styles from './CouponsPage.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch coupons.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
        minimumOrderAmount: data.minimumOrderAmount ? parseFloat(data.minimumOrderAmount) : 0,
        maxDiscount: data.maxDiscount ? parseFloat(data.maxDiscount) : null,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        expiresAt: data.expiresAt ? data.expiresAt : null,
        active: true
      };

      const res = await axios.post(`${API_URL}/coupons`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        toast.success('Coupon created successfully');
        setCoupons([res.data.data, ...coupons]);
        setIsModalOpen(false);
        reset();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/coupons/${id}`, { active: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCoupons(coupons.map(c => c.id === id ? res.data.data : c));
        toast.success('Status updated');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success('Coupon deleted');
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  if (loading) return <LoadingState message="Loading coupons..." />;
  if (error) return <ErrorState message={error} onRetry={fetchCoupons} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Coupons</h1>
        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          + Create Coupon
        </button>
      </header>

      {coupons.length === 0 ? (
        <div className={styles.emptyState}>No coupons created yet.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Usage Limit</th>
                <th>Used Count</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} className={!coupon.active ? styles.inactiveRow : ''}>
                  <td><strong>{coupon.code}</strong></td>
                  <td>
                    {coupon.discountType === 'PERCENTAGE' 
                      ? `${coupon.discountValue}%` 
                      : `$${parseFloat(coupon.discountValue).toFixed(2)}`}
                    <br/>
                    <small className={styles.textMuted}>Min Order: ${parseFloat(coupon.minimumOrderAmount).toFixed(2)}</small>
                  </td>
                  <td>{coupon.usageLimit || 'Unlimited'}</td>
                  <td>{coupon.usedCount}</td>
                  <td>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <button 
                      onClick={() => toggleStatus(coupon.id, coupon.active)}
                      className={`${styles.statusBadge} ${coupon.active ? styles.active : styles.inactive}`}
                    >
                      {coupon.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => deleteCoupon(coupon.id)} className={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Create New Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Coupon Code</label>
                  <input 
                    type="text" 
                    {...register('code', { required: 'Code is required' })} 
                    placeholder="e.g. SUMMER20"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.code && <span className={styles.errorText}>{errors.code.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Description (Optional)</label>
                  <input type="text" {...register('description')} />
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Discount Type</label>
                    <select {...register('discountType', { required: true })}>
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Discount Value</label>
                    <input type="number" step="0.01" {...register('discountValue', { required: 'Value is required' })} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Minimum Order Amount ($)</label>
                    <input type="number" step="0.01" {...register('minimumOrderAmount')} defaultValue="0" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Maximum Discount ($) (Optional)</label>
                    <input type="number" step="0.01" {...register('maxDiscount')} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Usage Limit (Optional)</label>
                    <input type="number" {...register('usageLimit')} placeholder="Total times this can be used" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Expiration Date (Optional)</label>
                    <input type="datetime-local" {...register('expiresAt')} />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
                  <button type="submit" className={styles.submitBtn}>Create Coupon</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
