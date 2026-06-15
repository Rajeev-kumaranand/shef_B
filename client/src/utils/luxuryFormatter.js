/**
 * Luxury-centric editorial formatting utilities for shef&B.
 */

/**
 * Formats a currency value to US standards (or bespoke request for ultra-high-ticket tiers).
 * Premium products or retreats above the inquiry threshold will show an elegant inquiry invitation.
 * 
 * @param {number} amount - The numeric price amount.
 * @param {object} options - Configuration options.
 * @param {number} options.inquiryThreshold - Price limit above which it requires bespoke inquiry (default: 15000).
 * @param {string} options.currency - Currency code (default: 'USD').
 * @param {boolean} options.allowInquiry - Whether to enable "Bespoke Pricing" behavior (default: true).
 * @returns {string} Formatted price or bespoke inquiry message.
 */
export function formatCurrency(amount, { inquiryThreshold = 15000, currency = 'USD', allowInquiry = true } = {}) {
  if (amount === undefined || amount === null) return 'Bespoke Pricing';
  
  if (allowInquiry && amount >= inquiryThreshold) {
    return 'Price on Inquiry';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0, // Luxury brands rarely use decimals (e.g., $1,500 instead of $1,500.00)
  }).format(amount);
}

/**
 * Formats a date into a clean, refined editorial layout.
 * Example output: "02 June 2026" or "June 2026"
 * 
 * @param {Date|string|number} dateVal - The date representation.
 * @param {object} options - Format options.
 * @param {boolean} options.includeDay - Whether to show the day (default: true).
 * @returns {string} Formatted date.
 */
export function formatDate(dateVal, { includeDay = true } = {}) {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';

  const day = includeDay ? String(date.getDate()).padStart(2, '0') + ' ' : '';
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return `${day}${month} ${year}`;
}

/**
 * Calculates the reading time of an editorial text column.
 * Returns a high-end uppercase reading string.
 * 
 * @param {string} text - The input text or markdown.
 * @param {number} wordsPerMinute - Average reading speed (default: 200).
 * @returns {string} Elegant reading time descriptor (e.g. "4 MIN READ").
 */
export function getReadingTime(text, wordsPerMinute = 200) {
  if (!text || typeof text !== 'string') return '1 MIN READ';
  
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} MIN READ`;
}
