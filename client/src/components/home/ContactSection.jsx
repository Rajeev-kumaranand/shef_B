import { useState } from 'react';
import { useContact } from '../../hooks/useApi.js';
import Container from '../common/Container.jsx';
import Section from '../common/Section.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import LuxuryButton from '../common/LuxuryButton.jsx';
import FadeUp from '../animation/FadeUp.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './ContactSection.module.css';

export default function ContactSection({ content, loading }) {
  const { data: globalContact, loading: contactLoading } = useContact();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    interest: content?.interests?.[0] || 'Private Wellness Membership',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email) {
      setSubmitted(true);
      setForm({ name: '', email: '', interest: content?.interests?.[0] || 'Private Wellness Membership', message: '' });
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <Section id="contact" background="transparent" spacing="large">
        <Container width="wide">
          <Skeleton width="40%" height="40px" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
            <Skeleton width="100%" height="300px" />
            <Skeleton width="100%" height="500px" />
          </div>
        </Container>
      </Section>
    );
  }

  const { subtitle, title, description, fields, interests } = content || {};

  return (
    <Section id="contact" background="transparent" spacing="large">
      <Container width="wide">
        <div className={styles.grid}>
          {/* Coordinates Block */}
          <div className={styles.coordinates}>
            <SectionTitle subtitle={subtitle} title={title} className={styles.titleOverride} />
            <FadeUp delay={0.3}>
              <p className={styles.desc}>{description}</p>
              
              <div className={styles.infoBlocks}>
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>General Inquiries</span>
                  {contactLoading ? <Skeleton width="150px" height="20px" /> : (
                    <a href={`mailto:${globalContact?.email}`} className={styles.infoValue}>
                      {globalContact?.email}
                    </a>
                  )}
                </div>
                
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Atelier Location</span>
                  {contactLoading ? <Skeleton width="200px" height="40px" /> : (
                    <span className={styles.infoValue}>{globalContact?.address}</span>
                  )}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Form Block */}
          <div className={styles.formContainer}>
            {submitted ? (
              <FadeUp delay={0.1} className={styles.successBlock}>
                <h3 className={styles.successTitle}>Inquiry Logged</h3>
                <p className={styles.successDesc}>
                  Our concierge team will review your credentials and get back to you shortly.
                </p>
                <LuxuryButton onClick={() => setSubmitted(false)} variant="outline">
                  Send Another Inquiry
                </LuxuryButton>
              </FadeUp>
            ) : (
              <FadeUp delay={0.2}>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="name" className={styles.label}>{fields?.name || 'Your Name'}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="email" className={styles.label}>{fields?.email || 'Email Address'}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="interest" className={styles.label}>{fields?.interest || 'Area of Interest'}</label>
                    <select
                      id="interest"
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      {interests?.map((interest, idx) => (
                        <option key={idx} value={interest}>
                          {interest}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="message" className={styles.label}>{fields?.message || 'Your Message'}</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      required
                      value={form.message}
                      onChange={handleChange}
                      className={styles.textarea}
                    />
                  </div>

                  <div className={styles.action}>
                    <LuxuryButton type="submit" variant="dark">
                      Submit Request
                    </LuxuryButton>
                  </div>
                </form>
              </FadeUp>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
