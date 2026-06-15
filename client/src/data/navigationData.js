/**
 * Navigation Architecture for shef&B.
 * Content-agnostic, developer-driven routing map using client-driven details.
 * Contains no generated marketing descriptions or fictional products.
 */
export const navigationData = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    exact: true
  },
  {
    id: 'shop',
    label: 'Shop',
    path: '/shop',
    layout: 'mega-menu',
    items: [
      {
        section: 'Products',
        links: [
          { label: 'Category A', path: '/shop/category-a' },
          { label: 'Category B', path: '/shop/category-b' }
        ]
      },
      {
        section: 'Services',
        links: [
          { label: 'Service A', path: '/shop/service-a' },
          { label: 'Service B', path: '/shop/service-b' }
        ]
      }
    ]
  },
  {
    id: 'discover',
    label: 'Discover',
    path: '/discover',
    layout: 'dropdown',
    items: [
      {
        links: [
          { label: 'Methodology', path: '/discover/methodology' },
          { label: 'Sourcing Standards', path: '/discover/sourcing' }
        ]
      }
    ]
  },
  {
    id: 'latest',
    label: 'The Latest',
    path: '/latest',
    layout: 'dropdown',
    items: [
      {
        links: [
          { label: 'Articles', path: '/latest/articles' },
          { label: 'Press Releases', path: '/latest/press' }
        ]
      }
    ]
  },
  {
    id: 'community',
    label: 'Our Community',
    path: '/community',
    layout: 'dropdown',
    items: [
      {
        links: [
          { label: 'Membership Programs', path: '/community/membership' },
          { label: 'Event Schedule', path: '/community/events' }
        ]
      }
    ]
  },
  {
    id: 'note',
    label: 'Note',
    path: '/note',
    exact: true
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    exact: true
  }
];
