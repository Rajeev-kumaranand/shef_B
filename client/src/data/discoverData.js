import { getSlideById } from './slidesData.js';

export const discoverData = {
  hero: {
    title: 'A New Paradigm of Living',
    subtitle: 'The Methodology',
    description: 'We believe that space is not merely physical, but emotional. Every curve, every texture, every shadow is an invitation to experience life with greater depth and clarity.',
    image: getSlideById('slide1')
  },
  philosophy: {
    heading: 'The Atelier',
    paragraphs: [
      'Founded on the principles of quiet luxury and architectural restraint, shef&B emerged as a response to the chaotic overdesign of the modern era.',
      'Our approach is reductionist yet warm, favoring materials that age gracefully and forms that respect the human scale. We craft environments that serve as sanctuaries.'
    ]
  },
  craftsmanship: {
    title: 'The Art of Making',
    items: [
      {
        id: '01',
        title: 'Tactile Materiality',
        description: 'Sourcing organic, unrefined materials that tell a story of their origin.',
      },
      {
        id: '02',
        title: 'Spatial Harmony',
        description: 'Balancing negative space with functional elements to create visual silence.',
      },
      {
        id: '03',
        title: 'Timeless Form',
        description: 'Avoiding transient trends in favor of classical proportions and enduring silhouettes.',
      }
    ],
    image: getSlideById('slide2')
  },
  valuesGrid: {
    title: 'Core Values',
    cards: [
      { id: 1, title: 'Authenticity', image: getSlideById('slide4') },
      { id: 2, title: 'Restraint', image: getSlideById('slide5') },
      { id: 3, title: 'Permanence', image: getSlideById('slide6') },
      { id: 4, title: 'Proportion', image: getSlideById('slide7') }
    ]
  },
  editorialGallery: {
    title: 'Visual Identity',
    images: [
      getSlideById('slide8'),
      getSlideById('slide9'),
      getSlideById('slide10')
    ]
  },
  cta: {
    title: 'Become part of the narrative.',
    buttonText: 'Explore Membership',
    link: '/community'
  }
};
