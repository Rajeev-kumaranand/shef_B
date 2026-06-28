import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './CommunityReviewForm.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CommunityReviewForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    rating: 5,
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // We format the message to include the rating and role if needed, or send them cleanly.
      // Since our new schema supports these fields individually:
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        rating: formData.rating,
        message: formData.message,
      };

      await axios.post(`${API_URL}/community-reviews`, payload);
      setIsSuccess(true);
    } catch (err) {
      console.error('Review submission error:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.formSection}>
        <motion.div 
          className={styles.successMessage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3>Thank You</h3>
          <p>Your perspective has been submitted successfully.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.formSection}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h3 className={styles.formTitle}>Share Your Perspective</h3>
          <p className={styles.formDesc}>Contribute to the narrative of shef&B.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="rating">Rating</label>
            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${star <= formData.rating ? styles.starFilled : ''}`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="role">Role / Location (Optional)</label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="e.g., Architect, Milan"
              className={styles.input}
              value={formData.role}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="message">Your Perspective *</label>
            <textarea
              id="message"
              name="message"
              required
              className={styles.textarea}
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Perspective'}
          </button>
        </form>
      </div>
    </div>
  );
}
