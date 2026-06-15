import { useState, useEffect } from 'react';
import { 
  getPublicHome, 
  getPublicCompany, 
  getPublicContact, 
  getPublicNavigation, 
  getPublicSlides 
} from '../services/api/publicApi.js';
import { parseJsonField } from '../utils/contentParser.js';

import { homeData } from '../data/homeData.js';
import { orgData } from '../data/orgData.js';
import { navigationData } from '../data/navigationData.js';
import { slidesData } from '../data/slidesData.js';

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
