import React, { useState } from 'react';
import { AdminService } from '@utils';
import { Button } from '../../components';

const VariantForm = ({ vehicleId, onAdded }) => {
  const [form, setForm] = useState({ name: '', battery_kwh: '', trim: '', price: '' });
  const [saving, setSaving] = useState(false);
  const handleChange = (e)=> setForm(prev => ({...prev, [e.target.name]: e.target.value}));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId) return alert('Chọn một xe trước!');
    setSaving(true);
    try {
      const res = await AdminService.addVariant(vehicleId, {
        name: form.name,
        trim: form.trim,
        battery_kwh: Number(form.battery_kwh||0),
        price: Number(form.price||0),
      });
      if (res?.success) {
        onAdded?.(res.data);
        alert('✅ Đã thêm phiên bản');
        setForm({ name:'', battery_kwh:'', trim:'', price:'' });
      } else {
        alert('❌ Thêm phiên bản thất bại');
      }
    } finally { setSaving(false); }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col text-sm">Tên phiên bản
          <input name="name" value={form.name} onChange={handleChange} className="input" required/>
        </label>
        <label className="flex flex-col text-sm">Trim
          <input name="trim" value={form.trim} onChange={handleChange} className="input"/>
        </label>
        <label className="flex flex-col text-sm">Pin (kWh)
          <input name="battery_kwh" type="number" value={form.battery_kwh} onChange={handleChange} className="input"/>
        </label>
        <label className="flex flex-col text-sm">Giá (VND)
          <input name="price" type="number" value={form.price} onChange={handleChange} className="input"/>
        </label>
      </div>
      <Button type="submit" variant="secondary" disabled={saving}>{saving ? 'Đang lưu...' : '➕ Thêm phiên bản'}</Button>
    </form>
  );
};

export default VariantForm;
