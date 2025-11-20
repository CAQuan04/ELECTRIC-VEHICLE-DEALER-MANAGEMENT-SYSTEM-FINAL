// forecastService.js
// Mô phỏng AI model dự báo nhu cầu xe dựa trên lịch sử SalesOrder

const mockSalesOrders = [
  { dealer_id: "DL001", vehicle_id: "V001", period: "2025-Q1", quantity: 120 },
  { dealer_id: "DL001", vehicle_id: "V001", period: "2025-Q2", quantity: 140 },
  { dealer_id: "DL001", vehicle_id: "V001", period: "2025-Q3", quantity: 160 },
  { dealer_id: "DL002", vehicle_id: "V002", period: "2025-Q1", quantity: 80 },
  { dealer_id: "DL002", vehicle_id: "V002", period: "2025-Q2", quantity: 90 },
  { dealer_id: "DL002", vehicle_id: "V002", period: "2025-Q3", quantity: 100 },
];

let mockForecasts = [];

/** AIModelAdapter mô phỏng mô hình AI đơn giản */
function AIModelAdapter(salesHistory) {
  // Dự báo bằng xu hướng tuyến tính đơn giản (linear)
  if (salesHistory.length < 2) return salesHistory[salesHistory.length - 1]?.quantity ?? 0;
  const diffs = salesHistory.slice(1).map((v, i) => v.quantity - salesHistory[i].quantity);
  const avgGrowth = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const lastQty = salesHistory[salesHistory.length - 1].quantity;
  return Math.max(0, Math.round(lastQty + avgGrowth)); // không âm
}

/** Chạy mô hình AI để sinh dự báo */
export function runDemandForecast() {
  const grouped = {};
  mockSalesOrders.forEach((s) => {
    const key = `${s.dealer_id}_${s.vehicle_id}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  });

  mockForecasts = Object.keys(grouped).map((key) => {
    const [dealer_id, vehicle_id] = key.split("_");
    const predicted_quantity = AIModelAdapter(grouped[key]);
    return {
      forecast_id: "FC" + Math.floor(Math.random() * 10000),
      dealer_id,
      vehicle_id,
      forecast_period_start: "2025-Q4",
      predicted_quantity,
      created_at: new Date().toISOString(),
    };
  });

  return mockForecasts;
}

/** Lấy danh sách dự báo */
export function getForecast(filters = {}) {
  const { dealerId = "ALL" } = filters;
  return dealerId === "ALL"
    ? mockForecasts
    : mockForecasts.filter((f) => f.dealer_id === dealerId);
}
