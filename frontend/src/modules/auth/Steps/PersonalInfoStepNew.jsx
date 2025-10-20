import React, { useState, useEffect } from 'react';
import provincesData from '../../../assets/tinh-xa-sapnhap-main/provinces.json';
import wardsData from '../../../assets/tinh-xa-sapnhap-main/wards.json';

const PersonalInfoStep = ({ formData, errors, isLoading, onSubmit, onUpdateData, onBack }) => {
  const [localFormData, setLocalFormData] = useState({
    phone: formData.phone || '',
    dateOfBirth: formData.dateOfBirth || '',
    gender: formData.gender || '',
    address: formData.address || '',
    provinceId: formData.provinceId || '',
    provinceName: formData.provinceName || '',
    wardId: formData.wardId || '',
    wardName: formData.wardName || ''
  });

  const [localErrors, setLocalErrors] = useState({});
  const [availableWards, setAvailableWards] = useState([]);

  // Filter wards based on selected province
  useEffect(() => {
    if (localFormData.provinceId) {
      const filteredWards = wardsData.filter(ward => ward.province_id === localFormData.provinceId);
      setAvailableWards(filteredWards);
    } else {
      setAvailableWards([]);
    }
  }, [localFormData.provinceId]);

  const validateForm = () => {
    const newErrors = {};

    // Phone validation
    if (!localFormData.phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(localFormData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Date of Birth validation
    if (localFormData.dateOfBirth) {
      const birthDate = new Date(localFormData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.dateOfBirth = 'Bạn phải từ 18 tuổi trở lên';
      }
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Ngày sinh không thể là tương lai';
      }
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let updatedData = { [name]: value };
    
    // Handle province selection
    if (name === 'provinceId') {
      const selectedProvince = provincesData.find(province => province.id === value);
      updatedData = {
        provinceId: value,
        provinceName: selectedProvince ? selectedProvince.name : '',
        wardId: '', // Reset ward when province changes
        wardName: ''
      };
    }
    
    // Handle ward selection
    if (name === 'wardId') {
      const selectedWard = availableWards.find(ward => ward.id === value);
      updatedData = {
        wardId: value,
        wardName: selectedWard ? selectedWard.name : ''
      };
    }
    
    setLocalFormData(prev => ({
      ...prev,
      ...updatedData
    }));

    // Update parent component data
    onUpdateData(updatedData);
    
    // Clear error when user starts typing
    if (localErrors[name]) {
      setLocalErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(localFormData);
  };

  const displayErrors = { ...localErrors, ...errors };

  return (
    <>
      {/* Header */}
      <div className="text-center px-4 pt-8 pb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-light text-white mb-3 tracking-wide">
          Thông tin cá nhân
        </h1>
        <p className="text-gray-300 text-lg font-light">
          Hoàn thiện hồ sơ của bạn
        </p>
        <div className="mt-6 w-16 h-0.5 bg-blue-600 mx-auto"></div>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* General Error */}
        {displayErrors.general && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{displayErrors.general}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Info Section */}
          <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              Thông tin liên hệ
            </h3>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Số điện thoại *
              </label>
              <input
                name="phone"
                type="tel"
                value={localFormData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  displayErrors.phone ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                }`}
                placeholder="0123456789"
              />
              {displayErrors.phone && (
                <p className="mt-2 text-sm text-red-400">{displayErrors.phone}</p>
              )}
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Ngày sinh
                </label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={localFormData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    displayErrors.dateOfBirth ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                  }`}
                />
                {displayErrors.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-400">{displayErrors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={localFormData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              Địa chỉ
            </h3>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Địa chỉ cụ thể
              </label>
              <input
                name="address"
                type="text"
                value={localFormData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                placeholder="Số nhà, tên đường"
              />
            </div>

            {/* Province */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Tỉnh/Thành phố
              </label>
              <select
                name="provinceId"
                value={localFormData.provinceId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provincesData.map(province => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Phường/Xã/Thị trấn
              </label>
              <select
                name="wardId"
                value={localFormData.wardId}
                onChange={handleInputChange}
                disabled={!localFormData.provinceId}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {localFormData.provinceId ? 'Chọn phường/xã/thị trấn' : 'Vui lòng chọn tỉnh/thành phố trước'}
                </option>
                {availableWards.map(ward => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-200 text-sm">
                  Thông tin này giúp chúng tôi cung cấp dịch vụ tốt hơn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 flex justify-center items-center py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Quay lại
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex justify-center items-center py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang lưu...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Tiếp tục</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default PersonalInfoStep;