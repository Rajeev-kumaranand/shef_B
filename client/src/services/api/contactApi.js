import api from './axios.js';

export const getContact = async () => {
  const response = await api.get('/contact');
  return response.data;
};

export const updateContact = async (data) => {
  const response = await api.put('/contact', data);
  return response.data;
};
