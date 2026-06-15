import axiosInstance from './axios.js';

export const getDiscoverContent = async () => {
  const response = await axiosInstance.get('/discover');
  return response.data;
};

export const updateDiscoverContent = async (data) => {
  const response = await axiosInstance.put('/discover', data);
  return response.data;
};
