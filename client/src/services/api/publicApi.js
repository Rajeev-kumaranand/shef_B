import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const publicApi = axios.create({
  baseURL: BASE_URL,
});

export const getPublicHome = async () => {
  const response = await publicApi.get('/home');
  return response.data;
};

export const getPublicCompany = async () => {
  const response = await publicApi.get('/company');
  return response.data;
};

export const getPublicContact = async () => {
  const response = await publicApi.get('/contact');
  return response.data;
};

export const getPublicNavigation = async () => {
  const response = await publicApi.get('/navigation');
  return response.data;
};

export const getPublicSlides = async () => {
  const response = await publicApi.get('/slides');
  return response.data;
};

export const getPublicShop = async () => {
  const response = await publicApi.get('/shop');
  return response.data;
};
