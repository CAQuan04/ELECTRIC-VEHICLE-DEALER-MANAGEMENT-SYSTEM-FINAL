import React, { useState, useEffect } from 'react';
import provincesData from '../../../assets/tinh-xa-sapnhap-main/provinces.json';
import wardsData from '../../../assets/tinh-xa-sapnhap-main/wards.json';

const PersonalInfoStepV2 = ({ formData, errors, isLoading, onSubmit, onUpdateData, onBack }) => {
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
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
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
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center px-4 pt-6 pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
          Thông tin cá nhân
        </h1>
        <p className="text-gray-300 text-base">
          Hoàn thiện hồ sơ của bạn để tiếp tục
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6 px-4" onSubmit={handleSubmit}>
        {/* General Error */}
        {displayErrors.general && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-5 py-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{displayErrors.general}</span>
            </div>
          </div>
        )}

        {/* Main Form Grid - Two Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                Thông tin liên hệ
              </h3>

              {/* Phone - Full width in section */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Số điện thoại <span className="text-red-400">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={localFormData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 bg-gray-900/60 border-2 rounded-xl text-white text-base placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    displayErrors.phone ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  placeholder="VD: 0912345678"
                />
                {displayErrors.phone && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {displayErrors.phone}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-gray-400">Số điện thoại gồm 10-11 chữ số</p>
              </div>

              {/* Date of Birth */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ngày sinh
                </label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={localFormData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 bg-gray-900/60 border-2 rounded-xl text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    displayErrors.dateOfBirth ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                  }`}
                />
                {displayErrors.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {displayErrors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={localFormData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-gray-900/60 border-2 border-gray-600 rounded-xl text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column - Address Info */}
          <div className="space-y-6">
            <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                Địa chỉ
              </h3>

              {/* Street Address */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Địa chỉ cụ thể
                </label>
                <input
                  name="address"
                  type="text"
                  value={localFormData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-gray-900/60 border-2 border-gray-600 rounded-xl text-white text-base placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                  placeholder="VD: 123 Nguyễn Văn Linh"
                />
              </div>

              {/* Province */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tỉnh/Thành phố
                </label>
                <select
                  name="provinceId"
                  value={localFormData.provinceId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-gray-900/60 border-2 border-gray-600 rounded-xl text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phường/Xã/Thị trấn
                </label>
                <select
                  name="wardId"
                  value={localFormData.wardId}
                  onChange={handleInputChange}
                  disabled={!localFormData.provinceId}
                  className="w-full px-4 py-3.5 bg-gray-900/60 border-2 border-gray-600 rounded-xl text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>

            {/* Info Box */}
            <div className="bg-blue-900/30 border border-blue-500/40 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-200 text-sm leading-relaxed">
                  Thông tin này giúp chúng tôi cung cấp dịch vụ tốt hơn cho bạn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 flex justify-center items-center py-3.5 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Quay lại
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex justify-center items-center py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
    </div>
  );
};

export default PersonalInfoStepV2;
