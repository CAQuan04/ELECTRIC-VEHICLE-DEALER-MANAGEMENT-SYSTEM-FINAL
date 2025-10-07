import React, { useState, useEffect } from 'react';
import { usePageLoading } from '../../../shared/components/LoadingHOC';
import '../../../shared/components/GlobalLoading.css';
import LoanInfoCards from './LoanInfoCards';
import PaymentHistory from './PaymentHistory';
import { CustomerMockAPI } from '../services/customerMockAPI';

const FinancingSection = () => {
  const { startLoading, stopLoading, isLoading } = usePageLoading();
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        startLoading('Đang tải thông tin tài chính...');
        
        // Tải dữ liệu song song
        const [financingData, paymentsData] = await Promise.all([
          CustomerMockAPI.getFinancingInfo(),
          CustomerMockAPI.getPaymentHistory()
        ]);
        
        // Extract loans from financing data
        const loansData = financingData.data?.loans || [];
        const paymentsDataArray = paymentsData.data || [];
        
        setLoans(loansData);
        
        // Transform payment data to match PaymentHistory component expectations
        const transformedPayments = paymentsDataArray.map(payment => ({
          id: payment.id,
          date: payment.paymentDate || payment.dueDate,
          amount: payment.amount,
          vehicleModel: payment.vehicleModel,
          status: payment.status,
          method: transformPaymentMethod(payment.paymentMethod),
          reference: payment.transactionId || `REF${payment.id.toString().padStart(6, '0')}`
        }));
        
        setPayments(transformedPayments);
        
        // Calculate summary from loans data
        const calculatedSummary = {
          totalDebt: loansData.reduce((sum, loan) => sum + loan.remainingAmount, 0),
          totalLoans: loansData.length,
          totalPaid: loansData.reduce((sum, loan) => sum + (loan.loanAmount - loan.remainingAmount), 0),
          totalPayments: paymentsDataArray.length,
          monthlyPayment: loansData.reduce((sum, loan) => sum + loan.monthlyPayment, 0),
          nextPaymentDate: loansData.length > 0 ? loansData[0].nextPaymentDate : null,
          nextPaymentAmount: loansData.length > 0 ? loansData[0].monthlyPayment : 0
        };
        
        setSummary(calculatedSummary);
      } catch (error) {
        console.error('Error loading financing data:', error);
      } finally {
        stopLoading();
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const transformPaymentMethod = (method) => {
    if (!method) return 'auto_debit';
    const methodMap = {
      'Chuyển khoản': 'bank_transfer',
      'Thẻ tín dụng': 'credit_card',
      'Tiền mặt': 'cash',
      'Trừ tự động': 'auto_debit'
    };
    return methodMap[method] || 'bank_transfer';
  };

  const handleMakePayment = (loan) => {
    console.log('Making payment for loan:', loan);
    // TODO: Implement payment flow
  };

  const handleViewLoanDetails = (loan) => {
    console.log('Viewing loan details:', loan);
    // TODO: Implement loan details view
  };

  const handlePaymentClick = (payment) => {
    console.log('Viewing payment details:', payment);
    // TODO: Implement payment details view
  };

  return (
    <div className="space-y-8">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="text-blue-100 text-sm font-semibold uppercase tracking-wide mb-2">
              Tổng dư nợ
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalDebt || 0)}
            </div>
            <div className="text-blue-100 text-xs mt-1">
              Từ {summary.totalLoans || 0} khoản vay
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="text-green-100 text-sm font-semibold uppercase tracking-wide mb-2">
              Đã thanh toán
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalPaid || 0)}
            </div>
            <div className="text-green-100 text-xs mt-1">
              {summary.totalPayments || 0} giao dịch
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="text-orange-100 text-sm font-semibold uppercase tracking-wide mb-2">
              Hàng tháng
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.monthlyPayment || 0)}
            </div>
            <div className="text-orange-100 text-xs mt-1">
              Tổng các kỳ hạn
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="text-purple-100 text-sm font-semibold uppercase tracking-wide mb-2">
              Kỳ hạn gần nhất
            </div>
            <div className="text-2xl font-bold">
              {summary.nextPaymentDate ? new Date(summary.nextPaymentDate).toLocaleDateString('vi-VN') : 'N/A'}
            </div>
            <div className="text-purple-100 text-xs mt-1">
              {formatCurrency(summary.nextPaymentAmount || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Loan Information Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin các khoản vay</h2>
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              {loans.length} khoản vay đang hoạt động
            </div>
          </div>
        </div>
        
        <LoanInfoCards 
          loans={loans}
          onMakePayment={handleMakePayment}
          onViewDetails={handleViewLoanDetails}
        />
      </div>

      {/* Payment History */}
      <div>
        <PaymentHistory 
          payments={payments}
          onPaymentClick={handlePaymentClick}
        />
      </div>
    </div>
  );
};

export default FinancingSection;