import api from './axios.js';

export const getNavigations = async () => {
  const response = await api.get('/navigation');
  return response.data;
};

export const createNavigation = async (data) => {
  const response = await api.post('/navigation', data);
  return response.data;
};

export const updateNavigation = async (id, data) => {
  const response = await api.put(`/navigation/${id}`, data);
  return response.data;
};

export const deleteNavigation = async (id) => {
  const response = await api.delete(`/navigation/${id}`);
  return response.data;
};
