import { createContext, useContext, useState, useEffect } from 'react';
import { loginCustomer, registerCustomer, getCustomerProfile } from '../services/api/customerApi.js';
import toast from 'react-hot-toast';

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('shefb_customer_token');
      if (token) {
        try {
          const res = await getCustomerProfile();
          if (res.success) {
            setCustomer(res.data);
          } else {
            localStorage.removeItem('shefb_customer_token');
          }
        } catch (error) {
          localStorage.removeItem('shefb_customer_token');
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginCustomer(credentials);
      if (res.success && res.data.token) {
        localStorage.setItem('shefb_customer_token', res.data.token);
        setCustomer(res.data);
        toast.success('Welcome back!');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (data) => {
    try {
      const res = await registerCustomer(data);
      if (res.success && res.data.token) {
        localStorage.setItem('shefb_customer_token', res.data.token);
        setCustomer(res.data);
        toast.success('Account created successfully!');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('shefb_customer_token');
    setCustomer(null);
    toast.success('Logged out');
  };

  const updateCustomerData = (newData) => {
    setCustomer(prev => ({ ...prev, ...newData }));
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, login, register, logout, loading, updateCustomerData }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
