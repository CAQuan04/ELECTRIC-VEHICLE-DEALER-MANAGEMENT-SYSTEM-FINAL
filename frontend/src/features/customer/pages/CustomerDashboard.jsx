import React, { useState, useEffect } from 'react';
import { AuthService, CustomerService } from '@utils';
import { usePageLoading } from '@modules/loading';
import '@modules/loading/GlobalLoading.css';
import NavigationPills from '../components/NavigationPills';
import FinancingSection from '../components/FinancingSection';
// Simple error component
const ErrorMessage = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4">
      <div className="text-6xl mb-4">❌</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Đã xảy ra lỗi</h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button 
        onClick={onRetry} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Thử lại
      </button>
    </div>
  </div>
);

const CustomerDashboard = () => {
  const { startLoading, stopLoading, isLoading } = usePageLoading();
  
  const [activeSection, setActiveSection] = useState('overview');
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('customer_001');
  const currentUser = AuthService.getCurrentUser();



  const testCustomers = {
    'customer_001': 'Nguyễn Văn An (Gold)',
    'customer_002': 'Trần Thị Bình (Diamond)', 
    'customer_003': 'Lê Minh Châu (Platinum)',
    'customer_004': 'Phạm Văn Đức (Silver)',
    'customer_005': 'Hoàng Thị Ê (Bronze)'
  };

  // Membership level configuration with colors and gradients
  const getMembershipConfig = (level) => {
    const configs = {
      'Diamond': {
        gradient: 'from-cyan-600 via-blue-600 to-purple-700',
        lightColor: 'text-cyan-100',
        emoji: '💎',
        title: 'Diamond Elite'
      },
      'Platinum': {
        gradient: 'from-gray-300 via-gray-400 to-gray-600',
        lightColor: 'text-gray-100',
        emoji: '🏆',
        title: 'Platinum Premium'
      },
      'Gold': {
        gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
        lightColor: 'text-yellow-100',
        emoji: '🥇',
        title: 'Gold Member'
      },
      'Silver': {
        gradient: 'from-gray-400 via-gray-500 to-gray-600',
        lightColor: 'text-gray-100',
        emoji: '🥈',
        title: 'Silver Member'
      },
      'Bronze': {
        gradient: 'from-orange-400 via-orange-500 to-orange-600',
        lightColor: 'text-orange-100',
        emoji: '🥉',
        title: 'Bronze Member'
      }
    };
    
    // Default to Gold if level not found
    return configs[level] || configs['Gold'];
  };

  // Get user membership level from API data
  const userMembershipLevel = customerData?.overview?.membershipLevel || customerData?.overview?.profile?.membershipLevel || 'Gold';
  const membershipConfig = getMembershipConfig(userMembershipLevel);
  const profile = customerData?.overview?.profile;

  // Fetch customer data from Complete Mock API
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        startLoading('Đang tải dữ liệu khách hàng...');
        setError(null);
        
        // Get customer ID from currentUser or use selected test customer
        const customerId = selectedCustomerId || currentUser?.id || 'customer_001';
        
        // Fetch all customer data using new API service
        const [profileResult, ordersResult, analyticsResult, loyaltyResult] = await Promise.all([
          CustomerService.getMyProfile(customerId),
          CustomerService.getMyOrders(customerId),
          CustomerService.getMyProfile(customerId), // Analytics from profile
          CustomerService.getMyProfile(customerId)  // Loyalty from profile
        ]);
        
        if (profileResult.success && analyticsResult.success) {
          setCustomerData({
            profile: profileResult.data,
            orders: ordersResult.success ? ordersResult.data : [],
            analytics: analyticsResult.data,
            loyalty: loyaltyResult.success ? loyaltyResult.data : {},
            // Map to old structure for compatibility
            overview: {
              profile: profileResult.data,
              membershipLevel: profileResult.data.customerInfo?.membershipLevel,
              totalVehicles: analyticsResult.data.vehicleCount || 0,
              pendingServices: 1,
              loyaltyPoints: profileResult.data.customerInfo?.loyaltyPoints || 0
            },
            vehicles: [], // Will be populated separately if needed
            financing: {
              loans: [] // Will be populated from orders if needed
            }
          });
        } else {
          setError(profileResult.error || analyticsResult.error || 'Không thể tải dữ liệu');
        }
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Lỗi kết nối: ' + err.message);
      } finally {
        stopLoading();
      }
    };

    fetchCustomerData();
  }, [currentUser, selectedCustomerId]); // Added selectedCustomerId dependency

  // Check URL parameters to set active section
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, []);

  // Show error message if something went wrong
  if (error) {
    return (
      <ErrorMessage 
        error={error} 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section - Dynamic colors based on membership level */}
      <div className={`bg-gradient-to-r ${membershipConfig.gradient} text-white p-8 shadow-lg relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                🚗 Chào mừng, {profile?.name || currentUser?.name || 'Khách hàng'}!
              </h1>
              <p className={`${membershipConfig.lightColor} text-lg`}>Chúc bạn có một ngày tốt lành!</p>
            </div>
            
            {/* Membership Badge */}
            <div className="hidden md:flex flex-col items-center">
              <div className="text-4xl mb-2">{membershipConfig.emoji}</div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white font-bold text-sm">{membershipConfig.title}</span>
              </div>
            </div>
          </div>
          
          {/* Mobile membership badge */}
          <div className="md:hidden mt-4 flex items-center gap-2">
            <span className="text-2xl">{membershipConfig.emoji}</span>
            <span className={`${membershipConfig.lightColor} font-medium`}>{membershipConfig.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <NavigationPills 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="mt-8 pb-8">
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <div className="text-3xl font-bold mb-2">{customerData?.overview?.totalVehicles || 0}</div>
                    <div className="text-blue-100 text-sm">Xe sở hữu</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <div className="text-3xl font-bold mb-2">{customerData?.overview?.pendingServices || 0}</div>
                    <div className="text-green-100 text-sm">Dịch vụ đang chờ</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <div className="text-3xl font-bold mb-2">{customerData?.financing?.loans?.length || 0}</div>
                    <div className="text-purple-100 text-sm">Khoản vay</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <div className="text-3xl font-bold mb-2">{profile?.loyaltyPoints || 0}</div>
                    <div className="text-orange-100 text-sm">Điểm tích lũy</div>
                  </div>
                </div>
              </div>

              {/* Account Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    📊 Tổng quan tài khoản
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Ngày tham gia</span>
                      <span className="font-medium">{profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString('vi-VN') : '15/03/2023'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Hạng thành viên</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{membershipConfig.emoji}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userMembershipLevel === 'Diamond' ? 'bg-cyan-100 text-cyan-700' :
                          userMembershipLevel === 'Platinum' ? 'bg-gray-100 text-gray-700' :
                          userMembershipLevel === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                          userMembershipLevel === 'Silver' ? 'bg-gray-100 text-gray-600' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {userMembershipLevel}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Điểm tích lũy</span>
                      <span className="font-medium">{profile?.loyaltyPoints?.toLocaleString('vi-VN') || '2,450'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Tổng chi tiêu</span>
                      <span className="font-medium text-green-600">{profile?.totalSpent ? `${(profile.totalSpent / 1000000000).toFixed(1)} tỷ VND` : '2.5 tỷ VND'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Ưu đãi có sẵn</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {customerData?.overview?.membershipBenefits?.freeUpgrades || 0} ưu đãi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    🔔 Thông báo gần đây
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Lịch bảo dưỡng sắp tới</p>
                        <p className="text-xs text-gray-600">Model 3 của bạn cần bảo dưỡng trong 5 ngày</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Cập nhật phần mềm</p>
                        <p className="text-xs text-gray-600">Phiên bản mới có sẵn cho xe của bạn</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Thanh toán sắp đến hạn</p>
                        <p className="text-xs text-gray-600">Kỳ thanh toán tiếp theo vào 28/10/2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        
        {activeSection === 'vehicles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🚗</span>
                <h2 className="text-2xl font-bold text-gray-800">Xe của tôi</h2>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {customerData?.vehicles?.length || 0} xe
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {customerData?.vehicles?.map((vehicle, index) => (
                  <div key={vehicle.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{vehicle.model}</h3>
                        <p className="text-gray-600">{vehicle.variant} {vehicle.year}</p>
                        <p className="text-sm text-gray-500">{vehicle.color}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        vehicle.status === 'active' ? 'bg-green-100 text-green-700' :
                        vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {vehicle.status === 'active' ? 'Hoạt động' : 
                         vehicle.status === 'maintenance' ? 'Bảo dưỡng' : 'Không hoạt động'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Năm sản xuất</p>
                        <p className="font-medium">{vehicle.year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Số km đã đi</p>
                        <p className="font-medium">{vehicle.mileage?.toLocaleString('vi-VN')} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pin</p>
                        <p className="font-medium">{vehicle.batteryLevel}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phạm vi</p>
                        <p className="font-medium text-blue-600">{vehicle.range} km</p>
                      </div>
                    </div>

                    {/* Vehicle Features */}
                    {vehicle.features && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Tính năng:</p>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.map((feature, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Chi tiết
                      </button>
                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                        {vehicle.status === 'maintenance' ? 'Theo dõi' : 'Điều khiển'}
                      </button>
                    </div>
                  </div>
                )) || (
                  <div className="col-span-2 text-center py-8">
                    <div className="text-4xl mb-2">🚗</div>
                    <p className="text-gray-500">Chưa có xe nào được đăng ký</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'services' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🔧</span>
                <h2 className="text-2xl font-bold text-gray-800">Dịch vụ & Bảo dưỡng</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Service 1 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">🔧</div>
                    <h3 className="text-lg font-bold text-gray-800">Bảo dưỡng định kỳ</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">• Kiểm tra hệ thống pin</p>
                    <p className="text-sm text-gray-600">• Bảo dưỡng phanh</p>
                    <p className="text-sm text-gray-600">• Cập nhật phần mềm</p>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Đặt lịch
                  </button>
                </div>

                {/* Service 2 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">🛡️</div>
                    <h3 className="text-lg font-bold text-gray-800">Bảo hành</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">• Bảo hành pin: 8 năm</p>
                    <p className="text-sm text-gray-600">• Bảo hành xe: 4 năm</p>
                    <p className="text-sm text-gray-600">• Hỗ trợ 24/7</p>
                  </div>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Xem chi tiết
                  </button>
                </div>

                {/* Service 3 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">📞</div>
                    <h3 className="text-lg font-bold text-gray-800">Hỗ trợ khẩn cấp</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">• Cứu hộ 24/7</p>
                    <p className="text-sm text-gray-600">• Hỗ trợ từ xa</p>
                    <p className="text-sm text-gray-600">• Tư vấn kỹ thuật</p>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Liên hệ ngay
                  </button>
                </div>
              </div>
              
              {/* Service History */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Lịch sử dịch vụ</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Bảo dưỡng định kỳ - Tesla Model Y</p>
                      <p className="text-sm text-gray-600">15/09/2025</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Hoàn thành
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Cập nhật phần mềm - Tesla Model 3</p>
                      <p className="text-sm text-gray-600">28/08/2025</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Hoàn thành
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Kiểm tra pin - Tesla Model 3</p>
                      <p className="text-sm text-gray-600">10/07/2025</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Hoàn thành
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'financing' && (
          <FinancingSection 
            data={customerData}
            loading={loading}
            onMakePayment={(loan) => {
              console.log('Make payment for loan:', loan);
              // Handle payment logic here
            }}
            onViewDetails={(loan) => {
              console.log('View details for loan:', loan);
              // Handle view details logic here
            }}
          />
        )}
      </div>
    </div>
  </div>
);
};

export default CustomerDashboard; 
