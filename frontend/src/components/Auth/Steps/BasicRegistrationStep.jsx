import React, { useState } from 'react';

const BasicRegistrationStepV3 = ({ formData = {}, onNext, onBack, errors = {}, isLoading }) => {
  const [data, setData] = useState({
    email: formData.email || '',
    username: formData.username || '',
    fullName: formData.fullName || '',
    password: formData.password || '',
    confirmPassword: formData.confirmPassword || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) {
      onNext(data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">
        Thông tin đăng ký cơ bản
      </h2>
      
      {errors.general && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.general}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Username & Full Name - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-200 mb-2.5 text-sm font-medium">
              Tên đăng nhập <span className="text-red-400">*</span>
            </label>
            <input
              name="username"
              type="text"
              value={data.username}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-600/30 rounded-xl text-white text-base placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2.5 text-sm font-medium">
              Họ và tên đầy đủ <span className="text-red-400">*</span>
            </label>
            <input
              name="fullName"
              type="text"
              value={data.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-600/30 rounded-xl text-white text-base placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </div>
        </div>

        {/* Row 2: Email - Full width */}
        <div>
          <label className="block text-gray-200 mb-2.5 text-sm font-medium">
            Địa chỉ Email <span className="text-red-400">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-600/30 rounded-xl text-white text-base placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
            placeholder="example@email.com"
            required
          />
        </div>

        {/* Row 3: Password & Confirm Password - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-200 mb-2.5 text-sm font-medium">
              Mật khẩu <span className="text-red-400">*</span>
            </label>
            <input
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-600/30 rounded-xl text-white text-base placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
              placeholder="Nhập mật khẩu"
              required
            />
            <p className="mt-2 text-xs text-gray-400">Tối thiểu 6 ký tự</p>
          </div>

          <div>
            <label className="block text-gray-200 mb-2.5 text-sm font-medium">
              Xác nhận mật khẩu <span className="text-red-400">*</span>
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={data.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-600/30 rounded-xl text-white text-base placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3.5 px-6 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              ← Quay lại
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-red-900/30"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'Tiếp tục →'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicRegistrationStepV3;
