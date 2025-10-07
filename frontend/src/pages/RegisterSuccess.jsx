import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center relative">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-pulse opacity-30"></div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Chúc mừng! 🎉
          </h1>
          
          <p className="text-xl text-gray-300 mb-2">
            Tài khoản đã được tạo thành công
          </p>
          
          {userData?.fullName && (
            <p className="text-blue-400 font-semibold text-lg">
              Chào mừng {userData.fullName}!
            </p>
          )}
        </div>

        {/* Success Details */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Thông tin tài khoản
          </h3>
          
          <div className="space-y-3">
            {userData?.email && (
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{userData.email}</span>
              </div>
            )}
            
            {userData?.username && (
              <div className="flex justify-between">
                <span className="text-gray-400">Tên đăng nhập:</span>
                <span className="text-white">{userData.username}</span>
              </div>
            )}
            
            {userData?.role && (
              <div className="flex justify-between">
                <span className="text-gray-400">Vai trò:</span>
                <span className="text-white">
                  {userData.role === 'customer' ? 'Khách hàng' : 'Đại lý'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-blue-800">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">
            Bước tiếp theo
          </h3>
          
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Kiểm tra email xác thực
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">→</span>
              Khám phá bảng điều khiển
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">→</span>
              Tìm hiểu các tính năng
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Vào bảng điều khiển
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            Tự động chuyển hướng sau 5 giây...
          </p>
        </div>

        {/* Tesla Branding */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Powered by EVM System
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
