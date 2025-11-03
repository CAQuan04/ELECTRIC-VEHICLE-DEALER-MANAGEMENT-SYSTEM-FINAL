/**
 * ROUTE PERMISSION GUARD COMPONENT
 * Component và hooks để kiểm soát quyền truy cập routes trong dealer module
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/utils/auth/AuthService';
import { canAccessRoute, DEALER_ROUTE_PERMISSIONS } from '../../config/routePermissions';
import { hasPermission, hasAnyPermission } from '../../config/permissions';

/**
 * Hook để lấy thông tin role hiện tại
 */
export const useCurrentRole = () => {
  const user = AuthService.getCurrentUser();
  return user?.role || null;
};

/**
 * Hook để kiểm tra quyền truy cập
 */
export const useRoutePermission = () => {
  const userRole = useCurrentRole();

  return {
    userRole,
    canAccess: (routePath) => canAccessRoute(userRole, routePath),
    hasPermission: (permission) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(userRole, permissions),
  };
};

/**
 * Component bảo vệ route theo permissions
 * Sử dụng: <RouteGuard path="/dealer/staff" />
 */
export const RouteGuard = ({ children, path, fallback = null }) => {
  const { userRole, canAccess } = useRoutePermission();
  const location = useLocation();

  // Nếu không có user role, redirect về login
  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền truy cập route
  if (!canAccess(path || location.pathname)) {
    // Nếu có fallback, hiển thị fallback
    if (fallback) {
      return fallback;
    }
    
    // Mặc định redirect về access denied
    return <Navigate to="/dealer/access-denied" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Component hiển thị có điều kiện dựa trên permission
 * Sử dụng: <PermissionGate permission="sales.create_order">...</PermissionGate>
 */
export const PermissionGate = ({ 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null,
  children 
}) => {
  const { userRole } = useRoutePermission();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(userRole, permission);
  } else if (permissions) {
    if (requireAll) {
      hasAccess = permissions.every(p => hasPermission(userRole, p));
    } else {
      hasAccess = hasAnyPermission(userRole, permissions);
    }
  }

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
};

/**
 * Component hiển thị có điều kiện dựa trên role
 * Sử dụng: <RoleGate roles={['dealer_manager']}>...</RoleGate>
 */
export const RoleGate = ({ 
  roles = [], 
  fallback = null,
  children 
}) => {
  const { userRole } = useRoutePermission();

  if (!roles.includes(userRole)) {
    return fallback;
  }

  return <>{children}</>;
};

/**
 * HOC để bọc component với route guard
 * Sử dụng: export default withRouteGuard(MyComponent, '/dealer/staff')
 */
export const withRouteGuard = (Component, routePath) => {
  return function GuardedComponent(props) {
    return (
      <RouteGuard path={routePath}>
        <Component {...props} />
      </RouteGuard>
    );
  };
};

/**
 * Hook để lấy danh sách routes có thể truy cập
 */
export const useAccessibleRoutes = () => {
  const { userRole } = useRoutePermission();
  
  if (!userRole) return [];

  return Object.values(DEALER_ROUTE_PERMISSIONS)
    .filter(route => route.roles.includes(userRole));
};

/**
 * Component render props để check permission
 */
export const PermissionCheck = ({ permission, children }) => {
  const { hasPermission: checkPermission, userRole } = useRoutePermission();
  const hasAccess = checkPermission(permission);

  return children({ hasAccess, userRole });
};

export default {
  useCurrentRole,
  useRoutePermission,
  useAccessibleRoutes,
  RouteGuard,
  PermissionGate,
  RoleGate,
  PermissionCheck,
  withRouteGuard,
};
