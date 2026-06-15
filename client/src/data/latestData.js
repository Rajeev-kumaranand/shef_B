import { getSlideById } from './slidesData.js';

export const latestData = {
  hero: {
    title: 'The Latest',
    subtitle: 'Journal & Editorials',
    description: 'A curated dialogue on art, architecture, and the pursuit of quiet luxury.'
  },
  featuredArticle: {
    id: 'f1',
    category: 'Architecture',
    date: 'October 12, 2026',
    title: 'The Monolith: A Study in Brutalist Warmth',
    excerpt: 'Exploring the intersection of heavy concrete forms and the tactile softness of natural textiles inside our latest sanctuary project in the Swiss Alps.',
    image: getSlideById('slide23-1'),
    link: '/note'
  },
  articles: [
    {
      id: 'a1',
      category: 'Design',
      date: 'September 28, 2026',
      title: 'Tactile Materiality in the Digital Age',
      excerpt: 'Why physical textures matter more than ever in spaces designed for digital detox.',
      image: getSlideById('slide23-2'),
      link: '/note'
    },
    {
      id: 'a2',
      category: 'Sourcing',
      date: 'September 15, 2026',
      title: 'The Search for Perfect Calacatta Viola',
      excerpt: 'A photographic journey through the Apuan Alps to find the most expressive veining for our new collection.',
      image: getSlideById('slide23-3'),
      link: '/note'
    },
    {
      id: 'a3',
      category: 'Interview',
      date: 'August 30, 2026',
      title: 'In Conversation with Studio X',
      excerpt: 'Discussing the philosophy of reductionism and the enduring appeal of shadow play.',
      image: getSlideById('slide24-1'),
      link: '/note'
    },
    {
      id: 'a4',
      category: 'Exhibition',
      date: 'August 10, 2026',
      title: 'Salone del Mobile Retrospective',
      excerpt: 'A curated look at the forms that defined this year’s international design fair in Milan.',
      image: getSlideById('slide24-2'),
      link: '/note'
    },
    {
      id: 'a5',
      category: 'Lifestyle',
      date: 'July 22, 2026',
      title: 'The Art of the Slow Morning',
      excerpt: 'Curating spaces that encourage reflection and presence at the start of the day.',
      image: getSlideById('slide24-3'),
      link: '/note'
    }
  ],
  highlights: {
    title: 'Editorial Highlights',
    topics: ['Architecture', 'Interviews', 'Sourcing', 'Design Theory']
  },
  newsletter: {
    title: 'The Digest',
    description: 'A monthly curation of our latest writings and allocations, delivered quietly to your inbox.',
    cta: 'Subscribe'
  }
};
