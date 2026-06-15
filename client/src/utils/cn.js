/**
 * Combines and merges class names into a single string.
 * Supports strings, arrays, and objects with boolean values.
 * Zero-dependency, lightweight replacement for classnames / clsx.
 * 
 * @param {...any} inputs - Class names, arrays, or objects of classes.
 * @returns {string} - Combined class name string.
 */
export function cn(...inputs) {
  const classes = [];

  for (const input of inputs) {
    if (!input) continue;

    const type = typeof input;

    if (type === 'string' || type === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const resolved = cn(...input);
      if (resolved) classes.push(resolved);
    } else if (type === 'object') {
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
