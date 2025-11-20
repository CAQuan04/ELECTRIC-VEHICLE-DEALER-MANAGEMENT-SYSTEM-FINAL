import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthService } from '@utils';
import { dealerAPI } from '@utils/api/services';
import { usePageLoading } from '@modules/loading';
import { notifications } from '@utils/notifications';
import '@modules/loading/GlobalLoading.css';
import {
  BarChart3,
  Car,
  ClipboardList,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';

// Import role guards
import { useDealerRole } from '../components/auth/DealerRoleGuard';

// Import PageContainer for theme support
import PageContainer from '../components/layout/PageContainer';
import ReportsSection from '../components/ReportsSection';

// Import sections
import {
  OverviewSection,
  InventorySection,
  OrdersSection,
  CustomersSection
} from './DealerDashboard/sections';

// Import components
import HeroStats from './DealerDashboard/components/HeroStats';

const NAV_SECTIONS = [
  { id: 'overview', icon: BarChart3, label: 'Tổng quan' },
  { id: 'inventory', icon: Car, label: 'Kho xe' },
  { id: 'orders', icon: ClipboardList, label: 'Đơn hàng' },
  { id: 'customers', icon: Users, label: 'Khách hàng' },
  { id: 'reports', icon: TrendingUp, label: 'Báo cáo' }
];

// --- MAIN COMPONENT ---

const DealerDashboard = () => {
  console.log('🏢 DealerDashboard component render');
  
  const navigate = useNavigate();
  const { dealerId } = useParams(); // Lấy dealerId từ URL
  const { startLoading, stopLoading } = usePageLoading();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const currentUser = AuthService.getCurrentUser();
  const { dealerRole, isManager, isStaff } = useDealerRole();

  // Log dealerId from URL
  console.log('📍 DealerId from URL:', dealerId);
  console.log('👤 Current User dealerId:', currentUser?.dealerId);

  const loadDashboardData = useCallback(async () => {
    try {
      startLoading('Đang tải dữ liệu đại lý...');
      
      // Lấy dealerId từ URL hoặc currentUser
      const currentDealerId = dealerId || currentUser?.dealerId;
      
      // Fetch dealer info và dashboard stats song song
      const [dealerInfoResult, dashboardResult] = await Promise.all([
        currentDealerId 
          ? dealerAPI.getDealerById(currentDealerId) 
          : dealerAPI.getDealerProfile(), // Fallback: lấy profile của user hiện tại
        dealerAPI.getDashboard()
      ]);
      
      console.log('📊 Dealer Info Result:', dealerInfoResult);
      console.log('📊 Dashboard Result:', dashboardResult);
      
      // Tạo dealer data từ kết quả API hoặc từ currentUser/dashboard
      let dealerData;
      if (dealerInfoResult.success && dealerInfoResult.data) {
        dealerData = dealerInfoResult.data;
        console.log('✅ Using dealer data from getDealerById API');
      } else if (dashboardResult.success && dashboardResult.data?.dealer) {
        // Nếu có dealer info từ dashboard API
        dealerData = dashboardResult.data.dealer;
        console.log('✅ Using dealer data from Dashboard API');
      } else {
        // Fallback: tạo từ currentUser
        dealerData = {
          dealerId: currentDealerId,
          name: `Đại lý #${currentDealerId}`,
          dealerName: `Đại lý #${currentDealerId}`,
          address: 'Chưa có thông tin',
          phone: 'Chưa có thông tin',
          email: 'Chưa có thông tin',
          totalVehicles: 0,
          totalOrders: 0,
          totalUsers: 0
        };
        console.warn('⚠️ Using fallback dealer data');
      }
      
      console.log('🏢 Final Dealer Data:', dealerData);
      console.log('🏷️ Dealer Name:', dealerData?.dealerName || dealerData?.name);
      
      // Tạo dashboard data - luôn có dữ liệu cơ bản
      const data = {
        dealer: dealerData,
        performance: dashboardResult.success ? dashboardResult.data?.performance : {
          monthlySales: 0,
          quarterTarget: 0,
          customerSatisfaction: 0,
          deliveryTime: 0
        },
        recentOrders: dashboardResult.success ? dashboardResult.data?.recentOrders || [] : [],
        inventory: dashboardResult.success ? dashboardResult.data?.inventory || [] : []
      };
      
      setDashboardData(data);
      
      // Chỉ hiện thông báo lỗi, không block UI
      if (!dashboardResult.success) {
        console.warn('⚠️ Dashboard API failed:', dashboardResult.message);
      }
    } catch (err) {
      console.error('❌ Dealer Dashboard error:', err);
      
      // Vẫn tạo dữ liệu cơ bản để hiển thị
      const fallbackData = {
        dealer: {
          dealerId: dealerId || currentUser?.dealerId,
          name: currentUser?.name ? `Đại lý của ${currentUser.name}` : 'Đại lý',
          dealerName: currentUser?.name ? `Đại lý của ${currentUser.name}` : 'Đại lý',
          address: 'Chưa có thông tin',
          phone: 'Chưa có thông tin',
          email: 'Chưa có thông tin'
        },
        performance: {
          monthlySales: 0,
          quarterTarget: 0,
          customerSatisfaction: 0,
          deliveryTime: 0
        },
        recentOrders: [],
        inventory: []
      };
      
      setDashboardData(fallbackData);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, currentUser, dealerId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  console.log('📊 Dashboard data:', dashboardData);
  
  if (!dashboardData) {
    console.log('⏳ Waiting for dashboard data...');
    return null; // Global loading handles the visual feedback
  }

  const { dealer, inventory } = dashboardData;

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection dashboardData={dashboardData} navigate={navigate} />;
      case 'inventory':
        return <InventorySection inventory={inventory} />;
      case 'orders':
        return <OrdersSection navigate={navigate} />;
      case 'customers':
        return <CustomersSection navigate={navigate} />;
      case 'reports':
        // Manager-only section
        if (!isManager) {
          return (
            <div className="text-center py-20 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl border-2 border-red-300 dark:border-red-500/30 shadow-lg">
              <Shield className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-4">
                Quyền truy cập bị hạn chế
              </h2>
              <p className="text-red-600 dark:text-red-300 font-medium mb-6">
                Chỉ Quản lý Đại Lý mới có quyền xem báo cáo
              </p>
              <button 
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => setActiveSection('overview')}
              >
                ← Quay lại tổng quan
              </button>
            </div>
          );
        }
        return <ReportsSection />;
      default:
        return <OverviewSection dashboardData={dashboardData} navigate={navigate} />;
    }
  };

  return (
    <PageContainer>
      
      {/* Hero Section - Redesigned with theme support */}
      <div className="relative overflow-hidden dark:bg-gradient-to-br dark:from-gray-900/95 dark:via-gray-800/90 dark:to-emerald-900/80 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-3xl p-6 md:p-12 mb-8 shadow-2xl dark:shadow-emerald-500/20 shadow-cyan-500/30 border dark:border-emerald-500/30 border-cyan-400/50 backdrop-blur-xl">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white dark:bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 dark:bg-emerald-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/30 dark:bg-emerald-500/20 rounded-2xl backdrop-blur-sm border border-white/50 dark:border-emerald-400/30 shadow-lg">
              <span className="text-4xl md:text-5xl">🏢</span>
            </div>
            <div className="flex-1">
              {/* Tên đại lý nổi bật */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl mb-1">
                {dealer?.name || dealer?.dealerName || 'Dealer Dashboard'}
              </h1>
              {dealer?.address && (
                <p className="text-sm md:text-base text-white/90 font-medium mb-1 flex items-center gap-2">
                  <span>📍</span>
                  <span>{dealer.address}</span>
                </p>
              )}
              <p className="text-xs md:text-sm text-white/70 font-medium">
                Mã đại lý: {dealer?.dealerId || dealerId || currentUser?.dealerId || 'N/A'}
              </p>
              <div className="h-1 w-32 dark:bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-600 bg-gradient-to-r from-white to-cyan-200 rounded-full mt-2 shadow-lg"></div>
            </div>
          </div>
          
          {/* Thông tin người dùng và vai trò */}
          <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/40 dark:border-emerald-400/30 shadow-lg">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-xs text-white/70 font-medium">Người dùng</p>
                  <p className="text-lg font-bold text-white">{currentUser?.name || 'Chưa xác định'}</p>
                </div>
              </div>
              
              <div className="h-8 w-px bg-white/30"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl">{isManager ? '👔' : '🧑‍💼'}</span>
                <div>
                  <p className="text-xs text-white/70 font-medium">Vai trò</p>
                  <p className="text-lg font-bold text-white">
                    {isManager ? 'Quản lý Đại lý' : isStaff ? 'Nhân viên Đại lý' : currentUser?.role || 'Chưa xác định'}
                  </p>
                </div>
              </div>
              
              {currentUser?.email && (
                <>
                  <div className="h-8 w-px bg-white/30"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="text-xs text-white/70 font-medium">Email</p>
                      <p className="text-sm font-semibold text-white">{currentUser.email}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Thông tin Đại lý (nếu có) */}
          {dealer && (dealer.address || dealer.phone || dealer.email) && (
            <div className="bg-white/15 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 mb-8 border border-white/30 dark:border-emerald-400/20 shadow-lg">
              <div className="flex items-center gap-3 flex-wrap">
                {dealer.address && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    <div>
                      <p className="text-xs text-white/70 font-medium">Địa chỉ</p>
                      <p className="text-sm font-semibold text-white">{dealer.address}</p>
                    </div>
                  </div>
                )}
                
                {dealer.phone && dealer.address && <div className="h-8 w-px bg-white/30"></div>}
                
                {dealer.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📞</span>
                    <div>
                      <p className="text-xs text-white/70 font-medium">Điện thoại</p>
                      <p className="text-sm font-semibold text-white">{dealer.phone}</p>
                    </div>
                  </div>
                )}
                
                {dealer.email && (dealer.address || dealer.phone) && <div className="h-8 w-px bg-white/30"></div>}
                
                {dealer.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✉️</span>
                    <div>
                      <p className="text-xs text-white/70 font-medium">Email liên hệ</p>
                      <p className="text-sm font-semibold text-white">{dealer.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <HeroStats dashboardData={dashboardData} />
        </div>
      </div>

      {/* Navigation Pills - Modern Glass Design */}
      <div className="relative mb-8">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 dark:from-emerald-500/10 dark:via-indigo-500/10 dark:to-fuchsia-500/10 rounded-3xl blur-xl"></div>
        
        <div className="relative flex flex-wrap gap-3 p-3 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-lg">
          {NAV_SECTIONS.map((section) => {
            const IconComponent = section.icon;
            
            // Reports section is manager-only
            if (section.id === 'reports' && !isManager) {
              return (
                <div
                  key={section.id}
                  className="group relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold border-2 border-dashed border-red-300/50 dark:border-red-500/30 bg-red-50/50 dark:bg-red-950/20 text-red-400 dark:text-red-500 cursor-not-allowed backdrop-blur-sm transition-all duration-300"
                  title="Chỉ Quản lý mới có quyền truy cập"
                >
                  <Shield className="w-5 h-5 animate-pulse" />
                  <IconComponent className="w-5 h-5 opacity-50" />
                  <span className="opacity-60">{section.label}</span>
                  <span className="absolute -top-2 -right-2 flex items-center gap-1 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs px-2.5 py-1 rounded-full font-extrabold shadow-lg shadow-red-500/50 animate-bounce">
                    <Shield className="w-3 h-3" />
                    <span>Khóa</span>
                  </span>
                </div>
              );
            }
            
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                className={`group relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 border-2 backdrop-blur-sm overflow-hidden border-none ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-slate-700 dark:to-gray-600 text-white border-cyan-400/80 dark:border-rose-400/80 shadow-xl shadow-cyan-500/40 dark:shadow-emerald-500/40 scale-105 translate-y-[-2px]'
                    : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-white/10 hover:bg-cyan-50/80 dark:hover:bg-white/10 hover:scale-105 hover:translate-y-[-2px] hover:border-cyan-400/60 dark:hover:border-emerald-400/40 hover:shadow-lg hover:shadow-cyan-500/20 dark:hover:shadow-slate-500/20'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {/* Active Indicator - Animated Gradient Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-500/20 to-purple-500/20 dark:from-slate-400/20 dark:via-purple-500/20 dark:to-sky-500/20 animate-pulse"></div>
                )}
                
                {/* Icon with Animation */}
                <IconComponent className={`w-5 h-5 relative z-10 transition-transform duration-300 ${
                  isActive 
                    ? 'scale-110 drop-shadow-lg' 
                    : 'group-hover:scale-110 group-hover:rotate-12'
                }`} />
                
                {/* Label */}
                <span className={`relative z-10 transition-all duration-300 ${
                  isActive 
                    ? 'drop-shadow-md' 
                    : 'group-hover:tracking-wide'
                }`}>
                  {section.label}
                </span>
                
                {/* Active Dot Indicator */}
                {isActive && (
                  <span className="relative z-10 flex h-2.5 w-2.5 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-lg"></span>
                  </span>
                )}
                
                {/* Shine Effect on Hover */}
                {!isActive && (
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Section */}
      {renderActiveSection()}

    </PageContainer>
  );
};

export default DealerDashboard;