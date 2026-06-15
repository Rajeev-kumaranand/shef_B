import axiosInstance from './axios.js';

export const getLatestContent = async () => {
  const response = await axiosInstance.get('/latest');
  return response.data;
};

export const updateLatestContent = async (data) => {
  const response = await axiosInstance.put('/latest', data);
  return response.data;
};
