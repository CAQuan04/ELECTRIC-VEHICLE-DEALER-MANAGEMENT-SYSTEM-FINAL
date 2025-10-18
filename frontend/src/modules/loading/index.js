// Loading Module - Barrel Export
export { 
  withLoading, 
  withFullPageLoading,
  withRouteLoading,
  withDashboardLoading, 
  withAsyncLoading,
  withGlobalLoading,
  GlobalLoadingProvider, 
  usePageLoading, 
  useGlobalLoading 
} from './LoadingHOC';

export { default as LoadingPage } from './LoadingPage';

// Re-export components for named imports
import LoadingPageDefault from './LoadingPage';
export { LoadingPageDefault };

// Default export
export default LoadingPageDefault;
