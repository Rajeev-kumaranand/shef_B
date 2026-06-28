import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TestimonialCarousel.module.css';

// A simple helper function to selectively italicize words for the aesthetic
const processQuote = (text) => {
  if (!text) return null;
  const words = text.split(' ');
  return words.map((word, index) => {
    // Arbitrarily italicize words for the visual effect if they meet certain criteria
    // e.g. words longer than 5 letters, or specific keywords.
    // To closely mimic the reference image, we can just pseudo-randomly pick chunks
    // or just use a simple modulo for now, or match specific keywords if we know them.
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    const shouldItalicize = (index > 2 && index % 6 === 0) || (cleanWord.length > 7 && index % 2 === 0);
    
    if (shouldItalicize) {
      return <span key={index} className={styles.italicText}>{word} </span>;
    }
    return word + ' ';
  });
};

export default function TestimonialCarousel({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play the carousel
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className={styles.carouselContainer}>
      <button className={`${styles.navButton} ${styles.prevButton}`} onClick={handlePrev}>
        ‹
      </button>

      <div className={styles.stars}>
        {/* Render 5 yellow stars */}
        {[...Array(5)].map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>

      <div className={styles.quoteContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.quoteText}>
              “{processQuote(currentTestimonial.quote)}”
            </h2>
            <div className={styles.authorInfo}>
              <p className={styles.authorName}>{currentTestimonial.author}</p>
              {currentTestimonial.role && (
                <p className={styles.authorRole}>{currentTestimonial.role}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.pagination}>
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${currentIndex === idx ? styles.dotActive : ''}`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <button className={`${styles.navButton} ${styles.nextButton}`} onClick={handleNext}>
        ›
      </button>
    </div>
  );
}
