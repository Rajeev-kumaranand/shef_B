import axiosInstance from './axios.js';

export const getShopContent = async () => {
  const response = await axiosInstance.get('/shop');
  return response.data;
};

export const updateShopContent = async (data) => {
  const response = await axiosInstance.put('/shop', data);
  return response.data;
};
