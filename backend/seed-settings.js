import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Website Settings...');

  let settings = await prisma.websiteSettings.findFirst();

  if (!settings) {
    settings = await prisma.websiteSettings.create({
      data: {
        siteName: 'shef&B',
        siteTagline: 'Elegant Home Goods',
        footerCopyrightText: '© 2026 shef&B. All rights reserved.',
        contactEmail: 'hello@shefandb.com',
        contactPhone: '+1 (555) 123-4567',
        contactWhatsapp: '+15551234567',
        contactAddress: '123 Design District, New York, NY 10012',
        socialInstagram: 'https://instagram.com/shefandb',
        socialPinterest: 'https://pinterest.com/shefandb',
        codEnabled: true,
        onlinePaymentEnabled: false,
        flatShippingCost: 15.00,
        freeShippingThreshold: 150.00,
        taxPercentage: 8.5,
        announcementEnabled: true,
        announcementText: 'Complimentary shipping on all orders over $150.',
        announcementCtaText: 'Shop Now',
        announcementCtaLink: '/shop'
      }
    });
    console.log('Default Website Settings created successfully.');
  } else {
    console.log('Website Settings already exist.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
