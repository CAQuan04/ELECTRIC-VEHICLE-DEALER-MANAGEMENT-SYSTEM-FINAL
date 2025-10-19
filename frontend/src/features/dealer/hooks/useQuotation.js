import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook để quản lý quotations (báo giá)
 */
export const useQuotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadQuotations = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockQuotations = [
        { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', amount: 1200000000, date: '2025-10-10', status: 'Chờ phản hồi', validUntil: '2025-10-25' },
        { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', amount: 1500000000, date: '2025-10-12', status: 'Đã chấp nhận', validUntil: '2025-10-27' },
        { id: 3, customer: 'Lê Văn C', vehicle: 'Model S', amount: 2800000000, date: '2025-10-08', status: 'Từ chối', validUntil: '2025-10-23' }
      ];
      
      setQuotations(mockQuotations);
      return mockQuotations;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuotation = useCallback(async (quotationData) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newQuotation = {
        id: Date.now(),
        ...quotationData,
        date: new Date().toISOString().split('T')[0],
        status: 'Chờ phản hồi'
      };
      
      setQuotations(prev => [newQuotation, ...prev]);
      return newQuotation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuotationStatus = useCallback(async (quotationId, status) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQuotations(prev => 
        prev.map(q => 
          q.id === quotationId ? { ...q, status } : q
        )
      );
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateQuotationTotal = useCallback((basePrice, options = [], discount = 0) => {
    const optionsTotal = options.reduce((sum, opt) => sum + opt.price, 0);
    return basePrice + optionsTotal - discount;
  }, []);

  const getQuotationById = useCallback((quotationId) => {
    return quotations.find(q => q.id === parseInt(quotationId));
  }, [quotations]);

  return {
    quotations,
    loading,
    error,
    loadQuotations,
    createQuotation,
    updateQuotationStatus,
    calculateQuotationTotal,
    getQuotationById
  };
};

export default useQuotation;
