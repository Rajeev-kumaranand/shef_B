import api from './axios.js';

export const getHomeContent = async () => {
  const response = await api.get('/home');
  return response.data;
};

export const updateHomeContent = async (data) => {
  const response = await api.put('/home', data);
  return response.data;
};
