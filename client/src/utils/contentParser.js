/**
 * Safely parses a JSON string field from the database.
 * @param {string|object} field - The JSON string to parse
 * @param {any} fallback - The fallback value if parsing fails
 * @returns {any}
 */
export const parseJsonField = (field, fallback = null) => {
  if (!field) return fallback;
  if (typeof field === 'object') return field; // Already parsed
  
  try {
    return JSON.parse(field);
  } catch (error) {
    console.warn('Failed to parse JSON field:', field);
    return fallback;
  }
};

/**
 * Serializes a Javascript object into a JSON string for DB storage.
 * @param {any} field - The object/array to serialize
 * @returns {string}
 */
export const serializeJsonField = (field) => {
  if (field === null || field === undefined) return null;
  if (typeof field === 'string') return field; // Already serialized
  
  try {
    return JSON.stringify(field);
  } catch (error) {
    console.warn('Failed to serialize JSON field:', field);
    return null;
  }
};
