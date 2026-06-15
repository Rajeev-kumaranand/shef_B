import axiosInstance from './axios.js';

export const getMediaFiles = async () => {
  const response = await axiosInstance.get('/media');
  return response.data;
};

export const uploadMediaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post('/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteMediaFile = async (id) => {
  const response = await axiosInstance.delete(`/media/${id}`);
  return response.data;
};
