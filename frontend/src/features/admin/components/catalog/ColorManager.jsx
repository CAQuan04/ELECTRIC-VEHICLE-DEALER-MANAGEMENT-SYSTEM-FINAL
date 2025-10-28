import React, { useState, useEffect } from "react";

const ColorManager = ({ colors, onSaved, onDeleted, canEdit = true }) => {
  const [form, setForm] = useState({ color_id: "", name: "", hex_code: "#ffffff" });
  const [editing, setEditing] = useState(null);
  const [list, setList] = useState(colors || []);

  useEffect(() => setList(colors || []), [colors]);

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nhập tên màu");
    const newColor = {
      ...form,
      color_id: form.color_id || "C" + Math.random().toString(36).substring(2, 7).toUpperCase(),
    };
    if (editing) {
      setList(list.map((c) => (c.color_id === editing ? newColor : c)));
      onSaved && onSaved(newColor, "update");
    } else {
      setList([newColor, ...list]);
      onSaved && onSaved(newColor, "create");
    }
    setEditing(null);
    setForm({ color_id: "", name: "", hex_code: "#ffffff" });
  };

  const remove = (c) => {
    if (confirm(`Xoá màu ${c.name}?`)) {
      setList(list.filter((x) => x.color_id !== c.color_id));
      onDeleted && onDeleted(c);
    }
  };

  return (
    <div className="space-y-3 text-slate-200">
      <form onSubmit={save} className="grid grid-cols-3 gap-3">
        <input
          value={form.name}
          placeholder="Tên màu"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
        />
        <input
          value={form.hex_code}
          placeholder="#rrggbb"
          onChange={(e) => setForm({ ...form, hex_code: e.target.value })}
          className="rounded-xl border border-slate-700 bg-[#0f172a]/70 px-3 py-2 text-slate-100"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold"
        >
          {editing ? "Lưu" : "Thêm"}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-auto">
        {list.map((c) => (
          <div
            key={c.color_id}
            className="flex items-center gap-3 p-2 rounded-xl border border-slate-700 bg-[#0f172a]/70 hover:bg-[#1e293b]/70 transition"
          >
            <div className="w-10 h-10 rounded-full border border-slate-500" style={{ backgroundColor: c.hex_code }} />
            <div className="flex-1">
              <div className="text-slate-100 font-medium">{c.name}</div>
              <div className="text-slate-400 text-xs">{c.hex_code}</div>
            </div>
            {canEdit && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    setEditing(c.color_id);
                    setForm(c);
                  }}
                  className="text-xs px-2 py-1 bg-sky-600/30 text-white rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => remove(c)}
                  className="text-xs px-2 py-1 bg-rose-600/30 text-rose-200 rounded"
                >
                  Xoá
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorManager;
