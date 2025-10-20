import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { USER_ROLES } from '@utils';
import teslaModelSBg from '@assets/tesla/2023-tesla-model-s-scaled.jpg';

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || {};
  const fullFormData = location.state?.formData || {};

  console.log('RegisterSuccess - user:', user);
  console.log('RegisterSuccess - fullFormData:', fullFormData);

  // Get full name from various possible sources
  const getFullName = () => {
    return user.fullName || 
           fullFormData.fullName || 
           'Không có tên';
  };

  // Get username from various possible sources
  const getUsername = () => {
    return user.username || 
           fullFormData.username || 
           'Không có username';
  };

  React.useEffect(() => {
    if (!user || !user.email) {
      navigate('/register');
    }
  }, [user, navigate]);

  const handleEditStep = (stepNumber) => {
    navigate('/register', {
      state: {
        editMode: true,
        targetStep: stepNumber,
        returnToSuccess: true,
        initialData: { ...fullFormData, ...user }
      }
    });
  };

  const handleContinueToDashboard = () => {
    if (user?.role === USER_ROLES.CUSTOMER) {
      navigate('/customer-dashboard');
    } else if (user?.role === USER_ROLES.DEALER) {
      navigate('/dealer-dashboard');
    } else {
      navigate('/');
    }
  };

  if (!user || !user.email) return null;

  return (
    <div className="w-full min-h-screen">
      <div 
        className="fixed inset-0 bg-gray-900 bg-cover bg-center"
        style={{
          backgroundImage: `url(${teslaModelSBg})`,
          zIndex: -2
        }}
      />
      
      <div className="fixed inset-0 bg-black/70" style={{ zIndex: -1 }} />
      
      <div className="relative py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/30">
            <div className="h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
            
            <div className="text-center py-8 px-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="text-2xl font-bold text-white tracking-wider">TESLA</span>
              </div>
              
              <h1 className="text-3xl font-light text-white mb-3 tracking-wide">
                Đăng ký thành công! 🎉
              </h1>
              <p className="text-gray-300 text-lg font-light">
                Chào mừng, {getFullName()}!
              </p>
              <div className="mt-6 w-16 h-0.5 bg-red-600 mx-auto" />
            </div>

            <div className="px-8 pb-8 space-y-8">
              
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Thông tin cơ bản
                  <span className="ml-2 text-sm text-gray-400">(Nhấp để chỉnh sửa)</span>
                </h3>
                
                <div className="space-y-3">
                  <div 
                    className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                    onClick={() => handleEditStep(1)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Tên đăng nhập</span>
                        <div className="text-white font-medium">{getUsername()}</div>
                      </div>
                    </div>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>

                  <div 
                    className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                    onClick={() => handleEditStep(1)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Họ và tên</span>
                        <div className="text-white font-medium">{getFullName()}</div>
                      </div>
                    </div>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                    onClick={() => handleEditStep(1)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Email</span>
                        <div className="text-white font-medium">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                    onClick={() => handleEditStep(1)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Vai trò</span>
                        <div className="text-white font-medium">
                          {user.role === USER_ROLES.CUSTOMER ? 'Khách hàng' : 'Đại lý'}
                        </div>
                      </div>
                    </div>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Thông tin cá nhân
                  <span className="ml-2 text-sm text-gray-400">(Nhấp để chỉnh sửa)</span>
                </h3>
                
                <div className="space-y-3">
                  <div 
                    className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                    onClick={() => handleEditStep(3)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Số điện thoại</span>
                        <div className="text-white font-medium">{user.phone || fullFormData.phone || 'Chưa cập nhật'}</div>
                      </div>
                    </div>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                    onClick={() => handleEditStep(3)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Ngày sinh</span>
                        <div className="text-white font-medium">{user.dateOfBirth || fullFormData.dateOfBirth || 'Chưa cập nhật'}</div>
                      </div>
                    </div>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                    onClick={() => handleEditStep(3)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v1H8V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Giới tính</span>
                        <div className="text-white font-medium">
                          {(user.gender || fullFormData.gender) === 'male' ? 'Nam' :
                           (user.gender || fullFormData.gender) === 'female' ? 'Nữ' :
                           (user.gender || fullFormData.gender) === 'other' ? 'Khác' : 'Chưa cập nhật'}
                        </div>
                      </div>
                    </div>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                    onClick={() => handleEditStep(3)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Địa chỉ</span>
                        <div className="text-white font-medium">
                          {(user.address || fullFormData.address) && 
                           (user.wardName || fullFormData.wardName) && 
                           (user.provinceName || fullFormData.provinceName) 
                            ? `${user.address || fullFormData.address}, ${user.wardName || fullFormData.wardName}, ${user.provinceName || fullFormData.provinceName}`
                            : 'Chưa cập nhật'}
                        </div>
                      </div>
                    </div>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Survey Information Section */}
              {(user.interestedVehicles || fullFormData.interestedVehicles || 
                user.budgetRange || fullFormData.budgetRange || 
                user.purchaseTimeframe || fullFormData.purchaseTimeframe) && (
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Khảo sát nhu cầu
                    <span className="ml-2 text-sm text-gray-400">(Nhấp để chỉnh sửa)</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {((user.interestedVehicles && user.interestedVehicles.length > 0) || 
                      (fullFormData.interestedVehicles && fullFormData.interestedVehicles.length > 0)) && (
                      <div 
                        className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                        onClick={() => handleEditStep(4)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Xe quan tâm</span>
                            <div className="text-white font-medium">
                              {(user.interestedVehicles || fullFormData.interestedVehicles)?.join(', ') || 'Chưa cập nhật'}
                            </div>
                          </div>
                        </div>
                        <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {(user.budgetRange || fullFormData.budgetRange) && (
                      <div 
                        className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                        onClick={() => handleEditStep(4)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Ngân sách dự kiến</span>
                            <div className="text-white font-medium">{user.budgetRange || fullFormData.budgetRange}</div>
                          </div>
                        </div>
                        <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {(user.purchaseTimeframe || fullFormData.purchaseTimeframe) && (
                      <div 
                        className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                        onClick={() => handleEditStep(4)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Thời gian mua xe</span>
                            <div className="text-white font-medium">{user.purchaseTimeframe || fullFormData.purchaseTimeframe}</div>
                          </div>
                        </div>
                        <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Khám phá Tesla
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-600"
                >
                  Đăng nhập ngay
                </button>
              </div>

              {/* Info Note */}
              <div className="mt-8 p-4 bg-blue-900/30 rounded-xl border border-blue-500/30">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-200 text-sm">
                    💡 Nhấp vào bất kỳ thông tin nào để chỉnh sửa. Bạn sẽ được đưa về bước tương ứng để cập nhật.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess; 
