/**
 * Image helpers for luxury-grade aspect ratios and fallback placeholder rendering.
 */

export const ASPECT_RATIOS = {
  portrait: '4/5',      // Luxury editorial portrait (standard for fashion/wellness portfolios)
  landscape: '16/9',    // Cinematic wide hero slide
  square: '1/1',       // High-end product showcase
  cinema: '21/9',       // Ultra-wide immersive spatial banner
  classic: '3/2'        // Professional 35mm art photography aspect
};

/**
 * Calculates padding-bottom percentage for aspect ratios, useful for responsive container boxes.
 * 
 * @param {string} ratio - The aspect ratio key or division string (e.g. '4/5', '16/9').
 * @returns {string} The percentage string (e.g. '125%').
 */
export function getAspectPaddingPercentage(ratio) {
  const actualRatio = ASPECT_RATIOS[ratio] || ratio;
  if (!actualRatio || !actualRatio.includes('/')) return '100%';
  
  const [width, height] = actualRatio.split('/').map(Number);
  if (isNaN(width) || isNaN(height) || width === 0) return '100%';
  
  return `${((height / width) * 100).toFixed(2)}%`;
}

/**
 * Generates an elegant, high-end vector SVG placeholder encoded as a Data URI.
 * Styled purely using the brand colors: Black background, Red border, Green detail, Blue subtitle.
 * 
 * @param {number} [width] - Desired width (default: 800).
 * @param {number} [height] - Desired height (default: 600).
 * @param {string} [text] - Text label overlay (default: 'shef&B').
 * @returns {string} Fully encoded SVG Data URI.
 */
export function getLuxuryPlaceholder(width = 800, height = 600, text = 'shef&B') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#000000"/>
    <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="none" stroke="#D32F2F" stroke-width="1.5" opacity="0.8"/>
    <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="28" font-weight="300" fill="#FFFFFF">${text}</text>
    <circle cx="50%" cy="53%" r="3" fill="#2E7D32"/>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" letter-spacing="0.3em" fill="#1565C0" opacity="0.9">ATELIER MUMBAI</text>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
