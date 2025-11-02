// ================================
// 🧠 AI Demand Forecast Service (Improved Mocked Version)
// ================================

// ⚙️ Dữ liệu bán hàng lịch sử (SalesOrder)
let salesHistory = [
  { dealer_id: "DL001", vehicle_id: "EV-01", period: "2025-Q1", quantity: 120 },
  { dealer_id: "DL001", vehicle_id: "EV-01", period: "2025-Q2", quantity: 140 },
  { dealer_id: "DL001", vehicle_id: "EV-01", period: "2025-Q3", quantity: 160 },
  { dealer_id: "DL002", vehicle_id: "EV-02", period: "2025-Q1", quantity: 80 },
  { dealer_id: "DL002", vehicle_id: "EV-02", period: "2025-Q2", quantity: 90 },
  { dealer_id: "DL002", vehicle_id: "EV-02", period: "2025-Q3", quantity: 100 },
  { dealer_id: "DL003", vehicle_id: "EV-03", period: "2025-Q1", quantity: 60 },
  { dealer_id: "DL003", vehicle_id: "EV-03", period: "2025-Q2", quantity: 75 },
  { dealer_id: "DL003", vehicle_id: "EV-03", period: "2025-Q3", quantity: 120 },
];

// ⚡ Mock dữ liệu dự báo khởi tạo sẵn
let forecasts = [
  {
    forecast_id: "DL001-2025-Q4",
    dealer_id: "DL001",
    vehicle_id: "EV-01",
    forecast_period_start: "2025-Q4",
    predicted_quantity: 180,
    created_at: "2025-10-20T08:00:00Z",
  },
  {
    forecast_id: "DL002-2025-Q4",
    dealer_id: "DL002",
    vehicle_id: "EV-02",
    forecast_period_start: "2025-Q4",
    predicted_quantity: 110,
    created_at: "2025-10-20T08:00:00Z",
  },
  {
    forecast_id: "DL003-2025-Q4",
    dealer_id: "DL003",
    vehicle_id: "EV-03",
    forecast_period_start: "2025-Q4",
    predicted_quantity: 95,
    created_at: "2025-10-20T08:00:00Z",
  },
];

// ================================
// 🚀 Mô phỏng AI dự báo
// ================================
export function runDemandForecast() {
  const nextPeriod = "2025-Q4";
  const newForecasts = [];

  const grouped = salesHistory.reduce((acc, curr) => {
    if (!acc[curr.dealer_id]) acc[curr.dealer_id] = [];
    acc[curr.dealer_id].push(curr);
    return acc;
  }, {});

  for (const [dealerId, records] of Object.entries(grouped)) {
    // Tính tăng trưởng trung bình 2 quý gần nhất
    const growthRates = [];
    for (let i = 1; i < records.length; i++) {
      const rate = (records[i].quantity - records[i - 1].quantity) / records[i - 1].quantity;
      growthRates.push(rate);
    }
    const avgGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

    // Thêm nhiễu ngẫu nhiên (AI sai số ±10%)
    const noise = (Math.random() * 0.2 - 0.1); // -0.1 đến +0.1

    // Dự đoán dựa trên xu hướng + nhiễu
    const lastQuantity = records[records.length - 1].quantity;
    const predicted = Math.round(lastQuantity * (1 + avgGrowth + noise));

    newForecasts.push({
      forecast_id: `${dealerId}-${nextPeriod}`,
      dealer_id: dealerId,
      vehicle_id: records[0].vehicle_id,
      forecast_period_start: nextPeriod,
      predicted_quantity: predicted,
      created_at: new Date().toISOString(),
    });
  }

  forecasts = newForecasts;
  console.log("✅ AI Forecast completed:", forecasts);
  return forecasts;
}

// ================================
// 📦 Lấy dữ liệu dự báo
// ================================
export function getForecast(filters = {}) {
  if (!filters.dealerId || filters.dealerId === "ALL") {
    return forecasts;
  }
  return forecasts.filter((f) => f.dealer_id === filters.dealerId);
}

// ================================
// 🧹 Xóa tất cả dự báo
// ================================
export function clearForecasts() {
  forecasts = [];
}
