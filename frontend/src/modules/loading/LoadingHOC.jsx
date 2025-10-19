import React from 'react';
import LoadingPage from './LoadingPage';

/**
 * Higher-Order Component that adds loading functionality to any component
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {object} options - Loading options
 * @returns {React.Component} Enhanced component with loading
 */
export const withLoading = (WrappedComponent, options = {}) => {
  const {
    loadingMessage = 'Loading...',
    loadingVariant = 'default',
    showLogo = true,
    minimumLoadingTime = 500
  } = options;

  const WithLoadingComponent = (props) => {
    const { isLoading, loadingText, ...otherProps } = props;

    if (isLoading) {
      return (
        <LoadingPage
          message={loadingText || loadingMessage}
          variant={loadingVariant}
          showLogo={showLogo}
        />
      );
    }

    return <WrappedComponent {...otherProps} />;
  };

  // Set display name for debugging
  WithLoadingComponent.displayName = `withLoading(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithLoadingComponent;
};

/**
 * HOC specifically designed for full-page loading
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {object} options - Configuration options
 * @returns {React.Component} Enhanced component with full-page loading
 */
export const withFullPageLoading = (WrappedComponent, options = {}) => {
  const {
    loadingMessage = 'Đang tải trang...',
    loadingVariant = 'tesla',
    showLogo = true,
    minimumLoadingTime = 800,
    enableProgressBar = true,
    enableFadeTransition = true
  } = options;

  const WithFullPageLoadingComponent = (props) => {
    const { isLoading, loadingText, loadingProgress, ...otherProps } = props;
    const [isVisible, setIsVisible] = React.useState(false);
    const [shouldShowContent, setShouldShowContent] = React.useState(!isLoading);

    React.useEffect(() => {
      if (isLoading) {
        setShouldShowContent(false);
        setIsVisible(true);
      } else {
        // Minimum loading time để tránh flash
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setShouldShowContent(true), 150);
        }, minimumLoadingTime);

        return () => clearTimeout(timer);
      }
    }, [isLoading, minimumLoadingTime]);

    if (isVisible || isLoading) {
      return (
        <div className={`full-page-loader ${enableFadeTransition ? 'fade-transition' : ''}`}>
          <LoadingPage
            message={loadingText || loadingMessage}
            variant={loadingVariant}
            showLogo={showLogo}
            progress={enableProgressBar ? loadingProgress : undefined}
            fullPage={true}
          />
        </div>
      );
    }

    if (!shouldShowContent) {
      return null;
    }

    return (
      <div className={`page-content ${enableFadeTransition ? 'fade-in' : ''}`}>
        <WrappedComponent {...otherProps} />
      </div>
    );
  };

  WithFullPageLoadingComponent.displayName = `withFullPageLoading(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithFullPageLoadingComponent;
};

/**
 * HOC for dashboard pages with loading states
 * @param {React.Component} WrappedComponent - Dashboard component to wrap
 * @param {object} options - Configuration options
 * @returns {React.Component} Enhanced dashboard component
 */
export const withDashboardLoading = (WrappedComponent, options = {}) => {
  const {
    loadingMessage = 'Đang tải dashboard...',
    dataLoadingMessage = 'Đang tải dữ liệu...',
    loadingVariant = 'dashboard',
    showLogo = true,
    enableSkeleton = true
  } = options;

  const WithDashboardLoadingComponent = (props) => {
    const { 
      isLoading, 
      isDataLoading, 
      loadingText, 
      loadingStage,
      ...otherProps 
    } = props;

    // Initial page loading
    if (isLoading) {
      return (
        <LoadingPage
          message={loadingText || loadingMessage}
          variant={loadingVariant}
          showLogo={showLogo}
          fullPage={true}
        />
      );
    }

    // Data loading overlay
    if (isDataLoading && enableSkeleton) {
      return (
        <div className="dashboard-loading-container">
          <div className="dashboard-loading-overlay">
            <LoadingPage
              message={dataLoadingMessage}
              variant="minimal"
              showLogo={false}
              size="small"
            />
          </div>
          <div className="dashboard-content-skeleton">
            <WrappedComponent {...otherProps} />
          </div>
        </div>
      );
    }

    return <WrappedComponent {...otherProps} />;
  };

  WithDashboardLoadingComponent.displayName = `withDashboardLoading(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithDashboardLoadingComponent;
};

/**
 * HOC that automatically manages loading state for async data fetching
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Function} dataFetcher - Function that returns a promise with data
 * @param {object} options - Configuration options
 * @returns {React.Component} Enhanced component with automatic loading
 */
export const withAsyncLoading = (WrappedComponent, dataFetcher, options = {}) => {
  const {
    loadingMessage = 'Loading data...',
    errorMessage = 'Failed to load data',
    loadingVariant = 'default',
    showLogo = true,
    retryable = true,
    dependencies = []
  } = options;

  const WithAsyncLoadingComponent = (props) => {
    const [state, setState] = React.useState({
      loading: true,
      data: null,
      error: null
    });

    const fetchData = React.useCallback(async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const data = await dataFetcher(props);
        
        setState({
          loading: false,
          data,
          error: null
        });
      } catch (error) {
        setState({
          loading: false,
          data: null,
          error: error.message || errorMessage
        });
      }
    }, [props, errorMessage, ...dependencies]);

    React.useEffect(() => {
      fetchData();
    }, [fetchData]);

    if (state.loading) {
      return (
        <LoadingPage
          message={loadingMessage}
          variant={loadingVariant}
          showLogo={showLogo}
        />
      );
    }

    if (state.error) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            maxWidth: '500px'
          }}>
            <h3 style={{ color: '#c33', margin: '0 0 1rem 0' }}>Error</h3>
            <p style={{ margin: '0 0 1rem 0' }}>{state.error}</p>
            {retryable && (
              <button
                onClick={fetchData}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            )}
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} data={state.data} />;
  };

  WithAsyncLoadingComponent.displayName = `withAsyncLoading(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithAsyncLoadingComponent;
};

/**
 * Hook for creating loadable components with suspense-like behavior
 * @param {Function} importFunction - Dynamic import function
 * @param {object} fallbackComponent - Component to show while loading
 * @returns {React.Component} Loadable component
 */
export const createLoadableComponent = (importFunction, fallbackComponent = null) => {
  const LoadableComponent = React.lazy(importFunction);

  const WithSuspenseComponent = (props) => {
    const fallback = fallbackComponent || (
      <LoadingPage 
        message="Loading component..." 
        variant="minimal" 
        showLogo={false}
      />
    );

    return (
      <React.Suspense fallback={fallback}>
        <LoadableComponent {...props} />
      </React.Suspense>
    );
  };

  WithSuspenseComponent.displayName = 'LoadableComponent';

  return WithSuspenseComponent;
};

/**
 * Component wrapper for conditional loading based on props
 */
export const ConditionalLoader = ({ 
  condition, 
  children, 
  loadingMessage = 'Loading...',
  variant = 'minimal',
  showLogo = false 
}) => {
  if (condition) {
    return (
      <LoadingPage
        message={loadingMessage}
        variant={variant}
        showLogo={showLogo}
      />
    );
  }

  return children;
};

/**
 * Global Loading Context for managing app-wide loading states
 */
const LoadingContext = React.createContext({
  isGlobalLoading: false,
  globalLoadingMessage: '',
  setGlobalLoading: () => {},
  showPageLoading: () => {},
  hidePageLoading: () => {},
  loadingQueue: []
});

/**
 * Global Loading Provider
 */
export const GlobalLoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = React.useState({
    isGlobalLoading: false,
    globalLoadingMessage: '',
    loadingQueue: [],
    loadingId: 0
  });

  const setGlobalLoading = React.useCallback((isLoading, message = 'Đang tải...') => {
    setLoadingState(prev => ({
      ...prev,
      isGlobalLoading: isLoading,
      globalLoadingMessage: message
    }));
  }, []);

  const showPageLoading = React.useCallback((message = 'Đang tải trang...', options = {}) => {
    const loadingId = Date.now();
    const loadingItem = {
      id: loadingId,
      message,
      timestamp: Date.now(),
      ...options
    };

    setLoadingState(prev => ({
      ...prev,
      isGlobalLoading: true,
      globalLoadingMessage: message,
      loadingQueue: [...prev.loadingQueue, loadingItem],
      loadingId
    }));

    return loadingId;
  }, []);

  const hidePageLoading = React.useCallback((loadingId = null) => {
    setLoadingState(prev => {
      const newQueue = loadingId 
        ? prev.loadingQueue.filter(item => item.id !== loadingId)
        : [];
      
      const isStillLoading = newQueue.length > 0;
      const currentMessage = isStillLoading ? newQueue[newQueue.length - 1].message : '';

      return {
        ...prev,
        isGlobalLoading: isStillLoading,
        globalLoadingMessage: currentMessage,
        loadingQueue: newQueue
      };
    });
  }, []);

  const contextValue = React.useMemo(() => ({
    isGlobalLoading: loadingState.isGlobalLoading,
    globalLoadingMessage: loadingState.globalLoadingMessage,
    loadingQueue: loadingState.loadingQueue,
    setGlobalLoading,
    showPageLoading,
    hidePageLoading
  }), [loadingState, setGlobalLoading, showPageLoading, hidePageLoading]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {loadingState.isGlobalLoading && (
        <div className="global-loading-overlay">
          <LoadingPage
            message={loadingState.globalLoadingMessage}
            variant="tesla"
            showLogo={true}
            fullPage={true}
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

/**
 * Hook to use global loading context
 */
export const useGlobalLoading = () => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};

/**
 * Hook for managing page loading states with automatic cleanup
 */
export const usePageLoading = (initialMessage = 'Đang tải...') => {
  const { showPageLoading, hidePageLoading } = useGlobalLoading();
  const loadingIdRef = React.useRef(null);

  const startLoading = React.useCallback((message = initialMessage, options = {}) => {
    if (loadingIdRef.current) {
      hidePageLoading(loadingIdRef.current);
    }
    loadingIdRef.current = showPageLoading(message, options);
    return loadingIdRef.current;
  }, [showPageLoading, hidePageLoading, initialMessage]);

  const stopLoading = React.useCallback(() => {
    if (loadingIdRef.current) {
      hidePageLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [hidePageLoading]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (loadingIdRef.current) {
        hidePageLoading(loadingIdRef.current);
      }
    };
  }, [hidePageLoading]);

  return { startLoading, stopLoading };
};

/**
 * HOC that wraps entire application with global loading
 */
export const withGlobalLoading = (WrappedComponent) => {
  const WithGlobalLoadingComponent = (props) => {
    return (
      <GlobalLoadingProvider>
        <WrappedComponent {...props} />
      </GlobalLoadingProvider>
    );
  };

  WithGlobalLoadingComponent.displayName = `withGlobalLoading(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithGlobalLoadingComponent;
};

/**
 * Route-level loading HOC for React Router
 */
export const withRouteLoading = (WrappedComponent, options = {}) => {
  const {
    loadingMessage = 'Đang tải trang...',
    loadingVariant = 'tesla',
    showLogo = true,
    autoLoadOnMount = true,
    loadingDuration = 1000
  } = options;

  const WithRouteLoadingComponent = (props) => {
    const { startLoading, stopLoading } = usePageLoading(loadingMessage);
    const [isInitializing, setIsInitializing] = React.useState(autoLoadOnMount);

    React.useEffect(() => {
      if (autoLoadOnMount) {
        const loadingId = startLoading(loadingMessage);
        
        const timer = setTimeout(() => {
          stopLoading();
          setIsInitializing(false);
        }, loadingDuration);

        return () => {
          clearTimeout(timer);
          stopLoading();
        };
      }
    }, [startLoading, stopLoading, loadingMessage, loadingDuration, autoLoadOnMount]);

    if (isInitializing && autoLoadOnMount) {
      return null; // Global loading will handle this
    }

    return <WrappedComponent {...props} startLoading={startLoading} stopLoading={stopLoading} />;
  };

  WithRouteLoadingComponent.displayName = `withRouteLoading(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithRouteLoadingComponent;
};

export default {
  withLoading,
  withFullPageLoading,
  withDashboardLoading,
  withAsyncLoading,
  withGlobalLoading,
  withRouteLoading,
  createLoadableComponent,
  ConditionalLoader,
  GlobalLoadingProvider,
  useGlobalLoading,
  usePageLoading
};