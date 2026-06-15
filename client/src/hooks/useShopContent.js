import { useState, useEffect } from 'react';
import { getPublicShop } from '../services/api/publicApi.js';
import { parseJsonField } from '../utils/contentParser.js';

export const useShopContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await getPublicShop();
      if (res.success && res.data) {
        // Parse any JSON fields here if necessary (like storyParagraphs)
        const parsedData = {
          ...res.data,
          storyParagraphs: parseJsonField(res.data.storyParagraphs, [])
        };
        setData(parsedData);
      } else {
        throw new Error('Failed to load shop content');
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return { data, loading, error, refetch: fetchContent };
};
