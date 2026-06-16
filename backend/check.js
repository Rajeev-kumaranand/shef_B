import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
p.discoverContent.findFirst().then(console.log).finally(() => p.$disconnect());
