import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const categories = [
    { name: 'Design', slug: 'design' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Interiors', slug: 'interiors' },
    { name: 'Interviews', slug: 'interviews' },
    { name: 'Art', slug: 'art' },
    { name: 'Travel', slug: 'travel' }
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
  }
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
