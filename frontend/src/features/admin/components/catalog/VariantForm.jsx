import React, { useState, useEffect } from "react";

const VariantForm = ({ vehicleId, colors, initial = null, onSaved, onDeleted, canEdit = true }) => {
  const [form, setForm] = useState({
    variant_id: "",
    trim: "",
    battery_kwh: "",
    color_options: [],
    features: [],
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const toggleColor = (cid) => {
    setForm((f) => {
      const exists = f.color_options.includes(cid);
      return {
        ...f,
        color_options: exists ? f.color_options.filter((c) => c !== cid) : [...f.color_options, cid],
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.trim) return alert("Nhập trim!");
    const variant = {
      ...form,
      variant_id: form.variant_id || "VT" + Math.random().toString(36).substring(2, 7).toUpperCase(),
      battery_kwh: Number(form.battery_kwh || 0),
    };
    onSaved && onSaved(variant);
    if (!initial)
      setForm({ variant_id: "", trim: "", battery_kwh: "", color_options: [], features: [] });
  };

  return (
    <form onSubmit={handleSave} className="space-y-3 text-sm text-slate-200">
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Trim (RWD)"
          value={form.trim}
          onChange={(e) => setForm({ ...form, trim: e.target.value })}
          className="rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
        />
        <input
          type="number"
          placeholder="Battery (kWh)"
          value={form.battery_kwh}
          onChange={(e) => setForm({ ...form, battery_kwh: e.target.value })}
          className="rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
        />
      </div>

      <div>
        <label className="text-slate-300">Chọn màu</label>
        <div className="flex gap-2 flex-wrap mt-2">
          {colors.map((c) => (
            <button
              key={c.color_id}
              type="button"
              onClick={() => toggleColor(c.color_id)}
              className={`flex items-center gap-2 px-2 py-1 rounded-full border transition ${
                form.color_options.includes(c.color_id)
                  ? "border-sky-500 bg-sky-900/40"
                  : "border-slate-700 bg-[#0f172a]/70"
              }`}
            >
              <span
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: c.hex_code }}
                title={c.name}
              />
              <span className="text-slate-100 text-xs">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <input
        placeholder="Features (Autopilot, etc)"
        value={(form.features || []).join(", ")}
        onChange={(e) =>
          setForm({
            ...form,
            features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
          })
        }
        className="w-full rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
      />

      <div className="flex justify-end gap-2">
        {initial && (
          <button
            type="button"
            onClick={() => confirm("Xoá phiên bản?") && onDeleted(initial)}
            className="px-3 py-2 rounded-xl border border-rose-600 text-rose-300 hover:bg-rose-600/10"
          >
            Xoá
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold"
        >
          {initial ? "Lưu" : "Thêm"}
        </button>
      </div>
    </form>
  );
};

export default VariantForm;
