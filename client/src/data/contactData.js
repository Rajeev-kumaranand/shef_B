import { orgData } from './orgData.js';
import { getSlideById } from './slidesData.js';

export const contactData = {
  hero: {
    title: 'Connect',
    subtitle: 'Begin a Dialogue',
    description: 'Whether you are inquiring about a specific piece, discussing a bespoke commission, or exploring our architectural services, we welcome the conversation.',
    image: getSlideById('slide21')
  },
  contactInfo: {
    title: 'The Atelier',
    details: [
      {
        label: 'Location',
        value: orgData.contact.address || 'Mumbai, India',
        link: null
      },
      {
        label: 'Inquiries',
        value: orgData.contact.email || 'inquiries@shefandb.com',
        link: `mailto:${orgData.contact.email || 'inquiries@shefandb.com'}`
      },
      {
        label: 'Direct',
        value: orgData.contact.phone || '+91 98765 43210',
        link: orgData.contact.phone ? `tel:${orgData.contact.phone}` : null
      }
    ]
  },
  socials: {
    title: 'Digital Presences',
    platforms: Object.entries(orgData.socials).map(([key, value]) => ({
      name: key,
      url: value.url || '#'
    }))
  },
  form: {
    title: 'Inquire',
    fields: [
      { name: 'name', type: 'text', label: 'Full Name', required: true },
      { name: 'email', type: 'email', label: 'Email Address', required: true },
      { name: 'subject', type: 'select', label: 'Subject of Inquiry', options: ['General Inquiry', 'Bespoke Commission', 'Interior Architecture', 'Press & Media'], required: true },
      { name: 'message', type: 'textarea', label: 'Message', required: true }
    ],
    submitText: 'Send Message'
  },
  map: {
    title: 'Our Location',
    placeholderImage: getSlideById('slide22')
  }
};
