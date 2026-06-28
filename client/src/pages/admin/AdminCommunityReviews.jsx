import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminCommunityReviews.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminCommunityReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/community-reviews/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data.reviews || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load community reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/community-reviews/admin/${id}/approve`, 
        { approved: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistic update
      setReviews(reviews.map(r => r.id === id ? { ...r, approved: !currentStatus } : r));
    } catch (err) {
      console.error(err);
      alert('Failed to update approval status');
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/community-reviews/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  if (loading) return <div>Loading community reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Community Reviews</h2>
      <p>Manage the perspectives submitted by the community.</p>

      {reviews.length === 0 ? (
        <p>No community reviews found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Role/Location</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>{review.name}<br/><small>{review.email}</small></td>
                <td>{review.role || '-'}</td>
                <td>{review.rating} ★</td>
                <td className={styles.messageCell}>{review.message}</td>
                <td>
                  <span className={review.approved ? styles.approvedBadge : styles.pendingBadge}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button 
                    onClick={() => toggleApproval(review.id, review.approved)}
                    className={styles.toggleBtn}
                  >
                    {review.approved ? 'Hide' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => deleteReview(review.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
