import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthService } from '@utils';
import { dealerAPI } from '@/utils/api/services/dealer.api.js'; 
import { usePageLoading } from '@modules/loading';
import { notifications } from '@utils/notifications';
import '@modules/loading/GlobalLoading.css';
import {
  BarChart3,
  Car,
  ClipboardList,
  Users,
  TrendingUp,
  Shield,
  MapPin,
  Phone,
  Mail,
  Building2,
  UserCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Package } from 'lucide-react';
import BentoMenu from '../components/BentoMenu';
import QuickActions from './DealerDashboard/components/QuickActions';

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

// ==================== MOCK DATA & HELPER (ĐỊNH NGHĨA TRỰC TIẾP TẠI ĐÂY) ====================
const MOCK_DEALERS = [
  {
    dealerId: 2,
    name: "VinFast Sài Gòn",
    address: "Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh",
    phone: "0987654321",
    email: "contact@vinfastsaigon.vn",
    representativeName: "Nguyễn Văn A",
    status: "Active"
  },
  {
    dealerId: 3,
    name: "Đại lý Sài Gòn",
    address: "456 Nguyễn Huệ, TPHCM",
    phone: "0987654321",
    email: "sales@dailysaigon.com",
    representativeName: "Trần Thị B",
    status: "Active"
  },
  {
    dealerId: 4,
    name: "Đại lý A - Hà Nội",
    address: "55 Tràng Tiền, Hà Nội",
    phone: "02411112222",
    email: "info@dailyhanoi-a.vn",
    representativeName: "Lê Văn C",
    status: "Active"
  },
  {
    dealerId: 5,
    name: "Đại lý B - TPHCM",
    address: "22 Nguyễn Huệ, Quận 1, TPHCM",
    phone: "02833334444",
    email: "support@dailyhcm-b.vn",
    representativeName: "Phạm Thị D",
    status: "Inactive"
  }
];

const getMockDealerById = (id) => {
  if (!id) return null;
  return MOCK_DEALERS.find(d => d.dealerId.toString() === id.toString()) || null;
};
// ===========================================================================================

const NAV_SECTIONS = [
  { id: 'overview', icon: BarChart3, label: 'Tổng quan' },
  { id: 'inventory', icon: Car, label: 'Kho xe' },
  { id: 'orders', icon: ClipboardList, label: 'Đơn hàng' },
  { id: 'customers', icon: Users, label: 'Khách hàng' },
  { id: 'reports', icon: TrendingUp, label: 'Báo cáo' }
];

const DealerDashboard = () => {
  const navigate = useNavigate();
  const { dealerId } = useParams();
  const { startLoading, stopLoading } = usePageLoading();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const { user: currentUser } = AuthService; 
  const { isManager } = useDealerRole();

  const loadDashboardData = useCallback(async () => {
    try {
      // Lấy dealerId hiện tại
      const currentDealerId = dealerId || currentUser?.dealerId;
      
      if (!currentDealerId) {
        console.warn("⚠️ Không tìm thấy Dealer ID");
        return;
      }

      startLoading('Đang tải dữ liệu đại lý...');
      
      // Fetch song song thông tin đại lý và số liệu thống kê
      // Sử dụng Promise.allSettled để tránh crash nếu API lỗi 500
      const [dealerInfoResult, dashboardResult] = await Promise.allSettled([
        dealerAPI.getDealerById(currentDealerId),
        dealerAPI.getDashboard()
      ]);
      
      // --- LOGIC XỬ LÝ DỮ LIỆU ---
      let dealerData = {};
      
      // Kiểm tra kết quả API Dealer
      const apiDealerResponse = dealerInfoResult.status === 'fulfilled' ? dealerInfoResult.value : null;
      
      // 1. Ưu tiên dữ liệu từ API nếu thành công
      if (apiDealerResponse && apiDealerResponse.success && apiDealerResponse.data && (apiDealerResponse.data.name || apiDealerResponse.data.dealerName)) {
        dealerData = apiDealerResponse.data;
      } else {
        // 2. Nếu API lỗi (500, 404, Network Error) -> Dùng Mock Data
        console.warn(`⚠️ API lỗi hoặc không trả về thông tin đại lý ${currentDealerId}. Sử dụng Mock Data.`);
        const mockData = getMockDealerById(currentDealerId);
        
        if (mockData) {
          dealerData = mockData;
        } else {
          // 3. Fallback cuối cùng (nếu ID không nằm trong danh sách Mock)
          dealerData = {
            dealerId: currentDealerId,
            name: `Đại lý #${currentDealerId}`,
            address: 'Đang cập nhật...',
            phone: '---',
            email: '---',
            representativeName: '---',
            status: 'Active'
          };
        }
      }
      
      // Kiểm tra kết quả API Dashboard (Stats)
      const statsResponse = dashboardResult.status === 'fulfilled' ? dashboardResult.value : null;
      const statsData = (statsResponse && statsResponse.success) ? statsResponse.data : {};

      const data = {
        dealer: dealerData,
        performance: statsData.performance || {},
        recentOrders: statsData.recentOrders || [],
        inventory: statsData.inventory || []
      };
      
      setDashboardData(data);

    } catch (err) {
      console.error('❌ Dashboard Critical Error:', err);
      
      // Fallback an toàn tuyệt đối khi code JS bị lỗi logic
      const currentDealerId = dealerId || currentUser?.dealerId;
      const mockData = getMockDealerById(currentDealerId);
      
      setDashboardData({
         dealer: mockData || { name: `Đại lý #${currentDealerId || '??'}` },
         performance: {},
         recentOrders: [],
         inventory: []
      });
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, currentUser, dealerId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Tránh render khi chưa có data
  if (!dashboardData) return null;

  const { dealer, inventory } = dashboardData;

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection dashboardData={dashboardData} navigate={navigate} />;
      case 'inventory': return <InventorySection inventory={inventory} />;
      case 'orders': return <OrdersSection navigate={navigate} />;
      case 'customers': return <CustomersSection navigate={navigate} />;
      case 'reports':
        if (!isManager) return <AccessDeniedSection />;
        return <ReportsSection />;
      default: return <OverviewSection dashboardData={dashboardData} navigate={navigate} />;
    }
  };


  return (
    <PageContainer>
      {/* --- HEADER BANNER ĐẦY ĐỦ THÔNG TIN --- */}
      <div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-white/20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        {/* Content Container */}
        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">

            {/* Logo / Avatar Đại lý */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                <Building2 className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
              </div>
            </div>

            {/* Thông tin chính */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 uppercase tracking-wider">
                    Đại lý ủy quyền
                  </span>
                  <span className="text-slate-400 text-sm font-mono">#{dealer.id || dealer.dealerId || 'ID'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {dealer.name || dealer.dealerName || 'Tên Đại Lý'}
                </h1>
              </div>

              {/* Grid thông tin chi tiết */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-3 text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5"><MapPin className="w-4 h-4 text-rose-400" /></div>
                  <span className="text-sm">{dealer.address || 'Chưa cập nhật địa chỉ'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5"><Phone className="w-4 h-4 text-rose-400" /></div>
                  <span className="text-sm font-mono">{dealer.phoneNumber || dealer.phone || 'Chưa cập nhật SĐT'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5"><Mail className="w-4 h-4 text-blue-400" /></div>
                  <span className="text-sm">{dealer.email || 'Chưa cập nhật Email'}</span>
                </div>

                {dealer.representativeName && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5"><UserCircle className="w-4 h-4 text-amber-400" /></div>
                    <span className="text-sm">Đại diện: <strong className="text-white">{dealer.representativeName}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Mini (Góc phải) */}
            <div className="hidden xl:block bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 min-w-[200px]">
              <div className="text-slate-400 text-sm mb-1">Doanh số tháng này</div>
              <div className="text-3xl font-bold text-rose-400">
                {dashboardData.performance?.monthlySales || 0} <span className="text-base font-normal text-rose-600/80">xe</span>
              </div>
              <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[70%]"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Pills - Modern Glass Design */}
      <div className="relative mb-8">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-purple-300/10 dark:from-rose-500/10 dark:via-indigo-500/10 dark:to-fuchsia-500/10 rounded-3xl blur-xl"></div>

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
                className={`group relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 border-2 backdrop-blur-sm overflow-hidden border-none ${isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-slate-700 dark:to-gray-600 text-white border-cyan-400/80 dark:border-rose-400/80 shadow-xl shadow-cyan-500/40 dark:shadow-rose-500/40 scale-105 translate-y-[-2px]'
                    : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-white/10 hover:bg-cyan-50/80 dark:hover:bg-white/10 hover:scale-105 hover:translate-y-[-2px] hover:border-cyan-400/60 dark:hover:border-rose-400/40 hover:shadow-lg hover:shadow-cyan-500/20 dark:hover:shadow-slate-500/20'
                  }`}
                onClick={() => setActiveSection(section.id)}
              >
                {/* Active Indicator - Animated Gradient Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-500/20 to-purple-500/20 dark:from-slate-400/20 dark:via-purple-500/20 dark:to-sky-500/20 animate-pulse"></div>
                )}

                {/* Icon with Animation */}
                <IconComponent className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive
                    ? 'scale-110 drop-shadow-lg'
                    : 'group-hover:scale-110 group-hover:rotate-12'
                  }`} />

                {/* Label */}
                <span className={`relative z-10 transition-all duration-300 ${isActive
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

      {/* Feature Modules (Bento Menu) - show when overview is active */}
      {activeSection === 'overview' && (
        <div className="mt-12">
          <QuickActions navigate={navigate} />
          <h3 className="text-3xl font-extrabold mb-8 bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-600 from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Package className="w-8 h-8 dark:text-emerald-400 text-cyan-600" /> Các chức năng chính
          </h3>
          <BentoMenu onModuleClick={(path) => navigate(path)} />
        </div>
      )}

    </PageContainer>
  );
};

export default DealerDashboard;