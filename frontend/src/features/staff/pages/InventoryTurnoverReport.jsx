import React, { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "../../../utils/api/apiClient"; // Đảm bảo đường dẫn này đúng

// --- Helper utils ---
const turnoverColor = (rate) => {
  if (rate >= 80) return "text-emerald-400";
  if (rate >= 50) return "text-yellow-400";
  return "text-rose-400";
};

const getFirstDayOfMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
const getToday = () => new Date().toISOString().slice(0, 10);

const InventoryTurnoverReport = () => {
  // --- STATE MANAGEMENT ---
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getToday(),
    dealerId: "", // Để trống là "Tất cả đại lý"
  });
  
  // State cho dropdown
  const [dealers, setDealers] = useState([]);

  // --- API CALLS ---

  // Tải danh sách đại lý cho dropdown
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await apiClient.get('/api/Dealers/basic');
        setDealers(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đại lý:", error);
      }
    };
    fetchDealers();
  }, []);

  // Hàm gọi API chính để lấy dữ liệu báo cáo
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        StartDate: filters.startDate,
        EndDate: filters.endDate,
        // Chỉ truyền dealerId nếu nó được chọn
        DealerId: filters.dealerId ? parseInt(filters.dealerId) : undefined,
      };
      const response = await apiClient.get('/api/Analytics/inventory-turnover', { params });
      setReportData(response.data);
    } catch (error) {
      console.error("Lỗi khi tải báo cáo tồn kho:", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Tự động gọi báo cáo khi filter thay đổi
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2 py-2">
            Báo cáo tồn kho & tốc độ tiêu thụ
          </h1>
          <p className="text-slate-400 mt-1">
            Theo dõi hiệu suất tồn kho và tốc độ tiêu thụ của các đại lý.
          </p>
        </div>

        {/* BỘ LỌC ĐÃ TÍCH HỢP */}
        <div className="flex gap-2">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 px-4 py-2"
          />
           <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 px-4 py-2"
          />
          <select
            name="dealerId"
            value={filters.dealerId}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 px-4 py-2"
          >
            <option value="">Tất cả đại lý</option>
            {dealers.map(d => (
              <option key={d.dealerId} value={d.dealerId}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards hiển thị báo cáo */}
      {loading ? <div className="text-center p-10">Đang tải dữ liệu báo cáo...</div> :
       reportData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {reportData.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl hover:bg-slate-900/60 transition-all duration-300"
            >
              {/* Ghi chú: Hiển thị tên đại lý thay vì tên model */}
              <h3 className="text-2xl font-extrabold mb-4 text-slate-100 truncate" title={item.groupingKey}>
                {item.groupingKey}
              </h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Tồn đầu kỳ</span>
                  <span className="font-semibold">{item.openingStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nhập thêm</span>
                  <span className="font-semibold text-green-400">+{item.quantityReceived}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bán ra</span>
                  <span className="font-semibold text-sky-400">-{item.quantitySold}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tồn cuối kỳ</span>
                  <span className="font-semibold">{item.closingStock}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-3 mt-2">
                  <span className="font-bold text-slate-200">Tốc độ tiêu thụ</span>
                  <span className={`font-extrabold text-lg ${turnoverColor(item.sellThroughRatePercentage)}`}>
                    {item.sellThroughRatePercentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
       ) : <div className="text-center p-10 text-slate-500">Không có hoạt động tồn kho nào cho bộ lọc hiện tại.</div>
      }
    </div>
  );
};

export default InventoryTurnoverReport;