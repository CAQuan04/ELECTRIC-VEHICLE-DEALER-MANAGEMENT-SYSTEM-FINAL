import { useState, useEffect } from 'react';
import { AuthService, USER_ROLES } from '../utils/auth';

/**
 * Custom hook để lấy số lượng notifications cho từng menu item
 * Trả về object với key là path và value là số lượng notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState({});
  const [loading, setLoading] = useState(true);
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role;

  const fetchNotifications = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // API endpoints dựa theo role
      const apiCalls = [];
      
      switch (userRole) {
        case USER_ROLES.DEALER:
          apiCalls.push(
            // Lấy số đơn hàng pending
            fetch('/api/dealer/orders?status=pending', {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`
              }
            }).then(res => res.json()).then(data => ({
              path: '/dealer/orders',
              count: data?.totalPending || 0
            })),
            
            // Lấy số sản phẩm sắp hết hàng
            fetch('/api/dealer/inventory/low-stock', {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`
              }
            }).then(res => res.json()).then(data => ({
              path: '/dealer/inventory',
              count: data?.lowStockCount || 0
            })),
            
            // Lấy test drives cần xác nhận
            fetch('/api/dealer/test-drives?status=pending', {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`
              }
            }).then(res => res.json()).then(data => ({
              path: '/dealer/test-drives',
              count: data?.pendingCount || 0
            }))
          );
          break;

        case USER_ROLES.CUSTOMER:
          apiCalls.push(
            // Lấy số đơn hàng đang xử lý
            fetch('/api/customer/orders?status=processing', {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`
              }
            }).then(res => res.json()).then(data => ({
              path: '/customer/orders',
              count: data?.processingCount || 0
            })),
            
            // Lấy test drives upcoming
            fetch('/api/customer/test-drives?status=upcoming', {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`
              }
            }).then(res => res.json()).then(data => ({
              path: '/customer/test-drives',
              count: data?.upcomingCount || 0
            }))
          );
          break;

        case USER_ROLES.EVM_ADMIN:
          apiCalls.push(
            // Lấy số đại lý pending approval
            fetch('/api/admin/dealers?status=pending', {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`
              }
            }).then(res => res.json()).then(data => ({
              path: '/admin/dealers',
              count: data?.pendingCount || 0
            })),
            
            // Lấy số users cần review
            fetch('/api/admin/users?status=pending-review', {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`
              }
            }).then(res => res.json()).then(data => ({
              path: '/admin/users',
              count: data?.pendingReviewCount || 0
            })),
            
            // Lấy inventory alerts
            fetch('/api/admin/inventory/alerts', {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`
              }
            }).then(res => res.json()).then(data => ({
              path: '/admin/inventory',
              count: data?.alertCount || 0
            }))
          );
          break;

        default:
          break;
      }

      // Fetch tất cả notifications
      const results = await Promise.allSettled(apiCalls);
      
      // Xử lý kết quả
      const notificationMap = {};
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          notificationMap[result.value.path] = result.value.count;
        }
      });

      setNotifications(notificationMap);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback về 0 notifications nếu có lỗi
      setNotifications({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Refresh notifications mỗi 60 giây
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, [currentUser, userRole]);

  /**
   * Function để đánh dấu notifications đã đọc cho một path cụ thể
   * Đơn giản chỉ xóa local notification sau 1 giây
   */
  const markAsRead = async (path) => {
    if (!path) return;

    // Đợi 1 giây rồi xóa notification
    setTimeout(() => {
      setNotifications(prev => ({
        ...prev,
        [path]: 0
      }));
    }, 1000);
  };

  /**
   * Function để refresh notifications manually
   */
  const refresh = () => {
    fetchNotifications();
  };

  return { notifications, loading, markAsRead, refresh };
};

/**
 * Hook đơn giản hơn để get notification count cho một path cụ thể
 */
export const useNotificationCount = (path) => {
  const { notifications, loading } = useNotifications();
  return { count: notifications[path] || 0, loading };
};
