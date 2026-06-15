import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api/productApi.js';

export function useProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      if (res.success) {
        setData(res.data || []);
      } else {
        setError(new Error(res.message || 'Failed to load products'));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { data, loading, error, refetch: fetchProducts };
}
