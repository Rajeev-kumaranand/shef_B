import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const INQUIRIES = [
  { name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '555-0101', subject: 'General Support', message: 'I need help with my recent order, the tracking link is broken.', status: 'NEW' },
  { name: 'Michael Chen', email: 'mchen.designs@example.com', phone: '555-0202', subject: 'Wholesale Inquiry', message: 'Hello, I run a boutique design firm in Seattle and we are interested in opening a wholesale account. Could you send over your catalog and pricing tiers?', status: 'NEW' },
  { name: 'Emma Watson', email: 'emma.w@example.com', subject: 'Product Question', message: 'Is the Minimalist Oak Dining Table treated with any VOC varnishes? We are looking for something completely non-toxic.', status: 'IN_PROGRESS', notes: 'Emailed Emma back confirming it is VOC-free. Waiting for her reply.' },
  { name: 'David Rivera', email: 'drivera@press.example.com', phone: '555-0303', subject: 'Media Inquiry', message: 'Hi there, I am a writer for Modern Living Magazine. We would love to feature shef&B in our upcoming issue on sustainable furniture.', status: 'IN_PROGRESS', notes: 'Forwarded to PR team.' },
  { name: 'Jessica Alba', email: 'jess.alba@example.com', subject: 'General Support', message: 'My coupon code is not working at checkout.', status: 'CLOSED', notes: 'Resolved. The coupon had expired, provided her with a new one.' },
  { name: 'Tom Hardy', email: 'tomh@example.com', phone: '555-0404', subject: 'Wholesale Inquiry', message: 'Interested in bulk ordering your ceramic dinnerware sets for our new restaurant.', status: 'NEW' },
  { name: 'Olivia Smith', email: 'osmith@example.com', subject: 'Product Question', message: 'When will the linen duvet covers be back in stock in King size?', status: 'CLOSED', notes: 'Told her they restock next week.' },
  { name: 'Liam Neeson', email: 'liam.n@example.com', phone: '555-0505', subject: 'Other', message: 'I lost my assembly instructions for the lounge chair.', status: 'CLOSED', notes: 'Emailed PDF.' },
  { name: 'Sophia Lee', email: 'sophia.l@example.com', subject: 'General Support', message: 'Can I change the shipping address on order #12345?', status: 'NEW' },
  { name: 'James Bond', email: 'james.b@mi6.gov', phone: '007-0070', subject: 'Media Inquiry', message: 'Would like to use your furniture for an upcoming film set.', status: 'IN_PROGRESS', notes: 'Waiting for budget approval from their side.' },
];

async function main() {
  console.log('Seeding Contact Inquiries...');

  let count = 0;
  for (const inquiry of INQUIRIES) {
    await prisma.contactInquiry.create({ data: inquiry });
    count++;
  }
  
  console.log(`Successfully created ${count} sample inquiries.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
