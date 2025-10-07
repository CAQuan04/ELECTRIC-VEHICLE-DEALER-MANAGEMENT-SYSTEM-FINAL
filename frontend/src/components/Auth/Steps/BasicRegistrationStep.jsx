import React, { useState } from 'react';

const BasicRegistrationStep = ({ formData = {}, onSubmit }) => {
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
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Đăng ký tài khoản
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">
            Tên đăng nhập *
          </label>
          <input
            name="username"
            type="text"
            value={data.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            placeholder="username123"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Họ và tên *
          </label>
          <input
            name="fullName"
            type="text"
            value={data.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Email *
          </label>
          <input
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            placeholder="email@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Mật khẩu *
          </label>
          <input
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            placeholder="Mật khẩu"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Xác nhận mật khẩu *
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={data.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Tiếp tục
        </button>
      </form>
    </div>
  );
};

export default BasicRegistrationStep;