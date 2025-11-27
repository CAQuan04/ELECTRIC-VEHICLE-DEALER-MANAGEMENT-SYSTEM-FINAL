import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingCart, Users, DollarSign, 
  Package, TrendingUp, Clock, CheckCircle, AlertCircle 
} from "lucide-react";
import apiClient from "../../../utils/api/apiClient";
import { useAuth } from "../../../context/AuthContext";

// --- UI COMPONENTS ---
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/ui/StatCard"; // Component Card thống kê đẹp
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // --- DASHBOARD STATE ---
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  // --- API CALLS ---
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi song song các API cần thiết
      const [inventoryRes, ordersRes, salesRes] = await Promise.all([
        apiClient.get('/inventory/summary'),
        // Giả sử có API lấy danh sách đơn hàng (nếu chưa có thì dùng mock hoặc endpoint tương tự)
        // Ở đây demo dùng endpoint giả định, bạn cần thay bằng endpoint thật nếu có
        apiClient.get('/orders/recent').catch(() => ({ data: [] })), 
        apiClient.get('/analytics/sales-report?groupBy=dealer').catch(() => ({ data: { reportData: [] } }))
      ]);

      // 1. Xử lý số liệu Tồn kho
      const inventoryData = inventoryRes.data || [];
      const totalVehicles = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
      const lowStock = inventoryData.filter(item => item.quantity < 5); // Cảnh báo nếu tồn < 5

      // 2. Xử lý số liệu Đơn hàng
      const ordersData = ordersRes.data || []; // Cần endpoint thật
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(o => o.status === 'Pending').length;

      // 3. Xử lý Doanh thu (từ Sales Report)
      const salesReport = salesRes.data.reportData || [];
      const totalRevenue = salesReport.reduce((sum, item) => sum + item.totalRevenue, 0);

      setStats({
        totalVehicles,
        totalOrders,
        pendingOrders,
        totalRevenue
      });
      setRecentOrders(ordersData.slice(0, 5)); // Lấy 5 đơn mới nhất
      setLowStockItems(lowStock.slice(0, 5)); // Lấy 5 xe sắp hết hàng

    } catch (error) {
      console.error("Lỗi tải dữ liệu Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- HELPER FORMAT ---
  const formatCurrency = (value) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // --- RENDER ---
  return (
    <PageContainer>
      {/* 1. Header */}
      <PageHeader
        title="Tổng quan Nhân viên"
        subtitle={`Chào mừng trở lại, ${user?.name || 'Nhân viên'}!`}
        description="Theo dõi hiệu suất kinh doanh, tồn kho và các tác vụ cần xử lý hôm nay."
        icon={<LayoutDashboard />}
        breadcrumbs={[{ label: "Trang chủ" }]}
      />

      <div className="mt-8 space-y-8">
        {/* 2. STATS CARDS (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Doanh thu tháng" 
            value={formatCurrency(stats.totalRevenue)} 
            icon={<DollarSign />} 
            trend="up" 
            change="+12% so với tháng trước" // Logic tính % cần thêm data lịch sử
            className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-500/30"
          />
          <StatCard 
            title="Đơn hàng mới" 
            value={stats.totalOrders} 
            icon={<ShoppingCart />} 
            trend="neutral"
            change={`${stats.pendingOrders} đơn chờ xử lý`}
            className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-500/30"
          />
          <StatCard 
            title="Xe trong kho" 
            value={stats.totalVehicles} 
            icon={<Package />} 
            trend={stats.totalVehicles < 20 ? "down" : "up"}
            change={stats.totalVehicles < 20 ? "Cần nhập thêm" : "Tồn kho ổn định"}
            className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-500/30"
          />
          <StatCard 
            title="Khách hàng mới" 
            value="12" // Demo data (Cần API Customers)
            icon={<Users />} 
            trend="up"
            change="+5 trong tuần này"
            className="bg-gradient-to-br from-orange-900/50 to-slate-900 border-orange-500/30"
          />
        </div>

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Recent Orders (Chiếm 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="text-blue-400" /> Đơn hàng gần đây
                </h3>
                <button onClick={() => navigate('/sales')} className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                  Xem tất cả &rarr;
                </button>
              </div>
              
              {recentOrders.length > 0 ? (
                <Table 
                  columns={[
                    { key: 'id', label: 'Mã đơn', render: (r) => <span className="font-mono text-sky-300">#{r.id}</span> },
                    { key: 'customer', label: 'Khách hàng', render: (r) => <span className="font-medium text-white">{r.customerName}</span> },
                    { key: 'vehicle', label: 'Xe', render: (r) => <span>{r.vehicleName}</span> },
                    { key: 'total', label: 'Tổng tiền', render: (r) => formatCurrency(r.totalAmount) },
                    { key: 'status', label: 'Trạng thái', render: (r) => (
                        <Badge variant={r.status === 'Completed' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}>
                          {r.status}
                        </Badge>
                      ) 
                    },
                  ]} 
                  data={recentOrders} 
                  className="bg-transparent"
                />
              ) : (
                <EmptyState 
                  icon="🛒" 
                  title="Chưa có đơn hàng mới" 
                  description="Hiện tại chưa có giao dịch nào được ghi nhận." 
                />
              )}
            </Card>

            {/* Section: Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => navigate('/staff/inventory')} className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2">
                    <Package /> Quản lý Kho & Điều phối
                </button>
                <button onClick={() => navigate('/staff/pricing')} className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2">
                    <DollarSign /> Cập nhật Giá & Khuyến mãi
                </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Low Stock Alerts (Chiếm 1/3) */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1e293b]/50 backdrop-blur-xl border-slate-700 h-full">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="text-rose-400" />
                <h3 className="text-xl font-bold text-white">Cảnh báo tồn kho</h3>
              </div>

              {lowStockItems.length > 0 ? (
                <div className="space-y-4">
                  {lowStockItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-rose-500/50 transition">
                      <div>
                        <p className="text-sm font-bold text-white">{item.vehicleName}</p>
                        <p className="text-xs text-slate-400">{item.configName}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.locationName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-rose-500">{item.quantity}</span>
                        <p className="text-[10px] uppercase text-rose-400 font-bold">Còn lại</p>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => navigate('/inventory')} className="w-full py-2 text-center text-sm text-slate-400 hover:text-white border-t border-slate-700 mt-4">
                    Xem toàn bộ kho &rarr;
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <CheckCircle size={48} className="mb-4 text-emerald-500/50" />
                  <p>Tồn kho ổn định</p>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </PageContainer>
  );
};

export default StaffDashboard;