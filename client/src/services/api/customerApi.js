import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shefb_customer_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerCustomer = async (data) => {
  const response = await api.post('/customers/register', data);
  return response.data;
};

export const loginCustomer = async (data) => {
  const response = await api.post('/customers/login', data);
  return response.data;
};

export const getCustomerProfile = async () => {
  const response = await api.get('/customers/me');
  return response.data;
};

export const updateCustomerProfile = async (data) => {
  const response = await api.put('/customers/me', data);
  return response.data;
};

// Addresses
export const getCustomerAddresses = async () => {
  const response = await api.get('/customers/addresses');
  return response.data;
};

export const addCustomerAddress = async (data) => {
  const response = await api.post('/customers/addresses', data);
  return response.data;
};

export const updateCustomerAddress = async (id, data) => {
  const response = await api.put(`/customers/addresses/${id}`, data);
  return response.data;
};

export const deleteCustomerAddress = async (id) => {
  const response = await api.delete(`/customers/addresses/${id}`);
  return response.data;
};

// Orders
export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};
