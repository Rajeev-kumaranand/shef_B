import { useState, useEffect } from 'react';
import {
  getPublicHome,
  getPublicCompany,
  getPublicContact,
  getPublicNavigation,
  getPublicSlides,
  getPublicLatest,
  getPublicDiscover,
  getPublicCommunity,
  getPublicNote
} from '../services/api/publicApi.js';
import { parseJsonField } from '../utils/contentParser.js';

import { homeData } from '../data/homeData.js';
import { orgData } from '../data/orgData.js';
import { navigationData } from '../data/navigationData.js';
import { slidesData } from '../data/slidesData.js';
import { latestData } from '../data/latestData.js';
import { discoverData } from '../data/discoverData.js';
import { communityData } from '../data/communityData.js';
import { noteData } from '../data/noteData.js';

const normalizeStringArray = (arr) => {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => {
    if (item && typeof item === 'object') {
      if (item.value !== undefined) return item.value;
      if (item.title !== undefined) return item.title;
    }
    return item;
  });
};

const formatImageUrl = (path) => {
  if (!path || typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  if (!path.includes('uploads')) return path;
  const cleanPath = path.replace(/^\/+/, '');
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverUrl = baseUrl.replace('/api', '');
  return `${serverUrl}/${cleanPath}`;
};

const normalizeString = (val) => {
  if (!val) return val;
  try {
    const parsed = typeof val === 'string' ? JSON.parse(val) : val;
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.value !== undefined) {
      return parsed.map(p => p.value).join('\n');
    }
  } catch (e) { }
  return val;
};

const useFetchData = (apiCall, fallbackData, transformData = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiCall();
      if (res.success && res.data) {
        setData(transformData ? transformData(res.data) : res.data);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to static data:', err.message);
      setError(err);
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useHomeContent = () => {
  return useFetchData(getPublicHome, homeData, (apiData) => {
    const parsedVision = parseJsonField(apiData.visionDescription, { description: homeData.vision.description, stats: homeData.vision.stats });
    const parsedFounder = parseJsonField(apiData.founderDescription, { members: null }).members || homeData.founder.members;
    const parsedExperience = parseJsonField(apiData.experienceDescription, { items: null }).items || homeData.experience.items;

    return {
      hero: {
        title: apiData.heroTitle || homeData.hero.title,
        tagline: apiData.heroTagline || homeData.hero.tagline,
        slides: homeData.hero.slides,
        scrollText: homeData.hero.scrollText
      },
      story: {
        title: apiData.storyTitle || homeData.story.title,
        paragraphs: parseJsonField(apiData.storyDescription, { paragraphs: homeData.story.paragraphs }).paragraphs
      },
      vision: {
        title: apiData.visionTitle || homeData.vision.title,
        slideId: homeData.vision.slideId,
        description: parsedVision.description,
        stats: parsedVision.stats
      },
      founder: {
        title: apiData.founderTitle || homeData.founder.title,
        members: parsedFounder.map((m, i) => ({
          ...(homeData.founder.members[i] || {}),
          ...m
        }))
      },
      experience: {
        title: apiData.experienceTitle || homeData.experience.title,
        items: parsedExperience.map((item, i) => ({
          ...(homeData.experience.items[i] || {}),
          ...item
        }))
      },
      gallery: homeData.gallery,
      journey: homeData.journey,
      contact: homeData.contact
    };
  });
};

export const useCompany = () => {
  return useFetchData(getPublicCompany, orgData.company, (apiData) => {
    return {
      name: apiData.name,
      location: apiData.address,
      description: apiData.description,
      tagline: apiData.tagline,
      established: null,
      founderName: apiData.founder,
      instagram: apiData.instagram,
      linkedin: apiData.linkedin,
      youtube: apiData.youtube,
      pinterest: apiData.pinterest
    };
  });
};

export const useContact = () => {
  return useFetchData(getPublicContact, orgData.contact);
};

export const useNavigation = () => {
  return useFetchData(getPublicNavigation, navigationData, (apiData) => {
    return apiData.map(dbItem => {
      const staticItem = navigationData.find(item => item.path === dbItem.path);
      return {
        ...dbItem,
        layout: staticItem?.layout,
        items: staticItem?.items,
        exact: staticItem?.exact
      };
    });
  });
};

export const useSlides = () => {
  return useFetchData(getPublicSlides, slidesData, (apiData) => {
    return apiData.map(slide => ({
      id: slide.id,
      url: slide.image.startsWith('http') ? slide.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}${slide.image}`,
      title: slide.title,
      order: slide.order,
      active: slide.active
    }));
  });
};

export const useLatestContent = () => {
  return useFetchData(getPublicLatest, latestData, (apiData) => {
    return {
      hero: {
        title: apiData.heroTitle || latestData.hero.title,
        subtitle: apiData.heroSubtitle || latestData.hero.subtitle,
        description: normalizeString(apiData.heroDescription) || latestData.hero.description,
      },
      featuredArticle: (() => {
        const parsed = parseJsonField(apiData.featuredArticle, null);
        let articleObj = parsed ? (Array.isArray(parsed) ? parsed[0] : parsed) : latestData.featuredArticle;
        if (!articleObj) return null;

        let imageUrl = null;
        if (typeof articleObj.image === 'string') imageUrl = formatImageUrl(articleObj.image);
        else if (articleObj.image?.url) imageUrl = formatImageUrl(articleObj.image.url);

        if (!imageUrl && latestData.featuredArticle?.image) {
          imageUrl = latestData.featuredArticle.image.url;
        }

        return { ...articleObj, image: imageUrl ? { url: imageUrl } : null };
      })(),
      articles: parseJsonField(apiData.articles, latestData.articles).map((article, i) => {
        let imageUrl = null;
        if (typeof article.image === 'string') imageUrl = formatImageUrl(article.image);
        else if (article.image?.url) imageUrl = formatImageUrl(article.image.url);

        if (!imageUrl && latestData.articles[i]?.image) {
          imageUrl = latestData.articles[i].image.url;
        }

        return { ...article, image: imageUrl ? { url: imageUrl } : null };
      }),
      highlights: {
        title: apiData.highlightsTitle || latestData.highlights.title,
        topics: normalizeStringArray(parseJsonField(apiData.highlightsTopics, latestData.highlights.topics))
      },
      newsletter: {
        title: apiData.newsletterTitle || latestData.newsletter.title,
        description: apiData.newsletterDescription || latestData.newsletter.description,
        cta: apiData.newsletterCta || latestData.newsletter.cta
      }
    };
  });
};

export const useDiscoverContent = () => {
  return useFetchData(getPublicDiscover, discoverData, (apiData) => {
    return {
      hero: {
        title: apiData.heroTitle || discoverData.hero.title,
        subtitle: apiData.heroSubtitle || discoverData.hero.subtitle,
        description: normalizeString(apiData.heroDescription) || discoverData.hero.description,
        image: { url: (apiData.heroImage && apiData.heroImage.trim() !== '') ? formatImageUrl(apiData.heroImage) : discoverData.hero.image?.url }
      },
      philosophy: {
        heading: apiData.philosophyHeading || discoverData.philosophy.heading,
        paragraphs: normalizeStringArray(parseJsonField(apiData.philosophyParagraphs, discoverData.philosophy.paragraphs))
      },
      craftsmanship: {
        title: apiData.craftsmanshipTitle || discoverData.craftsmanship.title,
        items: parseJsonField(apiData.craftsmanshipItems, discoverData.craftsmanship.items),
        image: { url: (apiData.craftsmanshipImage && apiData.craftsmanshipImage.trim() !== '') ? formatImageUrl(apiData.craftsmanshipImage) : discoverData.craftsmanship.image?.url }
      },
      values: {
        title: apiData.valuesTitle || discoverData.valuesGrid.title,
        cards: parseJsonField(apiData.valuesCards, discoverData.valuesGrid.cards).map((c, i) => {
          let imageUrl = null;
          if (typeof c.icon === 'string' && c.icon.trim() !== '') imageUrl = formatImageUrl(c.icon);
          else if (typeof c.image === 'string' && c.image.startsWith('/')) imageUrl = formatImageUrl(c.image);
          else if (c.image?.url) imageUrl = formatImageUrl(c.image.url);

          if (!imageUrl && discoverData.valuesGrid.cards[i]?.image) {
            imageUrl = discoverData.valuesGrid.cards[i].image.url;
          }

          return { ...c, image: imageUrl ? { url: imageUrl } : null };
        })
      },
      gallery: {
        title: apiData.galleryTitle || discoverData.editorialGallery.title,
        images: parseJsonField(apiData.galleryImages, discoverData.editorialGallery.images).map((img, i) => {
          let imageUrl = img?.url;
          if (imageUrl && imageUrl.includes('uploads')) imageUrl = formatImageUrl(imageUrl);

          if (!imageUrl && discoverData.editorialGallery.images[i]) {
            imageUrl = discoverData.editorialGallery.images[i].url;
          }
          return { ...img, url: imageUrl };
        })
      },
      cta: {
        title: apiData.ctaTitle || discoverData.cta.title,
        buttonText: apiData.ctaButtonText || discoverData.cta.buttonText,
        link: apiData.ctaLink || discoverData.cta.link
      }
    };
  });
};

export const useCommunityContent = () => {
  return useFetchData(getPublicCommunity, communityData, (apiData) => {
    return {
      hero: {
        title: apiData.heroTitle || communityData.hero.title,
        subtitle: apiData.heroSubtitle || communityData.hero.subtitle,
        description: normalizeString(apiData.heroDescription) || communityData.hero.description,
        image: { url: (apiData.heroImage && apiData.heroImage.trim() !== '') ? formatImageUrl(apiData.heroImage) : communityData.hero.image?.url }
      },
      memberStories: {
        title: apiData.storiesTitle || communityData.memberStories.title,
        stories: parseJsonField(apiData.stories, communityData.memberStories.stories).map((s, i) => {
          const defaultStory = communityData.memberStories.stories[i] || {};
          let imageUrl = null;
          if (typeof s.image === 'string') imageUrl = formatImageUrl(s.image);
          else if (s.image?.url) imageUrl = formatImageUrl(s.image.url);

          if (!imageUrl && defaultStory.image) {
            imageUrl = defaultStory.image.url;
          }
          return {
            ...defaultStory,
            ...s,
            name: s.name || s.title || defaultStory.name,
            role: s.role || s.author || defaultStory.role,
            quote: s.quote || s.excerpt || defaultStory.quote,
            image: imageUrl ? { url: imageUrl } : null
          };
        })
      },
      testimonials: {
        title: apiData.testimonialsTitle || communityData.testimonials.title,
        items: parseJsonField(apiData.testimonials, communityData.testimonials.items)
      },
      experiences: {
        title: apiData.experiencesTitle || communityData.experiences.title,
        events: parseJsonField(apiData.experiences, communityData.experiences.events)
      },
      gallery: {
        title: apiData.galleryTitle || communityData.gallery.title,
        images: parseJsonField(apiData.galleryImages, communityData.gallery.images).map((img, i) => {
          let imageUrl = img?.url;
          if (typeof img === 'string') imageUrl = img;
          if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes('uploads')) imageUrl = formatImageUrl(imageUrl);

          if (!imageUrl && communityData.gallery.images[i]) {
            imageUrl = communityData.gallery.images[i].url;
          }
          return typeof img === 'object' ? { ...img, url: imageUrl } : { url: imageUrl };
        })
      },
      cta: {
        title: apiData.ctaTitle || communityData.cta.title,
        description: normalizeString(apiData.ctaDescription) || communityData.cta.description,
        buttonText: apiData.ctaButtonText || communityData.cta.buttonText
      }
    };
  });
};

export const useNoteContent = () => {
  return useFetchData(getPublicNote, noteData, (apiData) => {
    return {
      hero: {
        title: apiData.heroTitle || noteData.hero.title,
        subtitle: apiData.heroSubtitle || noteData.hero.subtitle,
        description: normalizeString(apiData.heroDescription) || noteData.hero.description,
        image: { url: (apiData.heroImage && apiData.heroImage.trim() !== '') ? formatImageUrl(apiData.heroImage) : noteData.hero.image?.url }
      },
      letter: {
        title: apiData.letterTitle || noteData.foundersLetter.title,
        salutation: apiData.letterSalutation || noteData.foundersLetter.salutation,
        paragraphs: normalizeStringArray(parseJsonField(apiData.letterParagraphs, noteData.foundersLetter.paragraphs)),
        image: { url: (apiData.letterImage && apiData.letterImage.trim() !== '') ? formatImageUrl(apiData.letterImage) : noteData.foundersLetter.image?.url }
      },
      editorial: {
        title: apiData.editorialTitle || noteData.longFormEditorial.title,
        content: parseJsonField(apiData.editorialContent, noteData.longFormEditorial.content).map(block => {
          if (block.type === 'image') {
            let imageUrl = null;
            if (typeof block.value === 'string') imageUrl = formatImageUrl(block.value);
            else if (block.value?.url) imageUrl = formatImageUrl(block.value.url);
            return { ...block, value: { url: imageUrl } };
          }
          return block;
        })
      },
      signature: {
        name: apiData.signatureName || noteData.signatureBlock.name,
        role: apiData.signatureRole || noteData.signatureBlock.role,
        bio: apiData.signatureBio || noteData.signatureBlock.bio,
        image: { url: (apiData.signatureImage && apiData.signatureImage.trim() !== '') ? formatImageUrl(apiData.signatureImage) : noteData.signatureBlock.image?.url }
      }
    };
  });
};

// --- REACT QUERY OPTIMIZATIONS (Production Hardening) ---
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Website Settings Hook
export const useWebsiteSettings = () => {
  return useQuery({
    queryKey: ['websiteSettings'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/settings`);
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 mins
  });
};

// Public Products Hook
export const usePublicProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/products`, { params });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 mins
  });
};

// Public Articles Hook
export const usePublicArticles = (params = {}) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/magazine/articles`, { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
