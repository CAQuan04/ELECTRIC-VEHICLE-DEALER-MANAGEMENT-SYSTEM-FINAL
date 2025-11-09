import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { AuthService } from '@utils';
import { useAuth } from '../../../../context/AuthContext';
import { DEALER_ROLES } from '../../config/permissions';

/**
 * DealerRoleGuard Component
 * Guard component để kiểm tra role của dealer (Staff hoặc Manager)
 * Thay thế cho DealerGuard cũ, hỗ trợ phân quyền chi tiết hơn
 * 
 * @example
 * // Cho phép cả Staff và Manager
 * <DealerRoleGuard>
 *   <VehicleList />
 * </DealerRoleGuard>
 * 
 * @example
 * // Chỉ cho phép Manager
 * <DealerRoleGuard requiredRole="dealer_manager">
 *   <ApproveOrderPage />
 * </DealerRoleGuard>
 * 
 * @example
 * // Cho phép nhiều roles
 * <DealerRoleGuard requiredRoles={['dealer_staff', 'dealer_manager']}>
 *   <CreateQuotationPage />
 * </DealerRoleGuard>
 */
const DealerRoleGuard = ({
  children,
  requiredRole,           // Single role: 'dealer_staff' or 'dealer_manager'
  requiredRoles = [],     // Array of roles
  shopId,                 // Optional: Check shop ownership
  redirectTo = '/dealer/access-denied',
  fallback = null,
}) => {
  const currentUser = AuthService.getCurrentUser();

  // Không có user → redirect to login
  if (!currentUser) {
    console.warn('DealerRoleGuard: No user logged in');
    return <Navigate to="/auth" replace />;
  }

  // Kiểm tra user có phải dealer không
  if (!currentUser.role || !currentUser.role.includes('dealer')) {
    console.warn('DealerRoleGuard: User is not a dealer');
    return <Navigate to="/access-denied" replace />;
  }

  // Lấy dealer role từ user
  const userDealerRole = currentUser.dealerRole || DEALER_ROLES.STAFF; // Default là staff nếu không có

  // Build danh sách roles được phép
  let allowedRoles = [];
  if (requiredRole) {
    allowedRoles = [requiredRole];
  } else if (requiredRoles.length > 0) {
    allowedRoles = requiredRoles;
  } else {
    // Không chỉ định role cụ thể → cho phép tất cả dealer roles
    allowedRoles = Object.values(DEALER_ROLES);
  }

  // Kiểm tra role
  const hasAccess = allowedRoles.includes(userDealerRole);

  if (!hasAccess) {
    console.warn(`DealerRoleGuard: Access denied. Required: [${allowedRoles.join(', ')}], User: ${userDealerRole}`);
    
    if (fallback) {
      return fallback;
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  // Kiểm tra shop ownership nếu có yêu cầu
  if (shopId && currentUser.dealerShopId !== shopId) {
    console.warn(`DealerRoleGuard: Shop access denied. Required shop: ${shopId}, User shop: ${currentUser.dealerShopId}`);
    return <Navigate to="/dealer/access-denied" replace />;
  }

  return children;
};

DealerRoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOf([DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER]),
  requiredRoles: PropTypes.arrayOf(
    PropTypes.oneOf([DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER])
  ),
  shopId: PropTypes.string,
  redirectTo: PropTypes.string,
  fallback: PropTypes.node,
};

/**
 * ManagerOnlyGuard
 * Shortcut guard chỉ cho phép Manager
 */
export const ManagerOnlyGuard = ({ children, ...props }) => (
  <DealerRoleGuard requiredRole={DEALER_ROLES.MANAGER} {...props}>
    {children}
  </DealerRoleGuard>
);

ManagerOnlyGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * StaffAndManagerGuard
 * Shortcut guard cho phép cả Staff và Manager
 */
export const StaffAndManagerGuard = ({ children, ...props }) => (
  <DealerRoleGuard
    requiredRoles={[DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER]}
    {...props}
  >
    {children}
  </DealerRoleGuard>
);

StaffAndManagerGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook để check dealer role
 */
export const useDealerRole = () => {
  const { user } = useAuth();
  
  // Map role từ backend: 'DealerStaff' -> 'dealer_staff', 'DealerManager' -> 'dealer_manager'
  let dealerRole = DEALER_ROLES.STAFF; // Default
  
  if (user?.role === 'DealerManager') {
    dealerRole = DEALER_ROLES.MANAGER;
  } else if (user?.role === 'DealerStaff') {
    dealerRole = DEALER_ROLES.STAFF;
  }
  
  console.log('🎭 useDealerRole:', { userRole: user?.role, dealerRole });

  return {
    isStaff: dealerRole === DEALER_ROLES.STAFF,
    isManager: dealerRole === DEALER_ROLES.MANAGER,
    dealerRole: dealerRole,
    role: dealerRole, // alias
  };
};

/**
 * Component để conditional rendering dựa trên dealer role
 * @example
 * <ForManager>
 *   <ApproveButton />
 * </ForManager>
 * 
 * <ForStaff>
 *   <RequestApprovalButton />
 * </ForStaff>
 */
export const ForManager = ({ children, fallback = null }) => {
  const { isManager } = useDealerRole();
  console.log('👔 ForManager check:', isManager);
  return isManager ? children : fallback;
};

ForManager.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export const ForStaff = ({ children, fallback = null }) => {
  const { isStaff } = useDealerRole();
  console.log('👷 ForStaff check:', isStaff);
  return isStaff ? children : fallback;
};

ForStaff.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export const ForStaffAndManager = ({ children }) => {
  const { user } = useAuth();
  const isDealer = user?.role === 'DealerStaff' || user?.role === 'DealerManager';
  console.log('🤝 ForStaffAndManager check:', isDealer);
  return isDealer ? children : null;
};

ForStaffAndManager.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DealerRoleGuard;
