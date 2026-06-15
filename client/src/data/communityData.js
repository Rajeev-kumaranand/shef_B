import { getSlideById } from './slidesData.js';

export const communityData = {
  hero: {
    title: 'Community',
    subtitle: 'The Vanguard',
    description: 'A global network of architects, designers, and patrons who share our commitment to uncompromising craftsmanship and quiet luxury.',
    image: getSlideById('slide7')
  },
  memberStories: {
    title: 'Profiles in Design',
    stories: [
      {
        id: 's1',
        name: 'Elena Rossi',
        role: 'Interior Architect, Milan',
        quote: 'The pieces anchor my spaces. They speak softly but carry immense weight.',
        image: getSlideById('slide8')
      },
      {
        id: 's2',
        name: 'David Chen',
        role: 'Collector, New York',
        quote: 'I surround myself with objects that ask for my attention not through noise, but through presence.',
        image: getSlideById('slide9')
      }
    ]
  },
  testimonials: {
    title: 'Perspectives',
    items: [
      { quote: 'Their understanding of material honesty has fundamentally shifted how I approach my own residential projects.', author: 'Sarah Jenkins', role: 'Architect' },
      { quote: 'A rare dedication to the slow, deliberate art of making things well.', author: 'Marcus V.', role: 'Designer' },
      { quote: 'The spatial harmony achieved in their showrooms is something I try to replicate in my own life.', author: 'A. H.', role: 'Patron' },
      { quote: 'Every piece feels inevitable. Like it was always meant to exist exactly as it does.', author: 'Elena R.', role: 'Curator' },
      { quote: 'Unapologetically austere, yet deeply human and warm.', author: 'Thomas K.', role: 'Editor' },
      { quote: 'A masterclass in restraint and the power of negative space.', author: 'Julia M.', role: 'Creative Director' }
    ]
  },
  experiences: {
    title: 'Upcoming Gathers',
    events: [
      { title: 'Material Exploration Walk', date: 'November 12, 2026', location: 'Carrara, Italy' },
      { title: 'Private Studio Viewing', date: 'December 05, 2026', location: 'Mumbai, India' }
    ]
  },
  gallery: {
    title: 'The Archive',
    images: [
      getSlideById('slide1'),
      getSlideById('slide2'),
      getSlideById('slide3'),
      getSlideById('slide4'),
      getSlideById('slide5'),
      getSlideById('slide6')
    ]
  },
  cta: {
    title: 'Join the Vanguard',
    description: 'Submit your portfolio or collection history for consideration.',
    buttonText: 'Apply for Membership'
  }
};
