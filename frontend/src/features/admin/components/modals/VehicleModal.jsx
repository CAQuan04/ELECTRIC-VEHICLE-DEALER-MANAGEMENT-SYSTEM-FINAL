import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const VehicleModal = ({ vehicle, onClose, onSave }) => {
  const [form, setForm] = useState({
    id: "",
    model: "",
    brand: "",
    year: "",
    basePrice: "",
    color: "",
    status: "Active",
    image: "",
  });

  useEffect(() => {
    if (vehicle) setForm(vehicle);
  }, [vehicle]);

  const change = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0b1622] p-6 rounded-2xl border border-slate-700 shadow-xl w-full max-w-lg">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100">
            {form.id ? "Chỉnh sửa xe" : "Thêm xe mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            placeholder="Model (VD: VF 8 Plus)"
            className="w-full px-3 py-2 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100"
            value={form.model}
            onChange={(e) => change("model", e.target.value)}
            required
          />
          <input
            placeholder="Hãng (VD: VinFast)"
            className="w-full px-3 py-2 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100"
            value={form.brand}
            onChange={(e) => change("brand", e.target.value)}
          />
          <input
            type="number"
            placeholder="Năm sản xuất"
            className="w-full px-3 py-2 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100"
            value={form.year}
            onChange={(e) => change("year", e.target.value)}
          />
          <input
            placeholder="Giá cơ bản"
            className="w-full px-3 py-2 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100"
            value={form.basePrice}
            onChange={(e) => change("basePrice", e.target.value)}
          />
          <input
            placeholder="Màu chính"
            className="w-full px-3 py-2 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100"
            value={form.color}
            onChange={(e) => change("color", e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300">
              Hủy
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <Save className="w-4 h-4" /> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
