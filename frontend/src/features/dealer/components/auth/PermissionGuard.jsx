import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { AuthService } from '@utils';
import { hasPermission, hasAnyPermission, hasAllPermissions, canAccessFeature } from '../../config/permissions';

/**
 * PermissionGuard Component
 * Guard component để kiểm tra quyền truy cập dựa trên permissions
 * 
 * @example
 * // Kiểm tra single permission
 * <PermissionGuard permission="sales.create_quotation">
 *   <CreateQuotationButton />
 * </PermissionGuard>
 * 
 * @example
 * // Kiểm tra multiple permissions (ANY)
 * <PermissionGuard permissions={['sales.view_order', 'sales.create_order']} requireAll={false}>
 *   <OrderSection />
 * </PermissionGuard>
 * 
 * @example
 * // Kiểm tra multiple permissions (ALL)
 * <PermissionGuard permissions={['sales.approve_order', 'sales.manage_promotion']} requireAll={true}>
 *   <ManagerOnlyFeature />
 * </PermissionGuard>
 * 
 * @example
 * // Kiểm tra feature access
 * <PermissionGuard feature="MANAGE_STAFF">
 *   <StaffManagementPage />
 * </PermissionGuard>
 */
const PermissionGuard = ({
  children,
  permission,         // Single permission string
  permissions = [],   // Array of permissions
  feature,            // Feature name from FEATURE_ACCESS
  requireAll = false, // If true, require ALL permissions; if false, require ANY
  fallback = null,    // Component to render when access denied (null = redirect)
  redirectTo = '/dealer/access-denied',
  hideOnDenied = false, // If true, render nothing instead of redirecting
}) => {
  const currentUser = AuthService.getCurrentUser();

  // Không có user → redirect to login
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  const userRole = currentUser.dealerRole || currentUser.role;
  let hasAccess = false;

  // Check feature access
  if (feature) {
    hasAccess = canAccessFeature(userRole, feature);
  }
  // Check single permission
  else if (permission) {
    hasAccess = hasPermission(userRole, permission);
  }
  // Check multiple permissions
  else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(userRole, permissions)
      : hasAnyPermission(userRole, permissions);
  }
  // No permission specified → deny access
  else {
    console.warn('PermissionGuard: No permission, permissions, or feature specified');
    hasAccess = false;
  }

  // Access denied handling
  if (!hasAccess) {
    // Hide component completely
    if (hideOnDenied) {
      return null;
    }
    
    // Render fallback component
    if (fallback) {
      return fallback;
    }
    
    // Redirect to access denied page
    return <Navigate to={redirectTo} replace />;
  }

  // Access granted
  return children;
};

PermissionGuard.propTypes = {
  children: PropTypes.node.isRequired,
  permission: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  feature: PropTypes.string,
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
  redirectTo: PropTypes.string,
  hideOnDenied: PropTypes.bool,
};

/**
 * Hook để sử dụng permission check trong component
 * @example
 * const { canCreate, canApprove } = usePermissions({
 *   canCreate: 'sales.create_order',
 *   canApprove: 'sales.approve_order'
 * });
 */
export const usePermissions = (permissionMap = {}) => {
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.dealerRole || currentUser?.role;

  const result = {};
  
  Object.entries(permissionMap).forEach(([key, permission]) => {
    if (Array.isArray(permission)) {
      result[key] = hasAnyPermission(userRole, permission);
    } else {
      result[key] = hasPermission(userRole, permission);
    }
  });

  return result;
};

/**
 * Hook để check feature access
 * @example
 * const canManageStaff = useFeatureAccess('MANAGE_STAFF');
 */
export const useFeatureAccess = (feature) => {
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.dealerRole || currentUser?.role;
  
  return canAccessFeature(userRole, feature);
};

/**
 * HOC để wrap component với permission guard
 * @example
 * export default withPermission(CreateOrderButton, 'sales.create_order');
 */
export const withPermission = (Component, permission, options = {}) => {
  return (props) => (
    <PermissionGuard permission={permission} {...options}>
      <Component {...props} />
    </PermissionGuard>
  );
};

/**
 * Conditional rendering component dựa trên permission
 * @example
 * <Can permission="sales.approve_order">
 *   <ApproveButton />
 * </Can>
 * 
 * <Can permission="sales.approve_order" fallback={<DisabledButton />}>
 *   <ApproveButton />
 * </Can>
 */
export const Can = ({ permission, permissions, feature, children, fallback = null, requireAll = false }) => {
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.dealerRole || currentUser?.role;

  let hasAccess = false;

  if (feature) {
    hasAccess = canAccessFeature(userRole, feature);
  } else if (permission) {
    hasAccess = hasPermission(userRole, permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(userRole, permissions)
      : hasAnyPermission(userRole, permissions);
  }

  return hasAccess ? children : fallback;
};

Can.propTypes = {
  permission: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  feature: PropTypes.string,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  requireAll: PropTypes.bool,
};

/**
 * Component hiển thị thông báo "Bạn không có quyền"
 */
export const AccessDeniedMessage = ({ message, showBackButton = true }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Không có quyền truy cập
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message || 'Bạn không có quyền thực hiện chức năng này.'}
        </p>
        {showBackButton && (
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Quay lại
          </button>
        )}
      </div>
    </div>
  );
};

AccessDeniedMessage.propTypes = {
  message: PropTypes.string,
  showBackButton: PropTypes.bool,
};

export default PermissionGuard;
