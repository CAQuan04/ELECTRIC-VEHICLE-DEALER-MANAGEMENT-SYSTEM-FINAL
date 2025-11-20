// reportingService.js
// Tổng hợp dữ liệu tồn kho & tốc độ tiêu thụ

const mockInventory = [
  { dealer_id: "DL001", model: "Model 3", beginStock: 15, imported: 10, endStock: 8 },
  { dealer_id: "DL002", model: "Model Y", beginStock: 20, imported: 5, endStock: 14 },
  { dealer_id: "DL003", model: "Model X", beginStock: 10, imported: 3, endStock: 6 },
];

const mockSalesOrder = [
  { dealer_id: "DL001", model: "Model 3", sold: 17 },
  { dealer_id: "DL002", model: "Model Y", sold: 11 },
  { dealer_id: "DL003", model: "Model X", sold: 7 },
];

/**
 * Tính toán báo cáo tồn kho và tốc độ tiêu thụ
 * @param {object} filters - { dealerId?, period? }
 * @returns {Array<{model, beginStock, imported, sold, endStock, turnoverRate}>}
 */
export function getInventoryTurnoverReport(filters = {}) {
  const { dealerId = "ALL" } = filters;

  const inventoryData =
    dealerId === "ALL"
      ? mockInventory
      : mockInventory.filter((r) => r.dealer_id === dealerId);

  return inventoryData.map((inv) => {
    const sale = mockSalesOrder.find(
      (s) => s.model === inv.model && s.dealer_id === inv.dealer_id
    );
    const sold = sale ? sale.sold : 0;
    const avgInv = (inv.beginStock + inv.endStock) / 2;
    const turnoverRate = avgInv > 0 ? ((sold / avgInv) * 100).toFixed(1) : 0;

    return {
      model: inv.model,
      beginStock: inv.beginStock,
      imported: inv.imported,
      sold,
      endStock: inv.endStock,
      turnoverRate,
    };
  });
}
