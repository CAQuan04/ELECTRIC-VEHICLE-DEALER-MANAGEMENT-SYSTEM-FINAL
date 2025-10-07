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

export default {
  withLoading,
  withAsyncLoading,
  createLoadableComponent,
  ConditionalLoader
};