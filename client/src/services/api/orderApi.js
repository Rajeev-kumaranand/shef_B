import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor for auth token (Admin routes)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public: Create order
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Public: Get order by ID/Number
export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Admin: Get all orders
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

// Admin: Update order status
export const updateOrderStatus = async (id, statusData) => {
  const response = await api.patch(`/orders/${id}/status`, statusData);
  return response.data;
};

// Admin: Get order metrics
export const getOrderStats = async () => {
  const response = await api.get('/orders/stats/metrics');
  return response.data;
};
