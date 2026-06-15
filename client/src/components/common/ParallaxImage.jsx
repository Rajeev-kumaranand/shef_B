/**
 * ParallaxImage.jsx
 * GSAP ScrollTrigger based parallax image component.
 * Features a clean, fluid translation matched with Lenis scroll inertia.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ParallaxImage.module.css';
import { cn } from '../../utils/cn.js';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 15, // Percent offset of parallax travel
  aspectRatio = 'landscape' // landscape | portrait | square | wide
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const ctx = gsap.context(() => {
      // Parallax timeline
      gsap.fromTo(image, 
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, [speed]);

  const aspectClass = {
    landscape: styles.aspectLandscape,
    portrait: styles.aspectPortrait,
    square: styles.aspectSquare,
    wide: styles.aspectWide,
  }[aspectRatio] || styles.aspectLandscape;

  return (
    <div ref={containerRef} className={cn(styles.container, aspectClass, className)}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={styles.image}
        loading="lazy"
      />
    </div>
  );
}
