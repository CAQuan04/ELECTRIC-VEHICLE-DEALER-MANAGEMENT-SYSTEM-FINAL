import React, { useState, useEffect } from "react";

const VehicleForm = ({ initial = null, onSaved, canDelete = false, onDelete }) => {
  const [form, setForm] = useState({
    vehicle_id: "",
    brand: "",
    model: "",
    version: "",
    base_price: "",
    status: "active",
    features: [],
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.model.trim()) return alert("Nhập brand và model");
    onSaved &&
      onSaved({
        ...form,
        base_price: Number(form.base_price || 0),
        features: Array.isArray(form.features) ? form.features : [],
      });
    if (!initial)
      setForm({
        vehicle_id: "",
        brand: "",
        model: "",
        version: "",
        base_price: "",
        status: "active",
        features: [],
      });
  };

  return (
    <form onSubmit={handleSave} className="space-y-3 text-sm text-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-slate-500">Brand</label>
          <input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
          />
        </div>
        <div>
          <label className="text-slate-500">Model</label>
          <input
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-slate-500">Version</label>
          <input
            value={form.version}
            onChange={(e) => setForm({ ...form, version: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
          />
        </div>
        <div>
          <label className="text-slate-500">Giá (VND)</label>
          <input
            type="number"
            value={form.base_price}
            onChange={(e) => setForm({ ...form, base_price: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
          />
        </div>
        <div>
          <label className="text-slate-500">Trạng thái</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-slate-500">Tính năng (phân tách bằng dấu phẩy)</label>
        <input
          value={(form.features || []).join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          className="w-full rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
        />
      </div>

      <div className="flex justify-end gap-2">
        {canDelete && (
          <button
            type="button"
            onClick={() => confirm("Xoá xe này?") && onDelete(form)}
            className="px-4 py-2 rounded-xl border border-rose-600 text-rose-300 hover:bg-rose-600/10"
          >
            Xoá
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold"
        >
          {initial ? "Lưu xe" : "Tạo xe"}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
