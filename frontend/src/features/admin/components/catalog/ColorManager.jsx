import React, { useState } from "react";
import { AdminService } from "@utils";
import { Button } from "../../components";

const ColorManager = ({ vehicleId, onSaved }) => {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#ffffff");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!vehicleId) return alert("Chọn một xe trước!");
    setSaving(true);
    try {
      const res = await AdminService.addColor(vehicleId, { name, hex });
      if (res?.success) {
        onSaved?.(res.data);
        setName("");
        setHex("#ffffff");
      } else {
        alert("❌ Thêm màu thất bại");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 items-end">
        <label className="flex flex-col text-sm">
          Tên màu
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Deep Blue"
          />
        </label>
        <label className="flex flex-col text-sm">
          Mã HEX
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="input"
            placeholder="#0b60ff"
          />
        </label>
        <Button onClick={handleAdd} disabled={saving}>
          {saving ? "Đang lưu..." : "➕ Thêm màu"}
        </Button>
      </div>
    </div>
  );
};

export default ColorManager;
