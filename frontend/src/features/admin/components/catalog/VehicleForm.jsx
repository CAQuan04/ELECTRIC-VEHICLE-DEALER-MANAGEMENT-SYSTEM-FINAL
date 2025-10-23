
import React, { useState } from "react";
import { Button } from "../../components";

const VehicleForm = ({ onSaved }) => {
  const [form, setForm] = useState({
    brand: "Tesla",
    model: "",
    variant: "",
    trim: "",
    base_price: "",
    status: "active",
    battery_kwh: "",
    features: [],
  });
  const [saving, setSaving] = useState(false);

  // Mock vehicle list for demonstration
  const mockVehicles = [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        brand: form.brand,
        model: form.model,
        variant: form.variant,
        trim: form.trim || null,
        price: Number(form.base_price || 0),
        status: form.status,
        specifications: {
          battery: Number(form.battery_kwh || 0),
        },
        features: form.features,
      };

      // Adding the new vehicle to mock data
      const newVehicle = {
        id: `vehicle_${Date.now()}`,
        ...payload,
      };

      mockVehicles.push(newVehicle);

      // Mock response
      const res = { success: true, data: newVehicle };

      if (res?.success) {
        onSaved?.(res.data);
        alert("✅ Đã tạo xe mới!");
        setForm({
          ...form,
          model: "",
          variant: "",
          trim: "",
          base_price: "",
          battery_kwh: "",
          features: [],
        });
      } else {
        alert("❌ Tạo xe thất bại: " + (res?.error || "UNKNOWN"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi tạo xe");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col text-sm">
          Hãng
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="input"
          />
        </label>
        <label className="flex flex-col text-sm">
          Model
          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            className="input"
            placeholder="Model 3"
            required
          />
        </label>
        <label className="flex flex-col text-sm">
          Phiên bản
          <input
            name="variant"
            value={form.variant}
            onChange={handleChange}
            className="input"
            placeholder="Performance"
          />
        </label>
        <label className="flex flex-col text-sm">
          Trim
          <input
            name="trim"
            value={form.trim}
            onChange={handleChange}
            className="input"
            placeholder="Long Range"
          />
        </label>
        <label className="flex flex-col text-sm">
          Giá cơ bản (VND)
          <input
            name="base_price"
            type="number"
            value={form.base_price}
            onChange={handleChange}
            className="input"
            placeholder="Enter base price"
          />
        </label>
        <label className="flex flex-col text-sm">
          Pin (kWh)
          <input
            name="battery_kwh"
            type="number"
            value={form.battery_kwh}
            onChange={handleChange}
            className="input"
            placeholder="Enter battery capacity"
          />
        </label>
      </div>
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={saving}
          className="w-full p-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold"
        >
          {saving ? "Đang lưu..." : "➕ Tạo xe"}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
