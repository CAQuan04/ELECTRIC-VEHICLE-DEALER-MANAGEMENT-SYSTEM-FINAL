import { useState, useEffect } from 'react';

// Custom hook for data fetching with loading and error states
export const useDataFetching = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchFunction();
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Custom hook for URL parameters
export const useURLParams = () => {
  const [params, setParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsObject = {};
    
    for (let [key, value] of urlParams.entries()) {
      paramsObject[key] = value;
    }
    
    setParams(paramsObject);
  }, []);

  const updateParam = (key, value) => {
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.pushState({}, '', url);
    
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return { params, updateParam };
};

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Custom hook for dashboard navigation
export const useDashboardNavigation = (defaultSection = 'overview') => {
  const { params, updateParam } = useURLParams();
  const [activeSection, setActiveSection] = useState(params.section || defaultSection);

  const changeSection = (section) => {
    setActiveSection(section);
    updateParam('section', section);
  };

  useEffect(() => {
    if (params.section && params.section !== activeSection) {
      setActiveSection(params.section);
    }
  }, [params.section]);

  return { activeSection, changeSection };
};