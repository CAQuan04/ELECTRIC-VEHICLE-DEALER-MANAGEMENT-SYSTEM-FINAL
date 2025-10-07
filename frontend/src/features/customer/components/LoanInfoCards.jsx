import React from 'react';

const LoanInfoCards = ({ 
  loans = [], 
  loading = false,
  onMakePayment,
  onViewDetails 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getPaymentStatus = (nextPaymentDate) => {
    const today = new Date();
    const paymentDate = new Date(nextPaymentDate);
    const daysDiff = Math.ceil((paymentDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return { status: 'overdue', label: 'Quá hạn', colorClass: 'bg-red-100 text-red-700' };
    if (daysDiff <= 3) return { status: 'urgent', label: 'Sắp đến hạn', colorClass: 'bg-orange-100 text-orange-700' };
    if (daysDiff <= 7) return { status: 'upcoming', label: 'Sắp tới', colorClass: 'bg-blue-100 text-blue-700' };
    return { status: 'normal', label: 'Bình thường', colorClass: 'bg-green-100 text-green-700' };
  };

  const calculateProgress = (remainingAmount, loanAmount) => {
    const paidAmount = loanAmount - remainingAmount;
    return (paidAmount / loanAmount) * 100;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 p-6 rounded-2xl animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!loans || loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
        <span className="text-6xl mb-4 text-gray-400">💳</span>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có khoản vay nào</h3>
        <p className="text-gray-500">Bạn chưa có khoản vay nào đang hoạt động.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {loans.map((loan) => {
        const paymentStatus = getPaymentStatus(loan.nextPaymentDate);
        const progress = calculateProgress(loan.remainingAmount, loan.loanAmount);
        
        return (
          <div key={loan.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xl font-bold text-gray-800">
                Khoản vay {loan.vehicleModel}
              </h4>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${paymentStatus.colorClass}`}>
                <span className="text-xs">🔵</span>
                {paymentStatus.label}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Số tiền vay:</span>
                <span className="font-bold text-gray-800">
                  {formatCurrency(loan.loanAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Còn lại:</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(loan.remainingAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Hàng tháng:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(loan.monthlyPayment)}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Tiến độ thanh toán</span>
                <span className="text-sm font-semibold text-gray-700">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 mb-6">
              <div className="text-sm text-gray-600 mb-1">Kỳ thanh toán tiếp theo:</div>
              <div className="text-base font-bold text-gray-800">
                {formatDate(loan.nextPaymentDate)}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:from-blue-600 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => onMakePayment && onMakePayment(loan)}
              >
                <span className="text-base">💳</span>
                Thanh toán ngay
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800"
                onClick={() => onViewDetails && onViewDetails(loan)}
              >
                <span className="text-base">📊</span>
                Chi tiết
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoanInfoCards;