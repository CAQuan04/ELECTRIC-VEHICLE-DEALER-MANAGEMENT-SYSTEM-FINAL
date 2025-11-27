import { useRef, useEffect, useCallback, useMemo } from 'react'; // Thêm useMemo
import { gsap } from 'gsap';
import { useNavigate, useParams } from 'react-router-dom'; // Thêm useParams
import { useDealerRole } from './auth/DealerRoleGuard';
import { useAuth } from '@/context/AuthContext'; // Nếu cần fallback lấy từ Auth

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '16, 185, 129'; // Emerald for dark mode
const MOBILE_BREAKPOINT = 768;

// --- GIỮ NGUYÊN CÁC HÀM PARTICLE Ở NGOÀI (createParticleElement, ParticleCard) ---
const createParticleElement = (x, y, isDark) => {
  const color = isDark ? '16, 185, 129' : '6, 182, 212';
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const ParticleCard = ({ children, className = '', onClick, disableAnimations = false }) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);

  const isDarkMode = () => document.documentElement.classList.contains('dark');

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    const isDark = isDarkMode();
    
    memoizedParticles.current = Array.from({ length: DEFAULT_PARTICLE_COUNT }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, isDark)
    );
    particlesInitialized.current = true;
  }, []);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => particle.parentNode?.removeChild(particle)
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.4,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      gsap.to(element, {
        y: -5,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      gsap.to(element, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations]);

  return (
    <div
      ref={cardRef}
      className={className}
      onClick={onClick}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const BentoMenu = ({ onModuleClick, disableAnimations = false }) => {
  const navigate = useNavigate();
  
  // 1. Lấy dealerId từ URL hoặc Auth Context
  const { dealerId: paramDealerId } = useParams();
  const { user } = useAuth();
  const dealerId = paramDealerId || user?.dealerId;

  const gridRef = useRef(null);
  const { isManager, isStaff } = useDealerRole();

  // 2. Di chuyển menuData vào trong Component và dùng useMemo
  const menuData = useMemo(() => [
    {
      id: 'vehicles-info',
      icon: '🚗',
      title: 'Quản lý thông tin xe',
      description: 'Danh mục xe, so sánh mẫu xe',
      tag: 'UC 1.a',
      color: 'emerald',
      requiredRole: null, 
      subModules: [
        { icon: '📋', title: 'Danh mục xe', path: `/${dealerId}/dealer/vehicles`, tag: 'UC 1.a.1' },
        { icon: '⚖️', title: 'So sánh xe', path: `/${dealerId}/dealer/vehicles/compare`, tag: 'UC 1.a.2' }
      ]
    },
    {
      id: 'sales',
      icon: '💼',
      title: 'Quản lý bán hàng',
      description: 'Báo giá, đơn hàng, khuyến mãi',
      tag: 'UC 1.b',
      color: 'purple',
      requiredRole: null, 
      subModules: [
        { icon: '💰', title: 'Quản lý báo giá', path: `/${dealerId}/dealer/quotations`, tag: 'UC 1.b.1' },
        { icon: '📄', title: 'Đơn hàng & Hợp đồng', path: `/${dealerId}/dealer/orders`, tag: 'UC 1.b.2' },
        { icon: '🎁', title: 'Khuyến mãi', path: `/${dealerId}/dealer/promotions`, tag: 'UC 1.b.3' },
        { icon: '🏭', title: 'Đặt xe từ hãng', path: `/${dealerId}/dealer/purchase-requests`, tag: 'UC 1.b.4', managerOnly: true },
        { icon: '🚚', title: 'Theo dõi giao xe', path: `/${dealerId}/dealer/deliveries`, tag: 'UC 1.b.5' },
        { icon: '💳', title: 'Quản lý thanh toán', path: `/${dealerId}/dealer/payments`, tag: 'UC 1.b.6', managerOnly: true }
      ]
    },
    {
      id: 'inventory',
      icon: '📦',
      title: 'Quản lý kho',
      description: 'Tồn kho, nhập xuất, yêu cầu',
      tag: 'UC 1.e',
      color: 'amber',
      requiredRole: null, 
      subModules: [
        { icon: '📊', title: 'Tồn kho hiện tại', path: `/${dealerId}/dealer/inventory`, tag: 'UC 1.e.1' },
        { icon: '📥', title: 'Nhập kho', path: `/${dealerId}/dealer/inventory/incoming`, tag: 'UC 1.e.1.a' },
        { icon: '📝', title: 'Yêu cầu nhập hàng', path: `/${dealerId}/dealer/inventory/request`, tag: 'UC 1.e.2', staffAccess: true },
        { icon: '📋', title: 'Phiếu điều phối', path: `/${dealerId}/dealer/inventory/distributions`, tag: 'UC 1.e.3', managerOnly: true }
      ]
    },
    {
      id: 'customers',
      icon: '👥',
      title: 'Quản lý khách hàng',
      description: 'Hồ sơ, lái thử, phản hồi',
      tag: 'UC 1.c',
      color: 'blue',
      requiredRole: null, 
      subModules: [
        { icon: '📇', title: 'Hồ sơ khách hàng', path: `/${dealerId}/dealer/customers`, tag: 'UC 1.c.1' },
        { icon: '🚙', title: 'Lịch hẹn lái thử', path: `/${dealerId}/dealer/test-drives`, tag: 'UC 1.c.2' },
        { icon: '💬', title: 'Phản hồi & Khiếu nại', path: `/${dealerId}/dealer/feedback`, tag: 'UC 1.c.4' }
      ]
    },
    {
      id: 'reports',
      icon: '📊',
      title: 'Báo cáo & Phân tích',
      description: 'Doanh số, công nợ',
      tag: 'UC 1.d',
      color: 'pink',
      requiredRole: 'dealer_manager', 
      subModules: [
        { icon: '📈', title: 'Doanh số nhân viên', path: `/${dealerId}/dealer/reports/sales-performance`, tag: 'UC 1.d.1', managerOnly: true },
        { icon: '💸', title: 'Công nợ khách hàng', path: `/${dealerId}/dealer/reports/customer-debt`, tag: 'UC 1.d.2 (AR)', managerOnly: true },
        { icon: '🏢', title: 'Công nợ nhà cung cấp', path: `/${dealerId}/dealer/reports/supplier-debt`, tag: 'UC 1.d.2 (AP)', managerOnly: true }
      ]
    }
  ], [dealerId]); // Re-create menu if dealerId changes

  const handleSubModuleClick = (path) => {
    if (onModuleClick) {
      onModuleClick(path);
    } else {
      navigate(path);
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        border: 'dark:border-emerald-500 border-cyan-500',
        bg: 'dark:bg-emerald-500/10 bg-cyan-50',
        tag: 'dark:bg-emerald-500/20 bg-cyan-100 dark:text-emerald-300 text-cyan-800 dark:border-emerald-500/40 border-cyan-400',
        hover: 'dark:hover:border-emerald-500/50 hover:border-cyan-500 dark:hover:shadow-emerald-500/20 hover:shadow-cyan-500/20'
      },
      purple: {
        border: 'dark:border-purple-500 border-purple-600',
        bg: 'dark:bg-purple-500/10 bg-purple-50',
        tag: 'dark:bg-purple-500/20 bg-purple-100 dark:text-purple-300 text-purple-800 dark:border-purple-500/40 border-purple-400',
        hover: 'dark:hover:border-purple-500/50 hover:border-purple-600 dark:hover:shadow-purple-500/20 hover:shadow-purple-500/20'
      },
      blue: {
        border: 'dark:border-blue-500 border-blue-600',
        bg: 'dark:bg-blue-500/10 bg-blue-50',
        tag: 'dark:bg-blue-500/20 bg-blue-100 dark:text-blue-300 text-blue-800 dark:border-blue-500/40 border-blue-400',
        hover: 'dark:hover:border-blue-500/50 hover:border-blue-600 dark:hover:shadow-blue-500/20 hover:shadow-blue-500/20'
      },
      pink: {
        border: 'dark:border-pink-500 border-pink-600',
        bg: 'dark:bg-pink-500/10 bg-pink-50',
        tag: 'dark:bg-pink-500/20 bg-pink-100 dark:text-pink-300 text-pink-800 dark:border-pink-500/40 border-pink-400',
        hover: 'dark:hover:border-pink-500/50 hover:border-pink-600 dark:hover:shadow-pink-500/20 hover:shadow-pink-500/20'
      },
      amber: { // Added Amber for Inventory
        border: 'dark:border-amber-500 border-amber-600',
        bg: 'dark:bg-amber-500/10 bg-amber-50',
        tag: 'dark:bg-amber-500/20 bg-amber-100 dark:text-amber-300 text-amber-800 dark:border-amber-500/40 border-amber-400',
        hover: 'dark:hover:border-amber-500/50 hover:border-amber-600 dark:hover:shadow-amber-500/20 hover:shadow-amber-500/20'
      }
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <div ref={gridRef} className="space-y-8">
      {menuData.map((module) => {
        const colors = getColorClasses(module.color);
        
        // Hide entire module if user doesn't have required role
        if (module.requiredRole === 'dealer_manager' && !isManager) {
          return (
            <div key={module.id} className="mb-10">
              {/* Locked Module Header */}
              <div className="relative flex items-center gap-3 border-l-4 border-gray-400 dark:border-gray-600 pl-4 bg-gray-100 dark:bg-gray-800/50 py-3 rounded-r-xl mb-6 opacity-60">
                <span className="text-3xl grayscale">{module.icon}</span>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    {module.title}
                    <span className="text-sm px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full border border-red-500/30">
                      🔒 Chỉ Quản lý
                    </span>
                  </h4>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {module.description}
                  </p>
                </div>
                <span className="px-3 py-1.5 text-xs font-bold rounded-full border bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-400 dark:border-gray-600">
                  {module.tag}
                </span>
              </div>

              {/* Locked Sub-modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {module.subModules.map((subModule, idx) => (
                  <div
                    key={idx}
                    className="relative cursor-not-allowed theme-card border border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex gap-4 backdrop-blur-sm opacity-50"
                  >
                    <div className="absolute inset-0 bg-gray-900/30 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                      <div className="text-center">
                        <span className="text-3xl mb-2 block">🔒</span>
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Bị khóa</p>
                      </div>
                    </div>
                    <div className="text-4xl flex-shrink-0 grayscale blur-sm">
                      {subModule.icon}
                    </div>
                    <div className="flex-1 blur-sm">
                      <h5 className="text-lg font-bold mb-2 theme-text-primary">
                        {subModule.title}
                      </h5>
                      <span className="inline-block px-3 py-1.5 text-xs font-bold rounded-full border bg-gray-200 dark:bg-gray-700 text-gray-500">
                        {subModule.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        
        return (
          <div key={module.id} className="mb-10">
            {/* Module Header */}
            <div className={`flex items-center gap-3 border-l-4 ${colors.border} pl-4 ${colors.bg} py-3 rounded-r-xl mb-6`}>
              <span className="text-3xl">{module.icon}</span>
              <div className="flex-1">
                <h4 className="text-2xl font-bold theme-text-primary">
                  {module.title}
                </h4>
                <p className="text-sm theme-text-muted mt-1">
                  {module.description}
                </p>
              </div>
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full border shadow-md ${colors.tag}`}>
                {module.tag}
              </span>
            </div>

            {/* Sub-modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {module.subModules.map((subModule, idx) => {
                // Lock manager-only items for staff
                if (subModule.staffAccess && isManager) {
                  return null;
                }
                 if (subModule.managerOnly && !isManager) {
                  return (
                    <div
                      key={idx}
                      className="relative cursor-not-allowed theme-card border border-orange-300 dark:border-orange-700/50 rounded-2xl p-6 flex gap-4 backdrop-blur-sm"
                      title="Chỉ Quản lý mới có quyền truy cập"
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <span className="px-2 py-1 text-xs bg-orange-500/80 text-white rounded-full font-bold shadow-lg flex items-center gap-1">
                          🔒 Manager
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                        <div className="text-center">
                          <span className="text-4xl mb-2 block animate-pulse">🛡️</span>
                        </div>
                      </div>
                      <div className="text-4xl flex-shrink-0 opacity-40">
                        {subModule.icon}
                      </div>
                      <div className="flex-1 opacity-40">
                        <h5 className="text-lg font-bold mb-2 theme-text-primary">
                          {subModule.title}
                        </h5>
                        <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full border shadow-md ${colors.tag}`}>
                          {subModule.tag}
                        </span>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <ParticleCard
                    key={idx}
                    className={`group cursor-pointer theme-card border rounded-2xl p-6 ${colors.hover} hover:scale-[1.02] transition-all duration-300 flex gap-4 backdrop-blur-sm`}
                    onClick={() => handleSubModuleClick(subModule.path)}
                    disableAnimations={disableAnimations}
                  >
                    <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {subModule.icon}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-bold mb-2 theme-text-primary">
                        {subModule.title}
                      </h5>
                      <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full border shadow-md ${colors.tag}`}>
                        {subModule.tag}
                      </span>
                    </div>
                  </ParticleCard>
                );
              })}
            </div>
          </div>
        );
      })}

    </div>
  );
};

export default BentoMenu;