import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook để quản lý inventory (kho xe)
 */
export const useDealerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInventory = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInventory = [
        { id: 1, model: 'Model 3', total: 15, available: 12, reserved: 3, color: 'White', status: 'Sẵn sàng' },
        { id: 2, model: 'Model Y', total: 10, available: 8, reserved: 2, color: 'Black', status: 'Sẵn sàng' },
        { id: 3, model: 'Model S', total: 6, available: 5, reserved: 1, color: 'Red', status: 'Sẵn sàng' },
        { id: 4, model: 'Model X', total: 3, available: 3, reserved: 0, color: 'Blue', status: 'Sẵn sàng' }
      ];
      
      setInventory(mockInventory);
      return mockInventory;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStock = useCallback(async (stockId, updates) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setInventory(prev => 
        prev.map(item => 
          item.id === stockId ? { ...item, ...updates } : item
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

  const requestStock = useCallback(async (requestData) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Yêu cầu nhập xe đã được gửi' };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTotalStats = useCallback(() => {
    return {
      totalVehicles: inventory.reduce((sum, item) => sum + item.total, 0),
      availableVehicles: inventory.reduce((sum, item) => sum + item.available, 0),
      reservedVehicles: inventory.reduce((sum, item) => sum + item.reserved, 0)
    };
  }, [inventory]);

  return {
    inventory,
    loading,
    error,
    loadInventory,
    updateStock,
    requestStock,
    getTotalStats
  };
};

export default useDealerInventory;
