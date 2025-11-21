// File: src/features/admin/components/modals/VehicleModal.jsx
import React, { useEffect, useState } from "react";
import { Save, X, Car } from "lucide-react";

const VehicleModal = ({ vehicle, onClose, onSave }) => {
  // ... (State logic giữ nguyên như cũ) ...
  const [form, setForm] = useState({
    vehicleId: null, model: "", brand: "", year: "", basePrice: "", imageUrl: "",
  });

  useEffect(() => {
    if (vehicle) {
      setForm({ vehicleId: vehicle.vehicleId, model: vehicle.model || "", brand: vehicle.brand || "", year: vehicle.year || "", basePrice: vehicle.basePrice || "", imageUrl: vehicle.imageUrl || "" });
    } else {
      setForm({ vehicleId: null, model: "", brand: "", year: "", basePrice: "", imageUrl: "" });
    }
  }, [vehicle]);

  const handleChange = (e) => { const { name, value } = e.target; setForm(prevForm => ({ ...prevForm, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...form, year: form.year ? parseInt(form.year, 10) : null, basePrice: form.basePrice ? parseFloat(form.basePrice) : null };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Tăng max-w-lg -> max-w-2xl */}
      <div className="bg-[#0b1622] p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-2xl animate-fade-in-up">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/20">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-slate-100">
              {form.vehicleId ? "Chỉnh sửa xe" : "Thêm xe mới"}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition">
            <X className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Input to hơn: py-3.5, text-lg */}
            <div>
               <label className="block text-base font-medium text-slate-400 mb-2">Tên Model</label>
               <input name="model" placeholder="VD: VF 9 Plus" className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.model} onChange={handleChange} required />
            </div>
            <div>
               <label className="block text-base font-medium text-slate-400 mb-2">Hãng xe</label>
               <input name="brand" placeholder="VD: VinFast" className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.brand} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-base font-medium text-slate-400 mb-2">Năm SX</label>
                   <input type="number" name="year" placeholder="2025" className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.year} onChange={handleChange} />
                </div>
                <div>
                   <label className="block text-base font-medium text-slate-400 mb-2">Giá cơ bản</label>
                   <input type="number" name="basePrice" placeholder="VNĐ" className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.basePrice} onChange={handleChange} />
                </div>
            </div>
            <div>
               <label className="block text-base font-medium text-slate-400 mb-2">Hình ảnh (URL)</label>
               <input name="imageUrl" placeholder="https://..." className="w-full px-5 py-3.5 rounded-2xl bg-[#0f1b2e] border border-slate-700 text-slate-100 text-lg placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition" value={form.imageUrl} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-700/50">
            <button type="button" onClick={onClose} className="px-7 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition text-lg font-semibold">
              Hủy
            </button>
            <button type="submit" className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 transition text-lg">
              <Save className="w-6 h-6" /> Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;