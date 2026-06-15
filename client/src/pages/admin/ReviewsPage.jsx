import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import ErrorState from '../../components/admin/states/ErrorState.jsx';
import styles from './ReviewsPage.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch reviews.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/reviews/${id}/approve`, { approved: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReviews(reviews.map(r => r.id === id ? { ...r, approved: !currentStatus } : r));
        toast.success(currentStatus ? 'Review rejected' : 'Review approved');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.filter(r => r.id !== id));
      toast.success('Review deleted');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <LoadingState message="Loading reviews..." />;
  if (error) return <ErrorState message={error} onRetry={fetchReviews} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Product Reviews</h1>
      </header>

      {reviews.length === 0 ? (
        <div className={styles.emptyState}>No reviews yet.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id} className={!review.approved ? styles.pendingRow : ''}>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td><strong>{review.product?.name}</strong></td>
                  <td>
                    {review.customer?.name}<br/>
                    <small className={styles.textMuted}>{review.customer?.email}</small>
                  </td>
                  <td>
                    <div className={styles.stars}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className={star <= review.rating ? styles.starFilled : styles.starEmpty}>★</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong>{review.title}</strong>
                    <p className={styles.comment}>{review.comment}</p>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleApproval(review.id, review.approved)}
                      className={`${styles.statusBadge} ${review.approved ? styles.approved : styles.pending}`}
                    >
                      {review.approved ? 'Approved' : 'Pending'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => deleteReview(review.id)} className={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
