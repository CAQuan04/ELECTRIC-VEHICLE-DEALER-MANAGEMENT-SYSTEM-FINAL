// Export all shared UI components
export {
  MessageSpinner as DashboardSpinner, // Message-based spinner for dashboards (primary)
  MessageSpinner, // Direct export
  ErrorMessage,
  StatCard,
  DashboardHero,
  NavigationPills,
  DataTable,
  DashboardSection,
  Card,
  StatusBadge,
  Grid
} from './ui/UIComponents';

// Export Loading Page components (different interface)
export { 
  default as LoadingPage, 
  LoadingSpinner as InlineSpinner, // Size/color-based spinner
  LoadingButton 
} from './LoadingPage';

// Export Loading HOCs
export {
  withLoading,
  withAsyncLoading,
  createLoadableComponent,
  ConditionalLoader
} from './LoadingHOC';

// Export custom hooks
export {
  useDataFetching,
  useURLParams,
  useLocalStorage,
  useDashboardNavigation
} from '../hooks/useCommon';

// Export loading hooks
export {
  useLoading,
  useMultipleLoading,
  usePageLoading
} from '../hooks/useLoading';