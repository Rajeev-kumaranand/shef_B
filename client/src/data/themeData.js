/**
 * Client-driven Design System Tokens for the shef&B luxury platform.
 * Rebuilt around the explicitly requested brand colors: Red, Green, Blue, Black.
 * Luxury aesthetic is achieved through typography, spacing, motion, and composition.
 */
export const themeData = {
  // Brand Color Tokens (Red, Green, Blue, Black)
  colors: {
    brand: {
      red: '#D32F2F',    // Premium Scarlet Red
      green: '#2E7D32',  // Botanical Emerald Green
      blue: '#1565C0',   // Calming Sapphire Blue
      black: '#000000',  // Deep Obsidian Black
    },
    
    // Semantic mappings derived from brand colors
    primary: {
      light: '#FF6659',
      main: '#D32F2F',   // Brand Red
      dark: '#9A0007',
    },
    secondary: {
      light: '#60AD5E',
      main: '#2E7D32',   // Brand Green
      dark: '#005005',
    },
    accent: {
      light: '#5E92F3',
      main: '#1565C0',   // Brand Blue
      dark: '#003C8F',
    },
    neutral: {
      black: '#000000',  // Solid Brand Black
      darkGray: '#121212', // Charcoal background
      editorialGray: '#8E8E93', // Editorial gray body text
      lightGray: '#F2F2F7', // Editorial layout dividers
      white: '#FFFFFF',  // Crisp text overlay
    }
  },

  // High-End Editorial Typography System
  typography: {
    fonts: {
      display: "'Plus Jakarta Sans', sans-serif", // Display
      body: "'IBM Plex Mono', monospace",  // Body
      mono: "'IBM Plex Mono', monospace",                           // Fine Technical Print
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px - Standard Editorial Body Text
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      xxl: '1.5rem',     // 24px
      h4: '2rem',        // 32px
      h3: '2.5rem',      // 40px
      h2: '3.5rem',      // 56px
      h1: '5rem',        // 80px - Massive editorial tracking header
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      none: 1,
      tight: 1.15,      // Headings
      snug: 1.3,        // Sub-elements
      normal: 1.5,      // Standard Prose
      relaxed: 1.7,     // High-readability narrative
    },
    letterSpacings: {
      tight: '-0.02em',
      normal: '0em',
      wide: '0.05em',
      widest: '0.18em',   // Highly tracked luxury headers
    }
  },

  // Refined Spacing System (Generous luxury whitespace controls)
  spacing: {
    none: '0px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '64px',
    super: '96px',      // Extra wide editorial margins
  },

  // High-End Motion Curves & Durations
  animations: {
    durations: {
      instant: '50ms',
      fast: '200ms',
      normal: '350ms',
      slow: '600ms',
      ultraSlow: '1200ms',
    },
    easings: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      luxury: 'cubic-bezier(0.25, 1, 0.5, 1)',      // Apple-like smooth decrescendo
      editorial: 'cubic-bezier(0.76, 0, 0.24, 1)',  // Snappy high-end slide/reveal curve
      parallax: 'cubic-bezier(0.16, 1, 0.3, 1)',   // Fluid inertia scroll curves
    }
  },

  // Fluid Breakpoints
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },

  // Premium Shadows
  shadows: {
    none: 'none',
    subtle: '0 2px 8px rgba(0, 0, 0, 0.05)',
    soft: '0 8px 24px rgba(0, 0, 0, 0.08)',
    premium: '0 16px 48px rgba(0, 0, 0, 0.12)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },

  // Refined Border Radii (Sharp modern cuts or organic circles)
  radius: {
    none: '0px',       // Sharp Haute Couture style (Primary luxury standard)
    xs: '2px',         // Slight geometric curves
    sm: '4px',
    md: '8px',         // Fluid controls
    lg: '16px',        // Overlays
    full: '9999px',
  }
};
