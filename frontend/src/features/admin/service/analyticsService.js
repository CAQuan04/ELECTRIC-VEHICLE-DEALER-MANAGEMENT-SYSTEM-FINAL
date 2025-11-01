// analyticsService.js
// Xử lý dữ liệu doanh số và tổng hợp báo cáo cho Dealer

/* ========== Mock data (hoặc sau này bạn fetch API) ========== */
const mockDealers = [
  { dealer_id: "DL001", name: "Đại lý Hà Nội", region: "Miền Bắc" },
  { dealer_id: "DL002", name: "Đại lý TP.HCM", region: "Miền Nam" },
  { dealer_id: "DL003", name: "Đại lý Đà Nẵng", region: "Miền Trung" },
  { dealer_id: "DL004", name: "Đại lý Hải Phòng", region: "Miền Bắc" },
  { dealer_id: "DL005", name: "Đại lý Cần Thơ", region: "Miền Nam" },
];

const mockSales = [
  { sales_data_id: "S001", dealer_id: "DL001", product_id: "P01", period: "2025-Q3", quantity: 120, revenue: 60000000 },
  { sales_data_id: "S002", dealer_id: "DL002", product_id: "P01", period: "2025-Q3", quantity: 200, revenue: 100000000 },
  { sales_data_id: "S003", dealer_id: "DL003", product_id: "P01", period: "2025-Q3", quantity: 90, revenue: 45000000 },
  { sales_data_id: "S004", dealer_id: "DL004", product_id: "P02", period: "2025-Q3", quantity: 60, revenue: 36000000 },
  { sales_data_id: "S005", dealer_id: "DL005", product_id: "P02", period: "2025-Q3", quantity: 80, revenue: 44000000 },
];

/* ========== Core logic ========== */

/**
 * Gom nhóm doanh số theo đại lý & bộ lọc (period, region)
 * @param {string} period - kỳ báo cáo (vd "2025-Q3")
 * @param {object} filters - { region?: string, search?: string }
 * @returns {Array<{dealer_id, dealerName, region, quantity, revenue}>}
 */
export function aggregateByDealer(period, filters = {}) {
  const { region = "ALL", search = "" } = filters;
  let data = mockSales.filter((s) => s.period === period);

  // join dealer info
  data = data.map((s) => {
    const dealer = mockDealers.find((d) => d.dealer_id === s.dealer_id);
    return {
      ...s,
      dealerName: dealer?.name || s.dealer_id,
      region: dealer?.region || "Unknown",
    };
  });

  // filter by region
  if (region !== "ALL") {
    data = data.filter((d) => d.region === region);
  }

  // filter by search (dealer name / id)
  if (search.trim()) {
    const key = search.trim().toLowerCase();
    data = data.filter(
      (d) =>
        d.dealerName.toLowerCase().includes(key) ||
        d.dealer_id.toLowerCase().includes(key)
    );
  }

  // group by dealer_id
  const grouped = {};
  for (const item of data) {
    if (!grouped[item.dealer_id]) {
      grouped[item.dealer_id] = {
        dealer_id: item.dealer_id,
        dealerName: item.dealerName,
        region: item.region,
        quantity: 0,
        revenue: 0,
      };
    }
    grouped[item.dealer_id].quantity += item.quantity;
    grouped[item.dealer_id].revenue += item.revenue;
  }

  // to array
  const result = Object.values(grouped).sort((a, b) => b.revenue - a.revenue);
  return result;
}

/**
 * Chuẩn bị dữ liệu biểu đồ (dành cho Recharts)
 * @param {Array} aggregatedData - kết quả từ aggregateByDealer
 * @returns {object} { barChartData, pieChartData, summary }
 */
export function generateChart(aggregatedData = []) {
  const barChartData = aggregatedData.map((a) => ({
    name: a.dealerName,
    revenue: a.revenue,
    quantity: a.quantity,
  }));

  const pieChartData = aggregatedData
    .slice(0, 5)
    .map((a) => ({ name: a.dealerName, revenue: a.revenue }));

  const totalRevenue = aggregatedData.reduce((s, a) => s + a.revenue, 0);
  const totalQuantity = aggregatedData.reduce((s, a) => s + a.quantity, 0);
  const avgRevenue = aggregatedData.length
    ? Math.round(totalRevenue / aggregatedData.length)
    : 0;

  return {
    barChartData,
    pieChartData,
    summary: {
      totalRevenue,
      totalQuantity,
      avgRevenue,
    },
  };
}
