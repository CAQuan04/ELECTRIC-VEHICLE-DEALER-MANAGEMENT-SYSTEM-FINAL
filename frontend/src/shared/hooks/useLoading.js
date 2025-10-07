import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading states
 * @param {boolean} initialState - Initial loading state
 * @returns {object} Loading state and control functions
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const toggleLoading = useCallback(() => {
    setIsLoading(prev => !prev);
  }, []);

  /**
   * Execute an async function with loading state management
   * @param {Function} asyncFunction - Async function to execute
   * @param {object} options - Options for execution
   * @returns {Promise} Promise that resolves with the function result
   */
  const executeWithLoading = useCallback(async (asyncFunction, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      onFinally,
      minimumLoadingTime = 0 
    } = options;

    try {
      startLoading();
      
      const startTime = Date.now();
      const result = await asyncFunction();
      
      // Ensure minimum loading time for better UX
      if (minimumLoadingTime > 0) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minimumLoadingTime) {
          await new Promise(resolve => 
            setTimeout(resolve, minimumLoadingTime - elapsedTime)
          );
        }
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error('Error in executeWithLoading:', error);
      }
      throw error;
    } finally {
      stopLoading();
      if (onFinally) {
        onFinally();
      }
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    executeWithLoading
  };
};

/**
 * Hook for managing multiple loading states
 * @param {object} initialStates - Object with initial loading states
 * @returns {object} Loading states and control functions
 */
export const useMultipleLoading = (initialStates = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);

  const setLoading = useCallback((key, state) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: state
    }));
  }, []);

  const startLoading = useCallback((key) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key) => {
    setLoading(key, false);
  }, [setLoading]);

  const isLoading = useCallback((key) => {
    return Boolean(loadingStates[key]);
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(state => state);
  }, [loadingStates]);

  const executeWithLoading = useCallback(async (key, asyncFunction, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      onFinally,
      minimumLoadingTime = 0 
    } = options;

    try {
      startLoading(key);
      
      const startTime = Date.now();
      const result = await asyncFunction();
      
      // Ensure minimum loading time for better UX
      if (minimumLoadingTime > 0) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minimumLoadingTime) {
          await new Promise(resolve => 
            setTimeout(resolve, minimumLoadingTime - elapsedTime)
          );
        }
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error(`Error in executeWithLoading [${key}]:`, error);
      }
      throw error;
    } finally {
      stopLoading(key);
      if (onFinally) {
        onFinally();
      }
    }
  }, [startLoading, stopLoading]);

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
    executeWithLoading
  };
};

/**
 * Hook for managing page-level loading with automatic timeout
 * @param {number} defaultTimeout - Default timeout in milliseconds
 * @returns {object} Page loading state and controls
 */
export const usePageLoading = (defaultTimeout = 30000) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [timeoutId, setTimeoutId] = useState(null);

  const startPageLoading = useCallback((message = 'Loading...', timeout = defaultTimeout) => {
    setIsPageLoading(true);
    setLoadingMessage(message);
    
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Set new timeout
    if (timeout > 0) {
      const id = setTimeout(() => {
        setIsPageLoading(false);
        console.warn('Page loading timed out');
      }, timeout);
      setTimeoutId(id);
    }
  }, [timeoutId, defaultTimeout]);

  const stopPageLoading = useCallback(() => {
    setIsPageLoading(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const updateLoadingMessage = useCallback((message) => {
    setLoadingMessage(message);
  }, []);

  // Cleanup timeout on unmount
  useState(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return {
    isPageLoading,
    loadingMessage,
    startPageLoading,
    stopPageLoading,
    updateLoadingMessage
  };
};

export default {
  useLoading,
  useMultipleLoading,
  usePageLoading
};