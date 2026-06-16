import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

Promise.all([
  p.shopContent.count(),
  p.contact.count(),
  p.company.count()
]).then(counts => {
  console.log("Shop:", counts[0]);
  console.log("Contact:", counts[1]);
  console.log("Company:", counts[2]);
}).finally(() => p.$disconnect());
