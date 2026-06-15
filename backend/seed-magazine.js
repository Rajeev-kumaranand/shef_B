import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const AUTHORS = [
  { name: 'Elena Rossi', designation: 'Culinary Director', bio: 'Former Michelin-starred chef turned culinary historian.', image: '/assets/images/authors/elena.jpg' },
  { name: 'James Carter', designation: 'Interior Architect', bio: 'Specializes in minimalist spaces and organic textures.', image: '/assets/images/authors/james.jpg' },
  { name: 'Sarah Lin', designation: 'Design Critic', bio: 'Writing on the intersection of modern art and functional design.', image: '/assets/images/authors/sarah.jpg' },
  { name: 'Michael Obbens', designation: 'Master Craftsman', bio: '30 years experience in traditional woodworking.', image: '/assets/images/authors/michael.jpg' },
  { name: 'Anna Kova', designation: 'Lifestyle Editor', bio: 'Curating the finest in home goods and slow living.', image: '/assets/images/authors/anna.jpg' },
];

const CATEGORIES = [
  { name: 'Culinary Arts', slug: 'culinary-arts', description: 'Exploring flavors, techniques, and the culture of food.' },
  { name: 'Interior Design', slug: 'interior-design', description: 'Spaces that inspire and elevate everyday living.' },
  { name: 'Heritage Craft', slug: 'heritage-craft', description: 'Honoring traditional methods and artisanal makers.' },
  { name: 'Modern Living', slug: 'modern-living', description: 'Contemporary approaches to lifestyle and home.' },
  { name: 'Entertaining', slug: 'entertaining', description: 'The art of hosting and gathering.' },
  { name: 'Travel & Culture', slug: 'travel-culture', description: 'Global inspirations for the home.' },
  { name: 'Architecture', slug: 'architecture', description: 'Form, function, and the built environment.' },
  { name: 'Textiles', slug: 'textiles', description: 'Fabrics, weaves, and tactile experiences.' },
  { name: 'Sustainability', slug: 'sustainability', description: 'Eco-conscious design and mindful consumption.' },
  { name: 'Interviews', slug: 'interviews', description: 'Conversations with makers and visionaries.' },
];

const TAGS = [
  'Minimalism', 'Ceramics', 'Woodworking', 'Recipes', 'Lighting', 'Furniture', 'Slow Living', 'Vintage', 'Art', 'Decor'
];

async function main() {
  console.log('Seeding Magazine data...');

  // Create Authors
  const dbAuthors = [];
  for (const a of AUTHORS) {
    dbAuthors.push(await prisma.author.create({ data: a }));
  }
  console.log(`Created ${dbAuthors.length} authors.`);

  // Create Categories
  const dbCategories = [];
  for (const c of CATEGORIES) {
    dbCategories.push(await prisma.category.create({ data: c }));
  }
  console.log(`Created ${dbCategories.length} categories.`);

  // Create Tags
  const dbTags = [];
  for (const t of TAGS) {
    const slug = t.toLowerCase().replace(/ /g, '-');
    dbTags.push(await prisma.tag.create({ data: { name: t, slug } }));
  }
  console.log(`Created ${dbTags.length} tags.`);

  // Create Articles
  const articlesCount = 25;
  for (let i = 1; i <= articlesCount; i++) {
    const author = dbAuthors[Math.floor(Math.random() * dbAuthors.length)];
    const category = dbCategories[Math.floor(Math.random() * dbCategories.length)];
    
    // Pick 2-4 random tags
    const numTags = Math.floor(Math.random() * 3) + 2;
    const shuffledTags = [...dbTags].sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, numTags);

    const title = `The Art of ${category.name}: Volume ${i}`;
    const slug = `the-art-of-${category.slug}-volume-${i}`;
    const excerpt = `Discover the intricate details and hidden stories behind ${category.name.toLowerCase()} in our latest editorial exploration.`;
    
    const content = `
      <h2>The Foundation of Good Design</h2>
      <p>In the realm of <strong>${category.name}</strong>, true mastery comes not just from understanding the rules, but knowing precisely when and how to break them. Our journey into this topic reveals a landscape rich with innovation and grounded in deep, historical roots.</p>
      <p>Consider the interplay of light and shadow, the tactile quality of raw materials, and the profound impact of intentionality in every creative decision. It is here that we find the essence of what makes our living spaces truly resonate with our inner selves.</p>
      <blockquote>"Design is not just what it looks like and feels like. Design is how it works."</blockquote>
      <h3>Key Takeaways</h3>
      <ul>
        <li>Embrace imperfection as a mark of authenticity.</li>
        <li>Prioritize sustainably sourced materials whenever possible.</li>
        <li>Allow spaces to breathe—negative space is as important as the objects themselves.</li>
      </ul>
      <p>As we continue to explore the nuances of ${category.name}, we invite you to reflect on your own relationship with your environment. How do the objects you choose to surround yourself with shape your daily experience?</p>
    `;

    await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random date in past
        authorId: author.id,
        categoryId: category.id,
        readTime: 4,
        views: Math.floor(Math.random() * 1500),
        tags: {
          create: selectedTags.map(t => ({
            tag: { connect: { id: t.id } }
          }))
        }
      }
    });
  }
  console.log(`Created ${articlesCount} articles.`);
  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
