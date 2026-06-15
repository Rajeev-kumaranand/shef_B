import axiosInstance from './axios.js';

export const getCommunityContent = async () => {
  const response = await axiosInstance.get('/community');
  return response.data;
};

export const updateCommunityContent = async (data) => {
  const response = await axiosInstance.put('/community', data);
  return response.data;
};
