import { PrismaClient } from '@prisma/client';
import { latestData } from '../client/src/data/latestData.js';
import { discoverData } from '../client/src/data/discoverData.js';
import { communityData } from '../client/src/data/communityData.js';
import { noteData } from '../client/src/data/noteData.js';
import { orgData } from '../client/src/data/orgData.js';
import { homeData } from '../client/src/data/homeData.js';
import { shopData } from '../client/src/data/shopData.js';

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting CMS Content Seeding...');
  
  try {
    // 1. Latest Content
    const latestCount = await prisma.latestContent.count();
    if (latestCount === 0) {
      await prisma.latestContent.create({
        data: {
          heroTitle: latestData.hero.title,
          heroSubtitle: latestData.hero.subtitle,
          heroDescription: latestData.hero.description,
          featuredArticle: JSON.stringify(latestData.featuredArticle),
          articles: JSON.stringify(latestData.articles),
          highlightsTitle: latestData.highlights.title,
          highlightsTopics: JSON.stringify(latestData.highlights.topics),
          newsletterTitle: latestData.newsletter.title,
          newsletterDescription: latestData.newsletter.description,
          newsletterCta: latestData.newsletter.cta
        }
      });
      console.log('Seeded LatestContent.');
    }

    // 2. Discover Content
    const discoverCount = await prisma.discoverContent.count();
    if (discoverCount === 0) {
      await prisma.discoverContent.create({
        data: {
          heroTitle: discoverData.hero.title,
          heroSubtitle: discoverData.hero.subtitle,
          heroDescription: discoverData.hero.description,
          heroImage: discoverData.hero.image?.url,
          philosophyHeading: discoverData.philosophy.heading,
          philosophyParagraphs: JSON.stringify(discoverData.philosophy.paragraphs),
          craftsmanshipTitle: discoverData.craftsmanship.title,
          craftsmanshipItems: JSON.stringify(discoverData.craftsmanship.items),
          craftsmanshipImage: discoverData.craftsmanship.image?.url,
          valuesTitle: discoverData.values.title,
          valuesCards: JSON.stringify(discoverData.values.cards),
          galleryTitle: discoverData.gallery.title,
          galleryImages: JSON.stringify(discoverData.gallery.images),
          ctaTitle: discoverData.cta.title,
          ctaButtonText: discoverData.cta.buttonText,
          ctaLink: discoverData.cta.link
        }
      });
      console.log('Seeded DiscoverContent.');
    }

    // 3. Community Content
    const communityCount = await prisma.communityContent.count();
    if (communityCount === 0) {
      await prisma.communityContent.create({
        data: {
          heroTitle: communityData.hero.title,
          heroSubtitle: communityData.hero.subtitle,
          heroDescription: communityData.hero.description,
          heroImage: communityData.hero.image?.url,
          storiesTitle: communityData.stories.title,
          stories: JSON.stringify(communityData.stories.items),
          testimonialsTitle: communityData.testimonials.title,
          testimonials: JSON.stringify(communityData.testimonials.items),
          experiencesTitle: communityData.experiences.title,
          experiences: JSON.stringify(communityData.experiences.items),
          galleryTitle: communityData.gallery.title,
          galleryImages: JSON.stringify(communityData.gallery.images),
          ctaTitle: communityData.cta.title,
          ctaDescription: communityData.cta.description,
          ctaButtonText: communityData.cta.buttonText
        }
      });
      console.log('Seeded CommunityContent.');
    }

    // 4. Note Content
    const noteCount = await prisma.noteContent.count();
    if (noteCount === 0) {
      await prisma.noteContent.create({
        data: {
          heroTitle: noteData.hero.title,
          heroSubtitle: noteData.hero.subtitle,
          heroDescription: noteData.hero.description,
          heroImage: noteData.hero.image?.url,
          letterTitle: noteData.letter.title,
          letterSalutation: noteData.letter.salutation,
          letterParagraphs: JSON.stringify(noteData.letter.paragraphs),
          letterImage: noteData.letter.image?.url,
          editorialTitle: noteData.editorial.title,
          editorialContent: JSON.stringify(noteData.editorial.content),
          signatureName: noteData.signature.name,
          signatureRole: noteData.signature.role,
          signatureBio: noteData.signature.bio,
          signatureImage: noteData.signature.image?.url
        }
      });
      console.log('Seeded NoteContent.');
    }

    // 5. Contact
    const contactCount = await prisma.contact.count();
    if (contactCount === 0) {
      await prisma.contact.create({
        data: {
          email: orgData.contact.email,
          phone: orgData.contact.phone,
          address: orgData.contact.address
        }
      });
      console.log('Seeded Contact.');
    }

    // 6. Company
    const companyCount = await prisma.company.count();
    if (companyCount === 0) {
      await prisma.company.create({
        data: {
          name: orgData.company.name,
          tagline: orgData.company.tagline,
          description: orgData.company.description,
          founder: orgData.company.founderName,
          address: orgData.company.location,
          instagram: orgData.company.instagram,
          linkedin: orgData.company.linkedin,
          youtube: orgData.company.youtube,
          pinterest: orgData.company.pinterest
        }
      });
      console.log('Seeded Company.');
    }

    // 7. Home Content
    const homeCount = await prisma.homeContent.count();
    if (homeCount === 0) {
      await prisma.homeContent.create({
        data: {
          heroTitle: homeData.hero.title,
          heroTagline: homeData.hero.tagline,
          storyTitle: homeData.story.title,
          storyDescription: JSON.stringify({ paragraphs: homeData.story.paragraphs }),
          visionTitle: homeData.vision.title,
          visionDescription: JSON.stringify({ description: homeData.vision.description, stats: homeData.vision.stats }),
          founderTitle: homeData.founder.title,
          founderDescription: JSON.stringify({ members: homeData.founder.members }),
          experienceTitle: homeData.experience.title,
          experienceDescription: JSON.stringify({ items: homeData.experience.items })
        }
      });
      console.log('Seeded HomeContent.');
    }

    // 8. Shop Content
    const shopCount = await prisma.shopContent.count();
    if (shopCount === 0) {
      await prisma.shopContent.create({
        data: {
          heroTitle: shopData.hero.title,
          heroSubtitle: shopData.hero.subtitle,
          heroDescription: shopData.hero.description,
          heroImage: shopData.hero.image?.url,
          featuredTitle: shopData.featured.title,
          featuredItems: JSON.stringify(shopData.featured.items),
          products: JSON.stringify(shopData.products),
          storyTitle: shopData.story.title,
          storyParagraphs: JSON.stringify(shopData.story.paragraphs),
          ctaTitle: shopData.cta.title,
          ctaDescription: shopData.cta.description,
          ctaButtonText: shopData.cta.buttonText,
          ctaLink: shopData.cta.link
        }
      });
      console.log('Seeded ShopContent.');
    }

    console.log('CMS Content Seeding completed successfully.');

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
