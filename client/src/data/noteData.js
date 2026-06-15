import { orgData } from './orgData.js';
import { getSlideById } from './slidesData.js';

export const noteData = {
  hero: {
    title: 'A Note',
    subtitle: 'From the Founders',
    description: 'Reflections on the intersection of space, light, and living.',
    image: getSlideById('slide12')
  },
  foundersLetter: {
    title: 'The Philosophy of Reduction',
    salutation: 'To our community,',
    paragraphs: [
      'When we founded shef&B, it was born out of a quiet frustration with the noise of contemporary design. We felt that too many objects and spaces were shouting for attention, leaving very little room for the human experience.',
      'Our approach has always been rooted in reduction. We ask not what we can add, but what we can strip away until the essential truth of an object or space is revealed. This is not minimalism for the sake of austerity; it is an active pursuit of clarity.',
      'We believe that the materials we surround ourselves with carry an energetic weight. A solid block of carved travertine, a hand-loomed raw silk throw, the patinated surface of aged bronze—these materials ground us. They connect us to the earth and to the slow passage of time.'
    ],
    image: getSlideById('slide13')
  },
  longFormEditorial: {
    title: 'Designing for Permanence',
    content: [
      {
        type: 'text',
        value: 'In an era defined by planned obsolescence, true luxury is permanence. It is the commitment to creating things that will outlast us. This requires an uncompromising dedication to craftsmanship and a deep respect for the inherent qualities of natural materials.'
      },
      {
        type: 'image',
        value: getSlideById('slide14')
      },
      {
        type: 'text',
        value: 'Every piece in our collection, every space we design, is an exploration of this idea. We look for the tension between fragility and mass, between the organic and the geometric. We want our work to feel both monumental and deeply intimate.'
      },
      {
        type: 'quote',
        value: 'We do not design for a season. We design for a lifetime.'
      }
    ]
  },
  signatureBlock: {
    name: orgData.founder.name,
    role: orgData.founder.role,
    bio: orgData.founder.bio,
    image: getSlideById('slide15')
  }
};
