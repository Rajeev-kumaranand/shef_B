/**
 * Theme helpers for converting the javascript-based luxury design tokens
 * into CSS Custom Properties (CSS variables), bridging JS logic with CSS Modules.
 */

/**
 * Recursively flattens a nested theme object into CSS Custom Property key-value pairs.
 * E.g., { colors: { primary: { main: '#C5A880' } } } becomes { '--colors-primary-main': '#C5A880' }
 * 
 * @param {object} obj - The nested theme object.
 * @param {string} prefix - Variable prefix (default: '--').
 * @returns {object} Flattened key-value dictionary of CSS variables.
 */
export function flattenThemeToCssVariables(obj, prefix = '--') {
  const vars = {};

  function recurse(current, currentPrefix) {
    for (const key in current) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        const val = current[key];
        // Clean up camelCase or snake_case key names to standard CSS dash format if needed
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        const newPrefix = `${currentPrefix}-${cssKey}`;

        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          recurse(val, newPrefix);
        } else {
          vars[newPrefix] = val;
        }
      }
    }
  }

  recurse(obj, prefix);
  return vars;
}

/**
 * Dynamically injects design tokens as global CSS Custom Properties inside the document root (:root).
 * 
 * @param {object} theme - The theme tokens object (themeData).
 * @param {HTMLElement} [element] - Target element, defaults to document.documentElement.
 */
export function injectTheme(theme, element = document.documentElement) {
  if (typeof window === 'undefined' || !element) return;

  const cssVars = flattenThemeToCssVariables(theme);
  
  // Apply each variable to the target element's style
  Object.keys(cssVars).forEach((key) => {
    element.style.setProperty(key, cssVars[key]);
  });
}

/**
 * Safely resolves a nested value inside the theme object using dot notation.
 * Example: getThemeValue(themeData, 'colors.primary.main')
 * 
 * @param {object} theme - The nested theme object.
 * @param {string} path - Dot-separated path to the token.
 * @param {any} [fallback] - Fallback value if lookup fails.
 * @returns {any} Resolving value.
 */
export function getThemeValue(theme, path, fallback = undefined) {
  if (!theme || !path) return fallback;
  
  const keys = path.split('.');
  let current = theme;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return fallback;
    }
  }

  return current !== undefined ? current : fallback;
}
