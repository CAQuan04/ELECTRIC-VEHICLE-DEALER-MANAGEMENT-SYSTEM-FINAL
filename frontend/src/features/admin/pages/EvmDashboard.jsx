import React, { useEffect, useState, useMemo } from "react";
import { 
  Users, Building2, Car, Banknote, TrendingUp, 
  Activity, CarFront, LayoutDashboard, ArrowUpRight 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

// Import API Services
import AdminService from "../../../utils/api/services/admin.service";
import apiClient from "../../../utils/api/client";

// Import UI Components
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// --- Helper ---
const formatMoney = (n) => typeof n === "number" ? n.toLocaleString("vi-VN") : "0";

const EvmDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDealers: 0,
    totalVehicles: 0,
    totalRevenue: 0,
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [salesData, setSalesData] = useState([]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Gọi song song các API để tối ưu tốc độ
        const [usersRes, dealersRes, vehiclesRes, salesRes] = await Promise.all([
          AdminService.getAllUsers(),
          apiClient.get('/admin/dealers'), // Hoặc endpoint lấy danh sách đại lý
          apiClient.get('/admin/vehicles'),
          apiClient.get('/Analytics/sales-report?GroupBy=dealer') // Lấy doanh thu
        ]);

        // 1. Xử lý Users
        const users = usersRes.data || [];
        
        // 2. Xử lý Dealers (Mock data nếu API chưa có, hoặc lấy từ dealersRes)
        const dealers = Array.isArray(dealersRes.data) ? dealersRes.data : (dealersRes || []);

        // 3. Xử lý Vehicles
        const vehicles = Array.isArray(vehiclesRes) ? vehiclesRes : (vehiclesRes.data || []);
        
        // 4. Xử lý Sales (Tính tổng doanh thu)
        const reportData = salesRes.data?.reportData || [];
        const revenue = reportData.reduce((sum, item) => sum + item.totalRevenue, 0);

        // Cập nhật State
        setStats({
          totalUsers: users.length,
          totalDealers: dealers.length || 5, // Fallback nếu API dealer chưa trả về list
          totalVehicles: vehicles.length,
          totalRevenue: revenue,
        });

        // Lấy 4 xe mới nhất để hiển thị
        setRecentVehicles(vehicles.slice(0, 4));
        
        // Dữ liệu biểu đồ (Top 5 doanh thu cao nhất)
        setSalesData(reportData.sort((a,b) => b.totalRevenue - a.totalRevenue).slice(0, 5));

      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Cấu hình Card thống kê
  const statCards = [
    {
      label: "Người dùng hệ thống",
      value: stats.totalUsers,
      icon: Users,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
      trend: "+12% tuần này"
    },
    {
      label: "Đại lý hoạt động",
      value: stats.totalDealers,
      icon: Building2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      trend: "Ổn định"
    },
    {
      label: "Xe đang kinh doanh",
      value: stats.totalVehicles,
      icon: Car,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      trend: "+3 mẫu mới"
    },
    {
      label: "Tổng doanh thu",
      value: `${formatMoney(stats.totalRevenue)} đ`,
      icon: Banknote,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      trend: "Thực tế"
    },
  ];

  return (
    <PageContainer>
      {/* 1. HEADER */}
      <PageHeader
        title="Tổng quan hệ thống EVM"
        subtitle="Dashboard quản trị"
        description="Theo dõi các chỉ số quan trọng, hiệu suất kinh doanh và tình trạng hệ thống theo thời gian thực."
        icon={<LayoutDashboard />}
      />

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((item, index) => (
          <Card key={index} className={`p-6 border ${item.bg.split(' ')[1]} hover:shadow-lg transition-all duration-300 group`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="flex items-center text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
                 {item.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div className="space-y-1">
               <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{item.label}</h4>
               <p className="text-2xl sm:text-3xl font-black text-slate-100">{loading ? "..." : item.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. REVENUE CHART (Chiếm 2/3) */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    Top Đại lý theo Doanh số
                 </h3>
              </div>
              
              <div className="h-[350px] w-full">
                 {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-500">Đang tải biểu đồ...</div>
                 ) : salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                          <XAxis dataKey="groupingKey" stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                          <YAxis stroke="#94a3b8" tickFormatter={(val) => `${(val/1e9).toFixed(0)} tỷ`} axisLine={false} tickLine={false} />
                          <Tooltip 
                             cursor={{fill: '#1e293b', opacity: 0.5}}
                             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                             formatter={(val) => [`${formatMoney(val)} VNĐ`, "Doanh thu"]}
                          />
                          <Bar dataKey="totalRevenue" radius={[6, 6, 0, 0]} barSize={50}>
                             {salesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#3b82f6'} />
                             ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 italic">Chưa có dữ liệu doanh thu</div>
                 )}
              </div>
           </Card>

           {/* Recent Activity (Mock for now but structured) */}
           <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                 <Activity className="w-5 h-5 text-emerald-400" />
                 <h3 className="text-lg font-bold text-white">Hoạt động gần đây</h3>
              </div>
              <div className="space-y-4">
                 {[
                    { user: "Admin", action: "Đã cập nhật giá xe VF 9", time: "2 phút trước", color: "bg-blue-500" },
                    { user: "Manager A", action: "Đã duyệt hợp đồng #HD001", time: "15 phút trước", color: "bg-emerald-500" },
                    { user: "System", action: "Chạy job dự báo AI thành công", time: "1 giờ trước", color: "bg-purple-500" },
                 ].map((act, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
                       <div className={`w-2 h-2 rounded-full ${act.color}`}></div>
                       <div className="flex-1">
                          <p className="text-sm text-slate-200"><span className="font-bold text-white">{act.user}</span> {act.action}</p>
                          <p className="text-xs text-slate-500">{act.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* 4. RECENT VEHICLES (Chiếm 1/3) */}
        <div className="lg:col-span-1">
           <Card className="h-full p-6 bg-gradient-to-b from-slate-900 to-[#0b1622]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CarFront className="w-5 h-5 text-purple-400" />
                    Xe mới nhập
                 </h3>
              </div>

              <div className="space-y-4">
                 {loading ? (
                    <div className="text-center text-slate-500">Đang tải...</div>
                 ) : recentVehicles.length > 0 ? (
                    recentVehicles.map((car, idx) => (
                       <div key={car.vehicleId || idx} className="group relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-4 hover:border-purple-500/30 transition-all duration-300">
                          <div className="flex items-center gap-4">
                             <div className="w-16 h-12 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
                                {car.imageUrl ? (
                                   <img src={car.imageUrl} alt={car.model} className="w-full h-full object-contain" />
                                ) : (
                                   <Car className="w-6 h-6 text-slate-600" />
                                )}
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-200 group-hover:text-purple-400 transition-colors">{car.model}</h4>
                                <p className="text-xs text-slate-500">{car.brand} • {car.year}</p>
                             </div>
                          </div>
                          <div className="mt-3 flex justify-between items-end border-t border-slate-800 pt-2">
                             <span className="text-xs font-mono text-slate-400">Base Price</span>
                             <span className="text-sm font-bold text-cyan-400">{formatMoney(car.basePrice)}</span>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="text-center text-slate-500 py-10 border border-dashed border-slate-800 rounded-xl">Chưa có xe nào</div>
                 )}
              </div>
           </Card>
        </div>

      </div>
    </PageContainer>
  );
};

export default EvmDashboard;