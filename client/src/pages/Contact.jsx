import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { contactData } from '../data/contactData.js';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import ImageReveal from '../components/common/ImageReveal.jsx';
import FadeUp from '../components/animation/FadeUp.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './Contact.module.css';

export default function Contact() {
  const { hero, contactInfo, socials, form, map } = contactData;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: form.fields[2].options[0],
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/contact`, formData);
      if (res.data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: form.fields[2].options[0], // Reset to default subject
          message: ''
        });
        toast.success('Your inquiry has been sent successfully!');
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(error => {
          toast.error(`${error.msg}`);
        });
      } else {
        toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      <SEOManager pageKey="contact" />
      {/* 1. Hero */}
      <Section className={styles.heroSection} spacing="none">
        <Container width="wide" className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <FadeUp delay={0.1}>
              <p className={styles.heroSubtitle}>{hero.subtitle}</p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h1 className={styles.heroTitle}>{hero.title}</h1>
            </FadeUp>
            <FadeUp delay={0.3}>
              <p className={styles.heroDescription}>{hero.description}</p>
            </FadeUp>
          </div>
          {hero.image && (
            <div className={styles.heroImageWrapper}>
              <ImageReveal src={hero.image.url} alt="Contact Hero" aspectRatio="cinematic" />
            </div>
          )}
        </Container>
      </Section>

      {/* 2. Main Layout: Info + Form */}
      <Section spacing="large">
        <Container width="wide">
          <div className={styles.grid}>

            {/* Left: Contact Information & Socials */}
            <div className={styles.infoCol}>
              <FadeUp delay={0.1}>
                <h3 className={styles.colTitle}>{contactInfo.title}</h3>
                <div className={styles.detailsList}>
                  {contactInfo.details.map((detail, idx) => (
                    <div key={idx} className={styles.detailItem}>
                      <span className={styles.detailLabel}>{detail.label}</span>
                      {detail.link ? (
                        <a href={detail.link} className={styles.detailValueLink}>{detail.value}</a>
                      ) : (
                        <span className={styles.detailValue}>{detail.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp delay={0.2} className={styles.socialsWrapper}>
                <h3 className={styles.colTitle}>{socials.title}</h3>
                <div className={styles.socialsList}>
                  {socials.platforms.map((platform, idx) => (
                    <a
                      key={idx}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      {platform.name}
                    </a>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right: Inquiry Form */}
            <div className={styles.formCol}>
              <FadeUp delay={0.3}>
                <SectionTitle title={form.title} className={styles.formTitle} />

                {submitted ? (
                  <div className={styles.successMessage}>
                    <p>Thank you for your inquiry. A member of our team will be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.contactForm}>
                    {form.fields.map((field, idx) => (
                      <div key={idx} className={styles.inputGroup}>
                        <label htmlFor={field.name} className={styles.label}>
                          {field.label} {field.required && '*'}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            rows={5}
                            className={styles.textarea}
                            value={formData[field.name]}
                            onChange={handleChange}
                          />
                        ) : field.type === 'select' ? (
                          <div className={styles.selectWrapper}>
                            <select
                              id={field.name}
                              name={field.name}
                              required={field.required}
                              className={styles.select}
                              value={formData[field.name]}
                              onChange={handleChange}
                            >
                              {field.options.map((opt, oIdx) => (
                                <option key={oIdx} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            className={styles.input}
                            value={formData[field.name]}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    ))}
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                      {loading ? 'Sending...' : form.submitText}
                    </button>
                  </form>
                )}
              </FadeUp>
            </div>

          </div>
        </Container>
      </Section>

      {/* 3. Embedded Map Placeholder */}
      <Section spacing="default" className={styles.mapSection}>
        <Container width="full">
          <FadeUp>
            <div className={styles.mapWrapper}>
              {map.placeholderImage && (
                <img
                  src={map.placeholderImage.url}
                  alt="Location Map"
                  className={styles.mapImage}
                  loading="lazy"
                />
              )}
              <div className={styles.mapOverlay}>
                <h4 className={styles.mapOverlayTitle}>{map.title}</h4>
              </div>
            </div>
          </FadeUp>
        </Container>
      </Section>

    </div>
  );
}
