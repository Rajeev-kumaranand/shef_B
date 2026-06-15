/**
 * Centralized Dynamic Slide Image Registry for shef&B.
 * Dynamically resolves all slide images under src/assets/slidesImages/ using Vite's glob import.
 * Responsible ONLY for dynamic loading, image mapping, and image lookup helpers.
 * Contains no business copywriting, descriptions, or generated marketing text.
 */

// Eagerly import all jpg slide images under assets/slidesImages
const slideModules = import.meta.glob('../assets/slidesImages/*.jpg', { eager: true });

// Process and map slide images dynamically
const processedSlides = Object.keys(slideModules).map((filePath) => {
  const fileName = filePath.split('/').pop() || '';
  const id = fileName.replace(/\.[^/.]+$/, ""); // strip extension
  
  // Extract number and sub-number for natural sorting (e.g. "slide23-1" -> num: 23, sub: 1)
  const match = id.match(/slide(\d+)(?:-(\d+))?/i);
  const num = match ? parseInt(match[1], 10) : 999;
  const sub = match && match[2] ? parseInt(match[2], 10) : 0;
  
  // Resolve bundler URL
  const url = slideModules[filePath]?.default || slideModules[filePath];

  return {
    id,
    fileName,
    url,
    num,
    sub
  };
});

// Natural sort: slide1, slide2, ..., slide23-1, slide23-2, ...
processedSlides.sort((a, b) => {
  if (a.num !== b.num) {
    return a.num - b.num;
  }
  return a.sub - b.sub;
});

// Frozen registry to preserve architectural integrity
export const slidesData = Object.freeze(processedSlides);

/**
 * Retrieves a single slide by its structural ID key.
 * 
 * @param {string} id - Slide ID (e.g. 'slide1', 'slide23-2').
 * @returns {object|undefined} Slide metadata object or undefined.
 */
export function getSlideById(id) {
  return slidesData.find(slide => slide.id === id);
}

/**
 * Retrieves all loaded slides.
 * 
 * @returns {Array} List of all resolved slide objects.
 */
export function getAllSlides() {
  return slidesData;
}
