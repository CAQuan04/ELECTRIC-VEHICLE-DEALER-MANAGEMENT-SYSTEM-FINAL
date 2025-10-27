// PricingManagement.jsx — mock CRUD quản lý giá sỉ & khuyến mãi theo đại lý
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@mui/material";

// ==== Mock data (khởi tạo ban đầu) ====
const initialWholesalePrices = [
  {
    priceId: 1,
    productId: "EV001",
    dealerId: "D001",
    price: 95000,
    validFrom: "2025-10-01",
    validTo: "2025-12-31",
  },
  {
    priceId: 2,
    productId: "EV002",
    dealerId: "D002",
    price: 88000,
    validFrom: "2025-09-15",
    validTo: "2025-12-15",
  },
];

const initialPromotions = [
  {
    policyId: 1,
    dealerId: "D001",
    description: "Khuyến mãi lễ 30/4",
    discountPercent: 10,
    conditions: '{"minOrder":2}',
    startDate: "2025-04-01",
    endDate: "2025-05-01",
  },
  {
    policyId: 2,
    dealerId: "D002",
    description: "Giảm giá quý 4",
    discountPercent: 7,
    conditions: '{"minValue":50000000}',
    startDate: "2025-10-01",
    endDate: "2025-12-31",
  },
];

// ==== Component chính ====
const PricingManagement = () => {
  const [tab, setTab] = useState(0);
  const [wholesalePrices, setWholesalePrices] = useState(initialWholesalePrices);
  const [promotions, setPromotions] = useState(initialPromotions);

  // ==== Modal form ====
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formType, setFormType] = useState("price"); // "price" | "promotion"
  const [formData, setFormData] = useState({});

  // ==== Handlers ====
  const handleOpen = (type, record = null) => {
    setFormType(type);
    setIsEditing(!!record);
    setFormData(record || {});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (formType === "price") {
      if (!formData.productId || !formData.dealerId || !formData.price) {
        alert("Vui lòng điền đầy đủ thông tin giá sỉ!");
        return;
      }
      if (isEditing) {
        setWholesalePrices((prev) =>
          prev.map((p) =>
            p.priceId === formData.priceId ? formData : p
          )
        );
      } else {
        setWholesalePrices((prev) => [
          ...prev,
          { ...formData, priceId: Date.now() },
        ]);
      }
    } else {
      if (!formData.dealerId || !formData.description) {
        alert("Vui lòng điền thông tin khuyến mãi!");
        return;
      }
      if (isEditing) {
        setPromotions((prev) =>
          prev.map((p) =>
            p.policyId === formData.policyId ? formData : p
          )
        );
      } else {
        setPromotions((prev) => [
          ...prev,
          { ...formData, policyId: Date.now() },
        ]);
      }
    }
    handleClose();
  };

  const handleDelete = (type, id) => {
    if (window.confirm("Xác nhận xóa bản ghi này?")) {
      if (type === "price")
        setWholesalePrices((prev) => prev.filter((p) => p.priceId !== id));
      else setPromotions((prev) => prev.filter((p) => p.policyId !== id));
    }
  };

  // ==== Render từng tab ====
  const renderWholesaleTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">💰 Giá sỉ đại lý</h2>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          onClick={() => handleOpen("price")}
        >
          + Thêm giá sỉ
        </button>
      </div>
      <table className="w-full border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr className="text-left">
            <th className="p-3">Product ID</th>
            <th className="p-3">Dealer ID</th>
            <th className="p-3">Giá (₫)</th>
            <th className="p-3">Hiệu lực từ</th>
            <th className="p-3">Đến</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {wholesalePrices.map((p) => (
            <tr key={p.priceId} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="p-3">{p.productId}</td>
              <td className="p-3">{p.dealerId}</td>
              <td className="p-3 font-semibold">{p.price.toLocaleString()}</td>
              <td className="p-3">{p.validFrom}</td>
              <td className="p-3">{p.validTo}</td>
              <td className="p-3 flex gap-2 justify-center">
                <button
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  onClick={() => handleOpen("price", p)}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  onClick={() => handleDelete("price", p.priceId)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPromotionTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🎁 Chính sách khuyến mãi</h2>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          onClick={() => handleOpen("promotion")}
        >
          + Thêm khuyến mãi
        </button>
      </div>
      <table className="w-full border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr className="text-left">
            <th className="p-3">Dealer ID</th>
            <th className="p-3">Mô tả</th>
            <th className="p-3">% Giảm</th>
            <th className="p-3">Bắt đầu</th>
            <th className="p-3">Kết thúc</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((p) => (
            <tr key={p.policyId} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="p-3">{p.dealerId}</td>
              <td className="p-3">{p.description}</td>
              <td className="p-3 font-semibold">{p.discountPercent}%</td>
              <td className="p-3">{p.startDate}</td>
              <td className="p-3">{p.endDate}</td>
              <td className="p-3 flex gap-2 justify-center">
                <button
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  onClick={() => handleOpen("promotion", p)}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  onClick={() => handleDelete("promotion", p.policyId)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Box className="p-6 dark:text-white">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        ⚙️ Quản lý giá & khuyến mãi theo đại lý
      </Typography>

      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ mb: 3 }}>
        <Tab label="Giá sỉ đại lý" />
        <Tab label="Chính sách khuyến mãi" />
      </Tabs>

      {tab === 0 ? renderWholesaleTab() : renderPromotionTab()}

      {/* ===== Modal Form ===== */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditing ? "✏️ Chỉnh sửa" : "➕ Thêm"}{" "}
          {formType === "price" ? "Giá sỉ đại lý" : "Chính sách khuyến mãi"}
        </DialogTitle>
        <DialogContent className="space-y-3 mt-2">
          {formType === "price" ? (
            <>
              <TextField
                label="Product ID"
                name="productId"
                fullWidth
                value={formData.productId || ""}
                onChange={handleChange}
              />
              <TextField
                label="Dealer ID"
                name="dealerId"
                fullWidth
                value={formData.dealerId || ""}
                onChange={handleChange}
              />
              <TextField
                label="Giá (₫)"
                name="price"
                type="number"
                fullWidth
                value={formData.price || ""}
                onChange={handleChange}
              />
              <TextField
                label="Hiệu lực từ"
                name="validFrom"
                type="date"
                fullWidth
                value={formData.validFrom || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Đến"
                name="validTo"
                type="date"
                fullWidth
                value={formData.validTo || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : (
            <>
              <TextField
                label="Dealer ID"
                name="dealerId"
                fullWidth
                value={formData.dealerId || ""}
                onChange={handleChange}
              />
              <TextField
                label="Mô tả"
                name="description"
                fullWidth
                value={formData.description || ""}
                onChange={handleChange}
              />
              <TextField
                label="% Giảm giá"
                name="discountPercent"
                type="number"
                fullWidth
                value={formData.discountPercent || ""}
                onChange={handleChange}
              />
              <TextField
                label="Điều kiện (JSON)"
                name="conditions"
                fullWidth
                value={formData.conditions || ""}
                onChange={handleChange}
              />
              <TextField
                label="Bắt đầu"
                name="startDate"
                type="date"
                fullWidth
                value={formData.startDate || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Kết thúc"
                name="endDate"
                type="date"
                fullWidth
                value={formData.endDate || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave} variant="contained" color="success">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PricingManagement;
