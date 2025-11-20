// File: src/features/admin/components/modals/VehicleModal.jsx
import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const VehicleModal = ({ vehicle, onClose, onSave }) => {
  // ... (Phần logic state không đổi) ...
  const [form, setForm] = useState({
    vehicleId: null,
    model: "",
    brand: "",
    year: "",
    basePrice: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (vehicle) {
      setForm({
        vehicleId: vehicle.vehicleId,
        model: vehicle.model || "",
        brand: vehicle.brand || "",
        year: vehicle.year || "",
        basePrice: vehicle.basePrice || "",
        imageUrl: vehicle.imageUrl || "",
      });
    } else {
      setForm({
        vehicleId: null,
        model: "",
        brand: "",
        year: "",
        basePrice: "",
        imageUrl: "",
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...form,
      year: form.year ? parseInt(form.year, 10) : null,
      basePrice: form.basePrice ? parseFloat(form.basePrice) : null,
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0b1622] p-6 rounded-2xl border border-slate-700 shadow-xl w-full max-w-lg animate-fade-in-up">
        <div className="flex justify-between items-center mb-6"> {/* Tăng khoảng cách mb-4 lên mb-6 */}
          {/* THAY ĐỔI 1: Tăng kích thước tiêu đề lên 3xl */}
          <h3 className="text-3xl font-bold text-slate-100">
            {form.vehicleId ? "Chỉnh sửa xe" : "Thêm xe mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-6 h-6" /> {/* Icon to hơn 1 chút */}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Tăng space-y-4 lên space-y-5 */}
          {/* THAY ĐỔI 2: Tăng chữ input lên text-lg */}
          <input
            name="model"
            placeholder="Model (VD: VF 8 Plus)"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.model}
            onChange={handleChange}
            required
          />
          <input
            name="brand"
            placeholder="Hãng (VD: VinFast)"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.brand}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Năm sản xuất"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.year}
            onChange={handleChange}
          />
          <input
            type="number"
            name="basePrice"
            placeholder="Giá cơ bản (chỉ nhập số)"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.basePrice}
            onChange={handleChange}
          />
          <input
            name="imageUrl"
            placeholder="URL Hình ảnh"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-4 pt-5 border-t border-slate-700"> {/* Tăng pt-4, gap-3 */}
            {/* THAY ĐỔI 3: Tăng chữ nút bấm lên text-lg */}
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition text-lg font-medium">
              Hủy
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:brightness-110 transition text-lg">
              <Save className="w-5 h-5" /> {/* Icon to hơn 1 chút */}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;