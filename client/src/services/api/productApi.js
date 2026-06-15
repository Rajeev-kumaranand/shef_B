import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products', error);
    return { success: false, data: [] };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product', error);
    return { success: false, data: null };
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug', error);
    return { success: false, data: null };
  }
};

export const createProduct = async (data) => {
  const response = await axios.post(`${API_URL}/products`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await axios.put(`${API_URL}/products/${id}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
