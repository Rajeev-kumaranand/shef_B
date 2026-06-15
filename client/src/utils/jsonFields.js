/**
 * Safely parses a JSON string field from the database for the CMS UI.
 * Handles invalid JSON, null, and empty arrays gracefully.
 * 
 * @param {string|object} field - The string or object to parse
 * @param {any} fallback - The fallback value if parsing fails (usually [])
 * @returns {any}
 */
export const deserializeField = (field, fallback = []) => {
  if (!field) return fallback;
  if (typeof field === 'object') return field;
  
  try {
    const parsed = JSON.parse(field);
    return parsed || fallback;
  } catch (error) {
    console.warn('Failed to parse JSON field:', field);
    // If it's a string that failed to parse (e.g. a legacy single string paragraph), wrap it in the fallback array format if applicable
    if (typeof field === 'string' && Array.isArray(fallback)) {
      return [{ value: field }];
    }
    return fallback;
  }
};

/**
 * Serializes a UI array or object into a JSON string for database storage.
 * 
 * @param {any} field - The data to serialize
 * @returns {string}
 */
export const serializeField = (field) => {
  if (field === null || field === undefined) return null;
  if (typeof field === 'string') return field;
  
  try {
    return JSON.stringify(field);
  } catch (error) {
    console.warn('Failed to serialize JSON field:', field);
    return null;
  }
};
