import React, { useState } from 'react';

const UserSurveyStep = ({ formData = {}, onSubmit, onBack, onSkip }) => {
  const [data, setData] = useState({
    interestedVehicles: formData.interestedVehicles || [],
    budgetRange: formData.budgetRange || '',
    purchaseTimeframe: formData.purchaseTimeframe || '',
    currentVehicle: formData.currentVehicle || '',
    priorityFeatures: formData.priorityFeatures || [],
    additionalNotes: formData.additionalNotes || ''
  });

  const vehicleTypes = [
    { id: 'sedan', name: 'Sedan', icon: '🚗' },
    { id: 'suv', name: 'SUV', icon: '🚙' },
    { id: 'hatchback', name: 'Hatchback', icon: '🚕' },
    { id: 'truck', name: 'Pickup Truck', icon: '🛻' },
    { id: 'luxury', name: 'Luxury', icon: '🏎️' },
    { id: 'electric', name: 'Electric', icon: '⚡' }
  ];

  const features = [
    { id: 'safety', name: 'An toàn', icon: '🛡️' },
    { id: 'performance', name: 'Hiệu suất', icon: '⚡' },
    { id: 'comfort', name: 'Tiện nghi', icon: '🪑' },
    { id: 'technology', name: 'Công nghệ', icon: '📱' },
    { id: 'fuel-efficiency', name: 'Tiết kiệm nhiên liệu', icon: '⛽' },
    { id: 'design', name: 'Thiết kế', icon: '🎨' }
  ];

  const handleVehicleToggle = (vehicleId) => {
    setData(prev => ({
      ...prev,
      interestedVehicles: prev.interestedVehicles.includes(vehicleId)
        ? prev.interestedVehicles.filter(id => id !== vehicleId)
        : [...prev.interestedVehicles, vehicleId]
    }));
  };

  const handleFeatureToggle = (featureId) => {
    setData(prev => ({
      ...prev,
      priorityFeatures: prev.priorityFeatures.includes(featureId)
        ? prev.priorityFeatures.filter(id => id !== featureId)
        : [...prev.priorityFeatures, featureId]
    }));
  };

  const handleInputChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Khảo sát sở thích
        </h2>
        <p className="text-gray-400">
          Giúp chúng tôi hiểu nhu cầu của bạn để đề xuất xe phù hợp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Vehicle Types */}
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Loại xe bạn quan tâm? (Có thể chọn nhiều)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicleTypes.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleVehicleToggle(vehicle.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  data.interestedVehicles.includes(vehicle.id)
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-3xl mb-2">{vehicle.icon}</div>
                <div className="font-medium">{vehicle.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Ngân sách dự kiến
          </label>
          <select
            value={data.budgetRange}
            onChange={(e) => handleInputChange('budgetRange', e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 hover:border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">Chọn mức giá</option>
            <option value="under-500m">Dưới 500 triệu</option>
            <option value="500m-800m">500 - 800 triệu</option>
            <option value="800m-1.2b">800 triệu - 1.2 tỷ</option>
            <option value="1.2b-2b">1.2 - 2 tỷ</option>
            <option value="over-2b">Trên 2 tỷ</option>
          </select>
        </div>

        {/* Purchase Timeframe */}
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Thời gian dự định mua xe
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { value: 'immediate', label: 'Ngay lập tức' },
              { value: '1-3months', label: '1-3 tháng' },
              { value: '3-6months', label: '3-6 tháng' },
              { value: 'over-6months', label: 'Trên 6 tháng' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('purchaseTimeframe', option.value)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  data.purchaseTimeframe === option.value
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Vehicle */}
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Xe hiện tại (nếu có)
          </label>
          <input
            type="text"
            value={data.currentVehicle}
            onChange={(e) => handleInputChange('currentVehicle', e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 hover:border-gray-500 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="VD: Honda City 2020, Toyota Vios 2019..."
          />
        </div>

        {/* Priority Features */}
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Tính năng ưu tiên (Có thể chọn nhiều)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => handleFeatureToggle(feature.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  data.priorityFeatures.includes(feature.id)
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="font-medium text-sm">{feature.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Ghi chú thêm (tùy chọn)
          </label>
          <textarea
            value={data.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-600 hover:border-gray-500 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows="4"
            placeholder="Chia sẻ thêm về nhu cầu sử dụng xe của bạn..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Quay lại
          </button>
          
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Bỏ qua
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

export default UserSurveyStep;
