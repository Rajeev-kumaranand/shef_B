/**
 * Footer Architecture for shef&B.
 * Organizes structured link categories, newsletter configurations, and dynamic copyright mechanisms.
 * Contains no fictional history, certifications, or locations.
 */
import { orgData } from './orgData.js';

export const footerData = {
  brandSignature: {
    logoText: 'shef&B',
    tagline: 'Atelier Foundation Structure'
  },

  getCopyrightYear: () => new Date().getFullYear(),
  copyrightText: `© ${new Date().getFullYear()} shef&B. All rights reserved.`,

  // Core link sections using simple placeholder pathways
  collections: [
    {
      title: 'Navigation',
      links: [
        { label: 'Methodology', path: '/discover/methodology' },
        { label: 'Sourcing Standards', path: '/discover/sourcing' }
      ]
    },
    {
      title: 'Offerings',
      links: [
        { label: 'Products', path: '/shop' },
        { label: 'Services', path: '/shop/services' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Articles', path: '/latest' },
        { label: 'Membership', path: '/community' }
      ]
    },
    {
      title: 'Legals',
      links: [
        { label: 'Privacy Policy', path: '/legal/privacy' },
        { label: 'Terms of Use', path: '/legal/terms' }
      ]
    }
  ],

  // Subscription placeholder copy block
  newsletter: {
    title: 'Newsletter',
    description: 'Subscribe for platform updates and harvest allocations.',
    placeholderText: 'Enter your email address',
    ctaText: 'Subscribe',
    complianceNote: 'All credentials are kept strictly confidential.'
  },

  // Minimal, client-derived metadata fields
  corporateRegistration: {
    entity: orgData.company.name,
    location: orgData.company.location,
    addressSummary: orgData.contact.address
  }
};
