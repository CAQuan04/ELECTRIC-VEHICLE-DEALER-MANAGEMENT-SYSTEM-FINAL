import React, { useState, useEffect } from 'react';
import AdminService from '../../../../utils/api/services/admin.service'; 

const UserModal = ({ user, onClose, onSave }) => {
  // Ghi chú: State 'form' được khởi tạo đầy đủ các trường, khớp với API.
  const [form, setForm] = useState({
    username: user?.username || '',
    password: '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '', // Khởi tạo là chuỗi rỗng để input type="date" nhận
    roleId: user?.roleId || '',
    dealerId: user?.dealerId || '',
  });

  const [roles, setRoles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const isEdit = !!user;

  // Ghi chú: Lấy dữ liệu cho các dropdown Vai trò và Đại lý khi Modal được mở.
  useEffect(() => {
    const fetchDataForDropdowns = async () => {
      try {
        const [rolesRes, dealersRes] = await Promise.all([
          AdminService.getAllRoles(),
          AdminService.getAllDealersBasic()
        ]);
        setRoles(rolesRes.data);
        setDealers(dealersRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu cho dropdown:", error);
      }
    };
    fetchDataForDropdowns();
  }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần khi modal mở.

  // Ghi chú: Hàm cập nhật state chung cho tất cả các ô input.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Ghi chú: Hàm được gọi khi người dùng nhấn nút submit.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  // Ghi chú: Logic "thông minh" để kiểm tra và bật/tắt dropdown Đại lý.
  const selectedRole = roles.find(r => r.roleId === parseInt(form.roleId));
  const isDealerRole = selectedRole?.roleName === 'DealerManager' || selectedRole?.roleName === 'DealerStaff';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0d1b2a] text-white shadow-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h3 className="text-xl font-bold text-blue-400">{isEdit ? "Cập nhật người dùng" : "Thêm người dùng"}</h3>
          <button className="text-slate-400 hover:text-white" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Cột 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Họ và tên *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Username *</label>
                <input name="username" value={form.username} onChange={handleChange} required disabled={isEdit} className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Số điện thoại</label>
                <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Vai trò *</label>
                <select name="roleId" value={form.roleId} onChange={handleChange} required className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 focus:border-blue-500 focus:ring-blue-500">
                  <option value="">-- Chọn vai trò --</option>
                  {roles.map(role => (
                    <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mật khẩu {isEdit ? '' : '*'}</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required={!isEdit} placeholder={isEdit ? "Để trống nếu không đổi" : "••••••"} className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Ngày sinh</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth || ''} onChange={handleChange} className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Đại lý</label>
                <select 
                  name="dealerId" 
                  value={form.dealerId || ''} 
                  onChange={handleChange} 
                  disabled={!isDealerRole} 
                  required={isDealerRole} 
                  className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">-- Chọn đại lý (nếu có) --</option>
                  {dealers.map(dealer => (
                    <option key={dealer.dealerId} value={dealer.dealerId}>{dealer.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer (Nút bấm) */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
            <button type="button" className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 font-semibold" onClick={onClose}>Hủy</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold">{isEdit ? "Lưu thay đổi" : "Tạo người dùng"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;