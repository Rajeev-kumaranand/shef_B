import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin } from '../services/api/authApi.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ role: 'admin' });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginAdmin(credentials);
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setUser({ role: 'admin' });
        toast.success('Login successful');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
