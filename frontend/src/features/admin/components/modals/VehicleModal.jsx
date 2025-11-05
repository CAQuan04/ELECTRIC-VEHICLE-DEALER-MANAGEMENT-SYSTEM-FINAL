// File: src/features/admin/components/modals/VehicleModal.jsx
import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const VehicleModal = ({ vehicle, onClose, onSave }) => {
  // Ghi chú: Khởi tạo state cho form, khớp chính xác với các trường cần thiết.
  const [form, setForm] = useState({
    vehicleId: null,
    model: "",
    brand: "",
    year: "",
    basePrice: "",
    imageUrl: "", // Sửa 'color' và 'image' thành 'imageUrl'
  });

  // Ghi chú: Điền dữ liệu vào form khi mở modal ở chế độ chỉnh sửa.
  useEffect(() => {
    if (vehicle) {
      // Chế độ sửa: điền dữ liệu từ prop 'vehicle'
      setForm({
        vehicleId: vehicle.vehicleId,
        model: vehicle.model || "",
        brand: vehicle.brand || "",
        year: vehicle.year || "",
        basePrice: vehicle.basePrice || "",
        imageUrl: vehicle.imageUrl || "",
      });
    } else {
      // Chế độ thêm mới: reset form
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

  // Ghi chú: Hàm cập nhật state chung cho tất cả các input.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  // Ghi chú: Hàm xử lý khi người dùng nhấn nút "Lưu".
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ghi chú: Chuẩn bị dữ liệu để gửi lên API.
    // Chuyển đổi 'year' và 'basePrice' từ chuỗi sang số.
    const dataToSave = {
      ...form,
      year: form.year ? parseInt(form.year, 10) : null,
      basePrice: form.basePrice ? parseFloat(form.basePrice) : null,
    };
    
    // Gọi hàm onSave được truyền từ component cha (VehicleCatalogue.jsx)
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0b1622] p-6 rounded-2xl border border-slate-700 shadow-xl w-full max-w-lg animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-100">
            {form.vehicleId ? "Chỉnh sửa xe" : "Thêm xe mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ghi chú: Mỗi input có 'name' khớp với key trong state 'form' */}
          <input
            name="model"
            placeholder="Model (VD: VF 8 Plus)"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.model}
            onChange={handleChange}
            required
          />
          <input
            name="brand"
            placeholder="Hãng (VD: VinFast)"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.brand}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Năm sản xuất"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.year}
            onChange={handleChange}
          />
          <input
            type="number"
            name="basePrice"
            placeholder="Giá cơ bản (chỉ nhập số)"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.basePrice}
            onChange={handleChange}
          />
          <input
            name="imageUrl"
            placeholder="URL Hình ảnh"
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition">
              Hủy
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:brightness-110 transition">
              <Save className="w-4 h-4" /> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;