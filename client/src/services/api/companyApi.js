import api from './axios.js';

export const getCompany = async () => {
  const response = await api.get('/company');
  return response.data;
};

export const updateCompany = async (data) => {
  const response = await api.put('/company', data);
  return response.data;
};
