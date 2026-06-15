import api from './axios.js';

export const getSlides = async () => {
  const response = await api.get('/slides');
  return response.data;
};

export const createSlide = async (data) => {
  const response = await api.post('/slides', data);
  return response.data;
};

export const updateSlide = async (id, data) => {
  const response = await api.put(`/slides/${id}`, data);
  return response.data;
};

export const deleteSlide = async (id) => {
  const response = await api.delete(`/slides/${id}`);
  return response.data;
};
