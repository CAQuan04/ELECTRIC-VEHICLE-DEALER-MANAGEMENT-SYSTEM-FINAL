import React, { useState } from 'react';

const PersonalInfoStepNew = ({ formData = {}, onSubmit, onBack }) => {
  const [data, setData] = useState({
    phoneNumber: formData.phoneNumber || '',
    dateOfBirth: formData.dateOfBirth || '',
    address: formData.address || '',
    city: formData.city || '',
    occupation: formData.occupation || '',
    emergencyContact: formData.emergencyContact || '',
    emergencyPhone: formData.emergencyPhone || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!data.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9+\-\s()]+$/.test(data.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    } else {
      const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'Bạn phải từ 18 tuổi trở lên';
      }
    }

    if (!data.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!data.city.trim()) {
      newErrors.city = 'Thành phố là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Thông tin cá nhân
        </h2>
        <p className="text-gray-400">
          Hoàn thiện hồ sơ của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Số điện thoại *
          </label>
          <input
            name="phoneNumber"
            type="tel"
            value={data.phoneNumber}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
            }`}
            placeholder="0123 456 789"
          />
          {errors.phoneNumber && (
            <p className="mt-2 text-sm text-red-400">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ngày sinh *
          </label>
          <input
            name="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-2 text-sm text-red-400">{errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Địa chỉ *
          </label>
          <input
            name="address"
            type="text"
            value={data.address}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors.address ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
            }`}
            placeholder="123 Đường ABC, Quận XYZ"
          />
          {errors.address && (
            <p className="mt-2 text-sm text-red-400">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Thành phố *
          </label>
          <select
            name="city"
            value={data.city}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors.city ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <option value="">Chọn thành phố</option>
            <option value="hanoi">Hà Nội</option>
            <option value="hcm">TP. Hồ Chí Minh</option>
            <option value="danang">Đà Nẵng</option>
            <option value="haiphong">Hải Phòng</option>
            <option value="cantho">Cần Thơ</option>
            <option value="other">Khác</option>
          </select>
          {errors.city && (
            <p className="mt-2 text-sm text-red-400">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nghề nghiệp
          </label>
          <input
            name="occupation"
            type="text"
            value={data.occupation}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 hover:border-gray-500 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Kỹ sư phần mềm, Bác sĩ, Giáo viên..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Người liên hệ khẩn cấp
            </label>
            <input
              name="emergencyContact"
              type="text"
              value={data.emergencyContact}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 hover:border-gray-500 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Họ tên người thân"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SĐT khẩn cấp
            </label>
            <input
              name="emergencyPhone"
              type="tel"
              value={data.emergencyPhone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 hover:border-gray-500 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="0123 456 789"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Quay lại
          </button>
          
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Tiếp tục
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoStepNew;
