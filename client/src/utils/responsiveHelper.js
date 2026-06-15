import { useState, useEffect } from 'react';
import { themeData } from '../data/themeData.js';

/**
 * Custom hook to subscribe to any standard CSS Media Query.
 * Zero external dependencies.
 * 
 * @param {string} query - The CSS media query string (e.g., "(min-width: 1024px)").
 * @returns {boolean} Whether the media query is currently matching.
 */
export function useMediaQuery(query) {
  // SSR safety fallback
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    
    // Set initial state correctly
    setMatches(mediaQueryList.matches);

    // Modern event listener setup
    const listener = (event) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', listener);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

/**
 * Custom hook to listen to the viewport state using the centralized themeData breakpoints.
 * 
 * @param {string} breakpointKey - Breakpoint key from themeData ('xs', 'sm', 'md', 'lg', 'xl', 'xxl').
 * @param {'min'|'max'} [direction] - Query direction: 'min' for >=, 'max' for <= (default: 'min').
 * @returns {boolean} Whether the screen matches the breakpoint query.
 */
export function useBreakpoint(breakpointKey, direction = 'min') {
  const breakpoints = themeData?.breakpoints || {};
  const width = breakpoints[breakpointKey];

  if (!width) {
    console.warn(`[useBreakpoint] Invalid breakpoint key: "${breakpointKey}". Available keys: ${Object.keys(breakpoints).join(', ')}`);
    return false;
  }

  // Adjust max-width by a fraction of a pixel to avoid overlap collisions
  const formattedWidth = direction === 'max' 
    ? `${parseFloat(width) - 0.02}px` 
    : width;

  const query = `(${direction}-width: ${formattedWidth})`;
  return useMediaQuery(query);
}
