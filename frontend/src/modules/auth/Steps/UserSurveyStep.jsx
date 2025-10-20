import React, { useState } from 'react';

const UserSurveyStep = ({ formData, errors, isLoading, onSubmit, onSkip, onUpdateData, onBack }) => {
  const [localFormData, setLocalFormData] = useState({
    interestedVehicles: formData.interestedVehicles || [],
    budgetRange: formData.budgetRange || '',
    purchaseTimeframe: formData.purchaseTimeframe || '',
    currentVehicle: formData.currentVehicle || '',
    priorityFeatures: formData.priorityFeatures || [],
    additionalNotes: formData.additionalNotes || ''
  });

  const vehicleOptions = [
    { id: 'model-3', name: 'Model 3', description: 'Sedan hạng sang giá tốt', icon: '🚗' },
    { id: 'model-s', name: 'Model S', description: 'Sedan cao cấp hiệu năng cao', icon: '🏎️' },
    { id: 'model-x', name: 'Model X', description: 'SUV với cửa mở cánh chim', icon: '🚙' },
    { id: 'model-y', name: 'Model Y', description: 'SUV compact đa năng', icon: '🚐' },
    { id: 'cybertruck', name: 'Cybertruck', description: 'Bán tải tương lai', icon: '🛻' }
  ];

  const featureOptions = [
    { id: 'autopilot', name: 'Autopilot', description: 'Tự lái cấp độ 2' },
    { id: 'supercharging', name: 'Supercharging', description: 'Sạc nhanh siêu tốc' },
    { id: 'performance', name: 'Hiệu năng cao', description: 'Tăng tốc nhanh' },
    { id: 'range', name: 'Tầm hoạt động xa', description: 'Quãng đường dài' },
    { id: 'luxury', name: 'Nội thất sang trọng', description: 'Tiện nghi cao cấp' },
    { id: 'technology', name: 'Công nghệ tiên tiến', description: 'Tính năng thông minh' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));

    onUpdateData({ [name]: value });
  };

  const handleMultiSelectChange = (fieldName, value) => {
    setLocalFormData(prev => {
      const currentValues = prev[fieldName];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      onUpdateData({ [fieldName]: newValues });
      return { ...prev, [fieldName]: newValues };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localFormData);
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <>
      {/* Header */}
      <div className="text-center px-4 pt-8 pb-8">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-light text-white mb-3 tracking-wide">
          Khảo sát nhu cầu
        </h1>
        <p className="text-gray-300 text-lg font-light">
          Giúp chúng tôi hiểu bạn hơn để cung cấp dịch vụ tốt nhất
        </p>
        <div className="mt-6 w-16 h-0.5 bg-purple-600 mx-auto"></div>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.general}</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Interested Vehicles */}
          <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🚗</span>
              </div>
              Xe Tesla nào bạn quan tâm?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicleOptions.map((vehicle) => (
                <label 
                  key={vehicle.id}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    localFormData.interestedVehicles.includes(vehicle.id)
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={localFormData.interestedVehicles.includes(vehicle.id)}
                    onChange={() => handleMultiSelectChange('interestedVehicles', vehicle.id)}
                    className="sr-only"
                  />
                  <div className="text-3xl mb-2">{vehicle.icon}</div>
                  <span className="font-medium text-center">{vehicle.name}</span>
                  <p className="text-xs text-gray-400 mt-1 text-center">{vehicle.description}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                Ngân sách dự kiến
              </h3>

              <select
                name="budgetRange"
                value={localFormData.budgetRange}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-500"
              >
                <option value="">Chọn mức ngân sách</option>
                <option value="under-1b">Dưới 1 tỷ VNĐ</option>
                <option value="1b-2b">1 - 2 tỷ VNĐ</option>
                <option value="2b-3b">2 - 3 tỷ VNĐ</option>
                <option value="3b-5b">3 - 5 tỷ VNĐ</option>
                <option value="over-5b">Trên 5 tỷ VNĐ</option>
              </select>
            </div>

            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                Thời gian mua xe
              </h3>

              <select
                name="purchaseTimeframe"
                value={localFormData.purchaseTimeframe}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-500"
              >
                <option value="">Chọn thời gian</option>
                <option value="immediately">Ngay lập tức</option>
                <option value="1-3-months">1-3 tháng tới</option>
                <option value="3-6-months">3-6 tháng tới</option>
                <option value="6-12-months">6-12 tháng tới</option>
                <option value="over-1-year">Hơn 1 năm nữa</option>
                <option value="just-looking">Chỉ tìm hiểu</option>
              </select>
            </div>
          </div>

          {/* Priority Features */}
          <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              Tính năng ưu tiên
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureOptions.map((feature) => (
                <label 
                  key={feature.id}
                  className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    localFormData.priorityFeatures.includes(feature.id)
                      ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={localFormData.priorityFeatures.includes(feature.id)}
                    onChange={() => handleMultiSelectChange('priorityFeatures', feature.id)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <span className="font-medium">{feature.name}</span>
                    <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                  </div>
                  {localFormData.priorityFeatures.includes(feature.id) && (
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Current Vehicle & Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6">Xe hiện tại</h3>
              <input
                name="currentVehicle"
                type="text"
                value={localFormData.currentVehicle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                placeholder="VD: Toyota Camry 2020"
              />
            </div>

            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6">Ghi chú thêm</h3>
              <textarea
                name="additionalNotes"
                value={localFormData.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                placeholder="Chia sẻ thêm về nhu cầu của bạn..."
              />
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
            type="button"
            onClick={handleSkip}
            disabled={isLoading}
            className="flex-1 flex justify-center items-center py-3 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Bỏ qua
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex justify-center items-center py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang hoàn thành...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Hoàn thành đăng ký</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default UserSurveyStep;