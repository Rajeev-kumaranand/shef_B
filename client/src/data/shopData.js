import { getSlideById } from './slidesData.js';

export const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'objects', label: 'Objects' },
  { id: 'textiles', label: 'Textiles' },
  { id: 'art', label: 'Art Editions' },
];

export const shopData = {
  hero: {
    title: 'The Essentials',
    subtitle: 'Volume I',
    description: 'A curated selection of elemental forms, designed to anchor any space with quiet authority.',
    image: getSlideById('slide20')
  },
  featuredCollection: {
    title: 'Featured Objects',
    items: [
      {
        id: 'p1',
        name: 'The Lounge Chair',
        category: 'furniture',
        price: '$4,200',
        description: 'Sculptural silhouette wrapped in tactile boucle.',
        image: getSlideById('slide11'),
        hoverImage: getSlideById('slide12')
      },
      {
        id: 'p2',
        name: 'Marble Plinth',
        category: 'objects',
        price: '$1,800',
        description: 'Solid Calacatta Viola marble, hand-honed.',
        image: getSlideById('slide13')
      }
    ]
  },
  products: [
    {
      id: 'p3',
      name: 'Linen Throw',
      category: 'textiles',
      price: '$450',
      description: 'Heavyweight Belgian linen with frayed edges.',
      image: getSlideById('slide14'),
    },
    {
      id: 'p4',
      name: 'Abstract Canvas',
      category: 'art',
      price: '$3,500',
      description: 'Mixed media on raw canvas, unique piece.',
      image: getSlideById('slide15'),
    },
    {
      id: 'p5',
      name: 'Dining Table',
      category: 'furniture',
      price: '$8,500',
      description: 'Solid smoked oak with monumental proportions.',
      image: getSlideById('slide16'),
    },
    {
      id: 'p6',
      name: 'Ceramic Vessel',
      category: 'objects',
      price: '$650',
      description: 'Wheel-thrown stoneware with reactive glaze.',
      image: getSlideById('slide17'),
    },
    {
      id: 'p7',
      name: 'Woven Rug',
      category: 'textiles',
      price: '$2,100',
      description: 'Hand-knotted wool and silk blend.',
      image: getSlideById('slide18'),
    },
    {
      id: 'p8',
      name: 'Bronze Sculpture',
      category: 'art',
      price: '$5,200',
      description: 'Cast bronze with black patina.',
      image: getSlideById('slide19'),
    }
  ],
  story: {
    title: 'The Philosophy of Objects',
    paragraphs: [
      'We do not believe in decoration. We believe in objects that possess enough gravity to alter the atmosphere of a room.',
      'Every piece in our collection is born from a dialogue between material and maker. We let the inherent qualities of stone, wood, and raw fiber dictate the final form.'
    ]
  },
  cta: {
    title: 'Bespoke Inquiries',
    description: 'Many of our pieces can be tailored to specific spatial requirements.',
    buttonText: 'Contact the Studio',
    link: '/contact'
  }
};
