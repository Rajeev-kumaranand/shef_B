import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Admin User (unchanged per requirements)
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@shefandb.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@shefandb.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('Admin user created');
  }

  // 2. Company Info (from orgData.js)
  const companyData = {
    name: 'shef&B',
    tagline: '',
    description: '',
    founder: 'Babar Mia',
    address: 'Mumbai, India',
    instagram: '',
    linkedin: '',
    youtube: '',
    pinterest: '',
  };
  
  const existingCompany = await prisma.company.findFirst();
  if (existingCompany) {
    await prisma.company.update({
      where: { id: existingCompany.id },
      data: companyData,
    });
  } else {
    await prisma.company.create({ data: companyData });
  }
  console.log('Company info seeded');

  // 3. Contact Info (from orgData.js)
  const contactData = {
    email: 'info@shefandb.com',
    phone: '',
    address: 'Mumbai, India',
  };

  const existingContact = await prisma.contact.findFirst();
  if (existingContact) {
    await prisma.contact.update({
      where: { id: existingContact.id },
      data: contactData,
    });
  } else {
    await prisma.contact.create({ data: contactData });
  }
  console.log('Contact info seeded');

  // 4. Navigation (from navigationData.js)
  const navData = [
    { label: 'Home', path: '/', order: 1 },
    { label: 'Shop', path: '/shop', order: 2 },
    { label: 'Discover', path: '/discover', order: 3 },
    { label: 'The Latest', path: '/latest', order: 4 },
    { label: 'Our Community', path: '/community', order: 5 },
    { label: 'Note', path: '/note', order: 6 },
    { label: 'Contact', path: '/contact', order: 7 },
  ];

  await prisma.navigation.deleteMany();
  for (const nav of navData) {
    await prisma.navigation.create({ data: nav });
  }
  console.log('Navigation seeded');

  // 5. Home Content (from homeData.js)
  const homeDataObj = {
    heroTitle: 'shef&B',
    heroTagline: 'An Atelier of Restorative Luxury and Botanical Wellness',
    storyTitle: 'An Oasis Crafted by Nature and Science',
    storyDescription: JSON.stringify({
      subtitle: 'Our Origin',
      paragraphs: [
        'In an era dominated by synthetic acceleration, shef&B was conceived as an architecture of deceleration. Rooted in the rich soil of botanical wisdom and elevated by clean scientific precision, we design wellness systems that restore equilibrium to the modern citizen.',
        'We curate raw, premium natural resources and refine them with clinical rigorousness. The result is a series of wellness formulations, experiences, and lifestyle methodologies designed for longevity, clarity, and absolute sensory elevation.'
      ]
    }),
    visionTitle: 'The Blueprint of Conscious Living',
    visionDescription: JSON.stringify({
      subtitle: 'The Vision',
      description: 'We believe that luxury is not defined by excess, but by deep alignment with natural rhythms. Our vision is to cultivate a global community that honors the relationship between soil, body, and consciousness, fostering wellness that is as sustainable as it is sophisticated.',
      stats: [
        { value: '100%', label: 'Traceable Botanicals' },
        { value: 'Zero', label: 'Synthetic Additives' },
        { value: 'Science', label: 'Backed Formulations' }
      ]
    }),
    founderTitle: 'Leadership in Harmony',
    founderDescription: JSON.stringify({
      subtitle: 'The Architects',
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
    }),
    experienceTitle: 'Curated Wellness Vectors',
    experienceDescription: JSON.stringify({
      subtitle: 'The Sanctuary',
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
    })
  };

  const existingHome = await prisma.homeContent.findFirst();
  if (existingHome) {
    await prisma.homeContent.update({
      where: { id: existingHome.id },
      data: homeDataObj,
    });
  } else {
    await prisma.homeContent.create({ data: homeDataObj });
  }
  console.log('Home content seeded');
  
  // 6. Discover Content
  const discoverDataObj = {
    heroTitle: 'A New Paradigm of Living',
    heroSubtitle: 'The Methodology',
    heroDescription: 'We believe that space is not merely physical, but emotional. Every curve, every texture, every shadow is an invitation to experience life with greater depth and clarity.',
    heroImage: 'slide1',
    philosophyHeading: 'The Atelier',
    philosophyParagraphs: JSON.stringify([
      'Founded on the principles of quiet luxury and architectural restraint, shef&B emerged as a response to the chaotic overdesign of the modern era.',
      'Our approach is reductionist yet warm, favoring materials that age gracefully and forms that respect the human scale. We craft environments that serve as sanctuaries.'
    ]),
    craftsmanshipTitle: 'The Art of Making',
    craftsmanshipItems: JSON.stringify([
      { id: '01', title: 'Tactile Materiality', description: 'Sourcing organic, unrefined materials that tell a story of their origin.' },
      { id: '02', title: 'Spatial Harmony', description: 'Balancing negative space with functional elements to create visual silence.' },
      { id: '03', title: 'Timeless Form', description: 'Avoiding transient trends in favor of classical proportions and enduring silhouettes.' }
    ]),
    craftsmanshipImage: 'slide2',
    valuesTitle: 'Core Values',
    valuesCards: JSON.stringify([
      { id: 1, title: 'Authenticity', image: 'slide4' },
      { id: 2, title: 'Restraint', image: 'slide5' },
      { id: 3, title: 'Permanence', image: 'slide6' },
      { id: 4, title: 'Proportion', image: 'slide7' }
    ]),
    galleryTitle: 'Visual Identity',
    galleryImages: JSON.stringify(['slide8', 'slide9', 'slide10']),
    ctaTitle: 'Become part of the narrative.',
    ctaButtonText: 'Explore Membership',
    ctaLink: '/community'
  };

  const existingDiscover = await prisma.discoverContent.findFirst();
  if (existingDiscover) {
    await prisma.discoverContent.update({ where: { id: existingDiscover.id }, data: discoverDataObj });
  } else {
    await prisma.discoverContent.create({ data: discoverDataObj });
  }
  console.log('Discover content seeded');

  // 7. Shop Content
  const shopDataObj = {
    heroTitle: 'The Essentials',
    heroSubtitle: 'Volume I',
    heroDescription: 'A curated selection of elemental forms, designed to anchor any space with quiet authority.',
    heroImage: '	http://localhost:5000/uploads/media/dummy_image4.jpeg',
    featuredTitle: 'Featured Objects',
    featuredItems: JSON.stringify([
      { id: 'p1', name: 'The Lounge Chair', category: 'furniture', price: '$4,200', description: 'Sculptural silhouette wrapped in tactile boucle.', image: '/uploads/media/dummy_image1.avif', hoverImage: 'slide12' },
      { id: 'p2', name: 'Marble Plinth', category: 'objects', price: '$1,800', description: 'Solid Calacatta Viola marble, hand-honed.', image: '/uploads/media/dummy_image1.avif' }
    ]),
    products: JSON.stringify([
      { id: 'p3', name: 'Linen ThrowWWWWW---', category: 'textiles', price: '$450', description: 'Heavyweight Belgian linen with frayed edges.', image: '/uploads/media/dummy_image1.avif' },
      { id: 'p4', name: 'Abstract Canvas', category: 'art', price: '$3,500', description: 'Mixed media on raw canvas, unique piece.', image: '/uploads/media/dummy_image1.avif' },
      { id: 'p5', name: 'Dining Table', category: 'furniture', price: '$8,500', description: 'Solid smoked oak with monumental proportions.', image: 'slide16' },
      { id: 'p6', name: 'Ceramic Vessel', category: 'objects', price: '$650', description: 'Wheel-thrown stoneware with reactive glaze.', image: 'slide17' },
      { id: 'p7', name: 'Woven Rug', category: 'textiles', price: '$2,100', description: 'Hand-knotted wool and silk blend.', image: 'slide18' },
      { id: 'p8', name: 'Bronze Sculpture', category: 'art', price: '$5,200', description: 'Cast bronze with black patina.', image: 'slide19' }
    ]),
    storyTitle: 'The Philosophy of Objects',
    storyParagraphs: JSON.stringify([
      'We do not believe in decoration. We believe in objects that possess enough gravity to alter the atmosphere of a room.',
      'Every piece in our collection is born from a dialogue between material and maker. We let the inherent qualities of stone, wood, and raw fiber dictate the final form.'
    ]),
    ctaTitle: 'Bespoke Inquiries',
    ctaDescription: 'Many of our pieces can be tailored to specific spatial requirements.',
    ctaButtonText: 'Contact the Studio',
    ctaLink: '/contact'
  };

  const existingShop = await prisma.shopContent.findFirst();
  if (existingShop) {
    await prisma.shopContent.update({ where: { id: existingShop.id }, data: shopDataObj });
  } else {
    await prisma.shopContent.create({ data: shopDataObj });
  }
  console.log('Shop content seeded');

  // 8. Latest Content
  const latestDataObj = {
    heroTitle: 'The Latest',
    heroSubtitle: 'Journal & Editorials',
    heroDescription: 'A curated dialogue on art, architecture, and the pursuit of quiet luxury.',
    featuredArticle: JSON.stringify({
      id: 'f1', category: 'Architecture', date: 'October 12, 2026', title: 'The Monolith: A Study in Brutalist Warmth', excerpt: 'Exploring the intersection of heavy concrete forms and the tactile softness of natural textiles inside our latest sanctuary project in the Swiss Alps.', image: 'slide23-1', link: '/note'
    }),
    articles: JSON.stringify([
      { id: 'a1', category: 'Design', date: 'September 28, 2026', title: 'Tactile Materiality in the Digital Age', excerpt: 'Why physical textures matter more than ever in spaces designed for digital detox.', image: 'slide23-2', link: '/note' },
      { id: 'a2', category: 'Sourcing', date: 'September 15, 2026', title: 'The Search for Perfect Calacatta Viola', excerpt: 'A photographic journey through the Apuan Alps to find the most expressive veining for our new collection.', image: 'slide23-3', link: '/note' },
      { id: 'a3', category: 'Interview', date: 'August 30, 2026', title: 'In Conversation with Studio X', excerpt: 'Discussing the philosophy of reductionism and the enduring appeal of shadow play.', image: 'slide24-1', link: '/note' },
      { id: 'a4', category: 'Exhibition', date: 'August 10, 2026', title: 'Salone del Mobile Retrospective', excerpt: 'A curated look at the forms that defined this year’s international design fair in Milan.', image: 'slide24-2', link: '/note' },
      { id: 'a5', category: 'Lifestyle', date: 'July 22, 2026', title: 'The Art of the Slow Morning', excerpt: 'Curating spaces that encourage reflection and presence at the start of the day.', image: 'slide24-3', link: '/note' }
    ]),
    highlightsTitle: 'Editorial Highlights',
    highlightsTopics: JSON.stringify(['Architecture', 'Interviews', 'Sourcing', 'Design Theory']),
    newsletterTitle: 'The Digest',
    newsletterDescription: 'A monthly curation of our latest writings and allocations, delivered quietly to your inbox.',
    newsletterCta: 'Subscribe'
  };

  const existingLatest = await prisma.latestContent.findFirst();
  if (existingLatest) {
    await prisma.latestContent.update({ where: { id: existingLatest.id }, data: latestDataObj });
  } else {
    await prisma.latestContent.create({ data: latestDataObj });
  }
  console.log('Latest content seeded');

  // 9. Community Content
  const communityDataObj = {
    heroTitle: 'Community',
    heroSubtitle: 'The Vanguard',
    heroDescription: 'A global network of architects, designers, and patrons who share our commitment to uncompromising craftsmanship and quiet luxury.',
    heroImage: 'slide7',
    storiesTitle: 'Profiles in Design',
    stories: JSON.stringify([
      { id: 's1', name: 'Elena Rossi', role: 'Interior Architect, Milan', quote: 'The pieces anchor my spaces. They speak softly but carry immense weight.', image: 'slide8' },
      { id: 's2', name: 'David Chen', role: 'Collector, New York', quote: 'I surround myself with objects that ask for my attention not through noise, but through presence.', image: 'slide9' }
    ]),
    testimonialsTitle: 'Perspectives',
    testimonials: JSON.stringify([
      { quote: 'Their understanding of material honesty has fundamentally shifted how I approach my own residential projects.', author: 'Sarah Jenkins', role: 'Architect' },
      { quote: 'A rare dedication to the slow, deliberate art of making things well.', author: 'Marcus V.', role: 'Designer' },
      { quote: 'The spatial harmony achieved in their showrooms is something I try to replicate in my own life.', author: 'A. H.', role: 'Patron' },
      { quote: 'Every piece feels inevitable. Like it was always meant to exist exactly as it does.', author: 'Elena R.', role: 'Curator' },
      { quote: 'Unapologetically austere, yet deeply human and warm.', author: 'Thomas K.', role: 'Editor' },
      { quote: 'A masterclass in restraint and the power of negative space.', author: 'Julia M.', role: 'Creative Director' }
    ]),
    experiencesTitle: 'Upcoming Gathers',
    experiences: JSON.stringify([
      { title: 'Material Exploration Walk', date: 'November 12, 2026', location: 'Carrara, Italy' },
      { title: 'Private Studio Viewing', date: 'December 05, 2026', location: 'Mumbai, India' }
    ]),
    galleryTitle: 'The Archive',
    galleryImages: JSON.stringify(['slide1', 'slide2', 'slide3', 'slide4', 'slide5', 'slide6']),
    ctaTitle: 'Join the Vanguard',
    ctaDescription: 'Submit your portfolio or collection history for consideration.',
    ctaButtonText: 'Apply for Membership'
  };

  const existingCommunity = await prisma.communityContent.findFirst();
  if (existingCommunity) {
    await prisma.communityContent.update({ where: { id: existingCommunity.id }, data: communityDataObj });
  } else {
    await prisma.communityContent.create({ data: communityDataObj });
  }
  console.log('Community content seeded');

  // 10. Note Content
  const noteDataObj = {
    heroTitle: 'A Note',
    heroSubtitle: 'From the Founders',
    heroDescription: 'Reflections on the intersection of space, light, and living.',
    heroImage: 'slide12',
    letterTitle: 'The Philosophy of Reduction',
    letterSalutation: 'To our community,',
    letterParagraphs: JSON.stringify([
      'When we founded shef&B, it was born out of a quiet frustration with the noise of contemporary design. We felt that too many objects and spaces were shouting for attention, leaving very little room for the human experience.',
      'Our approach has always been rooted in reduction. We ask not what we can add, but what we can strip away until the essential truth of an object or space is revealed. This is not minimalism for the sake of austerity; it is an active pursuit of clarity.',
      'We believe that the materials we surround ourselves with carry an energetic weight. A solid block of carved travertine, a hand-loomed raw silk throw, the patinated surface of aged bronze—these materials ground us. They connect us to the earth and to the slow passage of time.'
    ]),
    letterImage: 'slide13',
    editorialTitle: 'Designing for Permanence',
    editorialContent: JSON.stringify([
      { type: 'text', value: 'In an era defined by planned obsolescence, true luxury is permanence. It is the commitment to creating things that will outlast us. This requires an uncompromising dedication to craftsmanship and a deep respect for the inherent qualities of natural materials.' },
      { type: 'image', value: 'slide14' },
      { type: 'text', value: 'Every piece in our collection, every space we design, is an exploration of this idea. We look for the tension between fragility and mass, between the organic and the geometric. We want our work to feel both monumental and deeply intimate.' },
      { type: 'quote', value: 'We do not design for a season. We design for a lifetime.' }
    ]),
    signatureName: 'Babar Mia',
    signatureRole: 'Founder',
    signatureBio: '',
    signatureImage: 'slide15'
  };

  const existingNote = await prisma.noteContent.findFirst();
  if (existingNote) {
    await prisma.noteContent.update({ where: { id: existingNote.id }, data: noteDataObj });
  } else {
    await prisma.noteContent.create({ data: noteDataObj });
  }
  console.log('Note content seeded');

  // 11. Products (Commerce System)
  const productData = [
    { name: 'The Lounge Chair', slug: 'the-lounge-chair', category: 'furniture', price: 4200.00, shortDesc: 'Sculptural silhouette wrapped in tactile boucle.', description: 'A monumental piece of seating architecture designed to anchor the most demanding spaces.', image: '/uploads/media/dummy_image3.jpg', featured: true, active: true },
    { name: 'Marble Plinth', slug: 'marble-plinth', category: 'objects', price: 1800.00, shortDesc: 'Solid Calacatta Viola marble, hand-honed.', description: 'Extracted from the Apuan Alps, this solid plinth serves as a silent foundation for art or as a standalone sculptural element.', image: '/uploads/media/dummy_image4.jpeg', featured: true, active: true },
    { name: 'Linen ThrowWWWWW---', slug: 'linen-throw', category: 'textiles', price: 450.00, shortDesc: 'Heavyweight Belgian linen with frayed edges.', description: 'Woven from raw flax, this heavyweight throw offers incredible drape and tactile warmth.', image: '/uploads/media/dummy_image2.jpg', featured: false, active: true },
    { name: 'Abstract Canvas', slug: 'abstract-canvas', category: 'art', price: 3500.00, shortDesc: 'Mixed media on raw canvas, unique piece.', description: 'An exploration of shadow and structure, using natural pigments on unbleached linen canvas.', image: '/uploads/media/dummy_image1.avif', featured: false, active: true },
    { name: 'Dining Table', slug: 'dining-table', category: 'furniture', price: 8500.00, shortDesc: 'Solid smoked oak with monumental proportions.', description: 'Crafted using traditional joinery, this table celebrates the inherent weight and brutalist beauty of solid European oak.', image: '/uploads/media/dummy_image2.jpg', featured: false, active: true },
    { name: 'Ceramic Vessel', slug: 'ceramic-vessel', category: 'objects', price: 650.00, shortDesc: 'Wheel-thrown stoneware with reactive glaze.', description: 'Fired at extreme temperatures, this vessel features a volcanic glaze that ensures no two pieces are identical.', image: '/uploads/media/dummy_image3.jpg', featured: false, active: true },
    { name: 'Woven Rug', slug: 'woven-rug', category: 'textiles', price: 2100.00, shortDesc: 'Hand-knotted wool and silk blend.', description: 'A dense, low-pile rug that brings incredible acoustic dampening and physical warmth to minimalist spaces.', image: '/uploads/media/dummy_image4.jpeg', featured: false, active: true },
    { name: 'Bronze Sculpture', slug: 'bronze-sculpture', category: 'art', price: 5200.00, shortDesc: 'Cast bronze with black patina.', description: 'A heavy, cold-cast piece that captures the tension between fluid movement and absolute stillness.', image: '/uploads/media/dummy_image2.jpg', featured: false, active: true },
  ];

  await prisma.product.deleteMany();
  for (const prod of productData) {
    await prisma.product.create({ data: prod });
  }
  console.log('Products seeded');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
