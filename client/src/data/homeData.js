/**
 * homeData.js
 * Editorial content, copywriting, structure, and dynamic slide mappings for the shef&B home page.
 * Strictly maps slide IDs rather than raw file paths.
 */
export const homeData = {
  hero: {
    title: 'shef&B',
    tagline: 'An Atelier of Restorative Luxury and Botanical Wellness',
    slides: ['slide1', 'slide2', 'slide3', 'slide4', 'slide5'],
    scrollText: 'Scroll to explore'
  },
  story: {
    subtitle: 'Our Origin',
    title: 'An Oasis Crafted by Nature and Science',
    paragraphs: [
      'In an era dominated by synthetic acceleration, shef&B was conceived as an architecture of deceleration. Rooted in the rich soil of botanical wisdom and elevated by clean scientific precision, we design wellness systems that restore equilibrium to the modern citizen.',
      'We curate raw, premium natural resources and refine them with clinical rigorousness. The result is a series of wellness formulations, experiences, and lifestyle methodologies designed for longevity, clarity, and absolute sensory elevation.'
    ]
  },
  vision: {
    subtitle: 'The Vision',
    title: 'The Blueprint of Conscious Living',
    description: 'We believe that luxury is not defined by excess, but by deep alignment with natural rhythms. Our vision is to cultivate a global community that honors the relationship between soil, body, and consciousness, fostering wellness that is as sustainable as it is sophisticated.',
    slideId: 'slide8',
    stats: [
      { value: '100%', label: 'Traceable Botanicals' },
      { value: 'Zero', label: 'Synthetic Additives' },
      { value: 'Science', label: 'Backed Formulations' }
    ]
  },
  founder: {
    subtitle: 'The Architects',
    title: 'Leadership in Harmony',
    members: [
      {
        name: 'Babar Mia',
        role: 'Founder & Visionary',
        quote: 'Luxury is the ultimate expression of simplicity, authenticity, and natural integrity.',
        bio: 'Babar Mia established shef&B with the singular vision of creating a modern luxury wellness sanctuary. His philosophy centers on preserving ancestral botanical methods while integrating them seamlessly into premium editorial lifestyles.',
        slideId: 'slide10'
      },
      {
        name: 'Dr. Shashank Kharabanda',
        role: 'Chief Product Officer',
        quote: 'Scientific validation is the bridge that turns raw botanical potential into restorative reality.',
        bio: 'Dr. Kharabanda guides shef&B’s scientific research and formulation pipeline. Combining clinical dermatology with bio-organic chemistry, he ensures every formulation meets the highest standards of safety, efficacy, and cellular compatibility.',
        slideId: 'slide11'
      }
    ]
  },
  experience: {
    subtitle: 'The Sanctuary',
    title: 'Curated Wellness Vectors',
    items: [
      {
        id: 'experience-1',
        title: 'Botanical Apothecary',
        description: 'Pure, bioactive concentrates sourced from certified high-altitude gardens and refined for metabolic harmony.',
        slideId: 'slide12'
      },
      {
        id: 'experience-2',
        title: 'Somatic Retreatment',
        description: 'Immersive spaces designed to reset the nervous system through sensory alignment and thermal therapy.',
        slideId: 'slide13'
      },
      {
        id: 'experience-3',
        title: 'Longevity Consulting',
        description: 'Personalized wellness diagnostics guiding nutritional alchemy, restorative sleep, and cellular health.',
        slideId: 'slide14'
      }
    ]
  },
  gallery: {
    subtitle: 'The Aesthetic',
    title: 'Visual Dialogues',
    items: [
      { id: 'gallery-1', slideId: 'slide15', size: 'portrait', title: 'Restorative Stillness' },
      { id: 'gallery-2', slideId: 'slide16', size: 'landscape', title: 'Elemental Sourcing' },
      { id: 'gallery-3', slideId: 'slide17', size: 'portrait', title: 'The Laboratory' },
      { id: 'gallery-4', slideId: 'slide18', size: 'square', title: 'Architectural Sanctum' },
      { id: 'gallery-5', slideId: 'slide19', size: 'portrait', title: 'Botanical Alchemy' }
    ]
  },
  journey: {
    subtitle: 'The Journey',
    title: 'Milestones of Integrity',
    steps: [
      {
        year: '2023',
        title: 'The Foundation',
        description: 'Established research collaborations with legacy organic farms in high-altitude regions to secure raw material sovereignty.'
      },
      {
        year: '2024',
        title: 'Scientific Cohesion',
        description: 'Inaugurated our dedicated analytical lab under the supervision of Dr. Shashank Kharabanda to validate bio-availability.'
      },
      {
        year: '2025',
        title: 'Somatic Prototypes',
        description: 'Launched our private membership retreat trials in Mumbai, refining sensory environments for physical rest.'
      },
      {
        year: '2026',
        title: 'Global Cohort',
        description: 'Expanding shef&B platform integrations to distribute clean wellness access and architectural methodologies worldwide.'
      }
    ]
  },
  contact: {
    subtitle: 'Inquiries',
    title: 'Begin Your Alignment',
    description: 'We welcome connections with individuals, architects, and institutions seeking to integrate restorative wellness.',
    fields: {
      name: 'Your Name',
      email: 'Email Address',
      interest: 'Area of Interest',
      message: 'Your Message'
    },
    interests: [
      'Private Wellness Membership',
      'Botanical Product Allocations',
      'Somatic Retreat Inquiries',
      'Press & Editorial Collaboration'
    ]
  }
};
