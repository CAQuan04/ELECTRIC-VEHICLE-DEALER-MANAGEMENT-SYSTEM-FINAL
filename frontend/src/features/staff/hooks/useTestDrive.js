import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook để quản lý test drives (lái thử)
 */
export const useTestDrive = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTestDrives = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockTestDrives = [
        { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', date: '2025-10-15', time: '10:00', status: 'Đã xác nhận', phone: '0901234567' },
        { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', date: '2025-10-16', time: '14:00', status: 'Chờ xác nhận', phone: '0902345678' },
        { id: 3, customer: 'Lê Văn C', vehicle: 'Model S', date: '2025-10-14', time: '09:00', status: 'Hoàn thành', phone: '0903456789' },
        { id: 4, customer: 'Phạm Thị D', vehicle: 'Model X', date: '2025-10-17', time: '15:30', status: 'Đã xác nhận', phone: '0904567890' }
      ];

      // Apply filters
      if (filters.status) {
        const statusMap = {
          'pending': 'Chờ xác nhận',
          'confirmed': 'Đã xác nhận',
          'completed': 'Hoàn thành'
        };
        mockTestDrives = mockTestDrives.filter(td => td.status === statusMap[filters.status]);
      }

      if (filters.date) {
        mockTestDrives = mockTestDrives.filter(td => td.date === filters.date);
      }
      
      setTestDrives(mockTestDrives);
      return mockTestDrives;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTestDrive = useCallback(async (testDriveData) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTestDrive = {
        id: Date.now(),
        ...testDriveData,
        status: 'Chờ xác nhận'
      };
      
      setTestDrives(prev => [newTestDrive, ...prev]);
      return newTestDrive;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTestDriveStatus = useCallback(async (testDriveId, status) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTestDrives(prev => 
        prev.map(td => 
          td.id === testDriveId ? { ...td, status } : td
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

  const cancelTestDrive = useCallback(async (testDriveId, reason) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTestDrives(prev => 
        prev.map(td => 
          td.id === testDriveId ? { ...td, status: 'Đã hủy', cancelReason: reason } : td
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

  const getTestDrivesByDate = useCallback((date) => {
    return testDrives.filter(td => td.date === date);
  }, [testDrives]);

  const getUpcomingTestDrives = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return testDrives.filter(td => 
      td.date >= today && (td.status === 'Đã xác nhận' || td.status === 'Chờ xác nhận')
    );
  }, [testDrives]);

  const getAvailableTimeSlots = useCallback((date) => {
    const bookedSlots = testDrives
      .filter(td => td.date === date && td.status !== 'Đã hủy')
      .map(td => td.time);
    
    const allSlots = [
      '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  }, [testDrives]);

  return {
    testDrives,
    loading,
    error,
    loadTestDrives,
    createTestDrive,
    updateTestDriveStatus,
    cancelTestDrive,
    getTestDrivesByDate,
    getUpcomingTestDrives,
    getAvailableTimeSlots
  };
};

export default useTestDrive;
