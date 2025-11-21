import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react'; // Import Lucide
import AdminService from '../../../../utils/api/services/admin.service'; 

const UserModal = ({ user, onClose, onSave }) => {
  // ... (Logic state giữ nguyên) ...
  const [form, setForm] = useState({
    username: user?.username || '', password: '', fullName: user?.fullName || '',
    email: user?.email || '', phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '', roleId: user?.roleId || '', dealerId: user?.dealerId || '',
  });
  const [roles, setRoles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const isEdit = !!user;

  useEffect(() => {
    const fetchDataForDropdowns = async () => {
      try {
        const [rolesRes, dealersRes] = await Promise.all([ AdminService.getAllRoles(), AdminService.getAllDealersBasic() ]);
        setRoles(rolesRes.data); setDealers(dealersRes.data);
      } catch (error) { console.error("Lỗi:", error); }
    };
    fetchDataForDropdowns();
  }, []);

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

  const selectedRole = roles.find(r => r.roleId === parseInt(form.roleId));
  const isDealerRole = selectedRole?.roleName === 'DealerManager' || selectedRole?.roleName === 'DealerStaff';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0d1b2a] text-white shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                {isEdit ? <UserCheck className="w-6 h-6"/> : <UserPlus className="w-6 h-6"/>}
             </div>
             <h3 className="text-xl font-bold text-slate-100">{isEdit ? "Cập nhật người dùng" : "Thêm người dùng"}</h3>
          </div>
          <button className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
           {/* ... (Nội dung form giữ nguyên các input, chỉ thay class border/bg nếu muốn đồng bộ 100% với modal trên) ... */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Họ và tên *</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full rounded-xl border-slate-700 bg-slate-800/50 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                </div>
                {/* ... Các input khác tương tự ... */}
                {/* Code dưới đây là ví dụ rút gọn, bạn copy lại nội dung input từ file gốc của bạn và chỉ cần update class css */}
                <div><label className="block text-sm font-medium text-slate-400 mb-1">Username *</label><input name="username" value={form.username} onChange={handleChange} required disabled={isEdit} className="w-full rounded-xl border-slate-700 bg-slate-800/50 px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed outline-none" /></div>
                <div><label className="block text-sm font-medium text-slate-400 mb-1">SĐT</label><input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full rounded-xl border-slate-700 bg-slate-800/50 px-4 py-2.5 outline-none focus:border-blue-500 transition" /></div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Vai trò *</label>
                    <select name="roleId" value={form.roleId} onChange={handleChange} required className="w-full rounded-xl border-slate-700 bg-slate-800/50 px-4 py-2.5 outline-none focus:border-blue-500 transition">
                    <option value="">-- Chọn vai trò --</option>
                    {roles.map(role => (<option key={role.roleId} value={role.roleId}>{role.roleName}</option>))}
                    </select>
                </div>
             </div>
             <div className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-400 mb-1">Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-xl border-slate-700 bg-slate-800/50 px-4 py-2.5 outline-none focus:border-blue-500 transition" /></div>
                <div><label className="block text-sm font-medium text-slate-400 mb-1">Mật khẩu {isEdit ? '' : '*'}</label><input type="password" name="password" value={form.password} onChange={handleChange} required={!isEdit} placeholder={isEdit ? "Để trống nếu không đổi" : "••••••"} className="w-full rounded-xl border-slate-700 bg-slate-800/50 px-4 py-2.5 outline-none focus:border-blue-500 transition" /></div>
                <div><label className="block text-sm font-medium text-slate-400 mb-1">Ngày sinh</label><input type="date" name="dateOfBirth" value={form.dateOfBirth || ''} onChange={handleChange} className="w-full rounded-xl border-slate-700 bg-slate-800/50 px-4 py-2.5 outline-none focus:border-blue-500 transition" /></div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Đại lý</label>
                    <select name="dealerId" value={form.dealerId || ''} onChange={handleChange} disabled={!isDealerRole} required={isDealerRole} className="w-full rounded-xl border-slate-700 bg-slate-800/50 px-4 py-2.5 outline-none focus:border-blue-500 transition disabled:opacity-50">
                    <option value="">-- Chọn đại lý --</option>
                    {dealers.map(dealer => (<option key={dealer.dealerId} value={dealer.dealerId}>{dealer.name}</option>))}
                    </select>
                </div>
             </div>
           </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-800">
            <button type="button" className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition" onClick={onClose}>Hủy</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition">{isEdit ? "Lưu thay đổi" : "Tạo người dùng"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;