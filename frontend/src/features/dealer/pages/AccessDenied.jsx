import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useDealerRole } from '../components/auth/DealerRoleGuard';

/**
 * AccessDenied Page
 * Trang hiển thị khi user không có quyền truy cập
 * Route: /dealer/access-denied
 */
const AccessDenied = () => {
  const navigate = useNavigate();
  const { role, isStaff, isManager } = useDealerRole();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dealer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-6">
              <ShieldAlert className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không có quyền truy cập
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {isStaff && (
              <>
                Bạn đang đăng nhập với quyền <span className="font-semibold text-blue-600">Nhân viên</span>.
                <br />
                Tính năng này chỉ dành cho <span className="font-semibold">Quản lý</span>.
              </>
            )}
            {isManager && (
              <>
                Bạn không có quyền truy cập trang này.
                <br />
                Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.
              </>
            )}
            {!isStaff && !isManager && (
              <>
                Bạn không có quyền truy cập trang này.
                <br />
                Role hiện tại: <span className="font-mono text-sm">{role || 'Không xác định'}</span>
              </>
            )}
          </p>

          {/* Role badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-6 bg-gray-100 text-gray-700">
            Quyền: {isStaff ? 'Nhân viên' : isManager ? 'Quản lý' : role || 'Không xác định'}
          </div>

          {/* Suggestions for Staff */}
          {isStaff && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">
                Các tính năng bạn có thể sử dụng:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Xem và so sánh xe</li>
                <li>• Tạo báo giá cho khách hàng</li>
                <li>• Tạo đơn hàng (chờ duyệt)</li>
                <li>• Quản lý hồ sơ khách hàng</li>
                <li>• Lên lịch lái thử</li>
                <li>• Xem báo cáo bán hàng</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </button>
          </div>

          {/* Contact support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Cần nâng cấp quyền?{' '}
              <a
                href="mailto:support@evdealer.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Liên hệ quản lý
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
