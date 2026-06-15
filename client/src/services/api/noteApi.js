import axiosInstance from './axios.js';

export const getNoteContent = async () => {
  const response = await axiosInstance.get('/note');
  return response.data;
};

export const updateNoteContent = async (data) => {
  const response = await axiosInstance.put('/note', data);
  return response.data;
};
