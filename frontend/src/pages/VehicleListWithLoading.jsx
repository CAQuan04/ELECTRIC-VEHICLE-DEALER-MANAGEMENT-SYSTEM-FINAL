import React, { useEffect } from 'react';
import { LoadingPage, usePageLoading } from '../shared/components';
import { CustomerMockAPI } from '../services/mockAPIs/CustomerMockAPI';

const VehicleListWithLoading = () => {
  const { isPageLoading, loadingMessage, startPageLoading, stopPageLoading } = usePageLoading();
  const [vehicles, setVehicles] = React.useState([]);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        startPageLoading('Loading vehicle inventory...');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await CustomerMockAPI.getVehicles();
        setVehicles(response.data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        stopPageLoading();
      }
    };

    loadVehicles();
  }, [startPageLoading, stopPageLoading]);

  // Show loading page while loading
  if (isPageLoading) {
    return <LoadingPage message={loadingMessage} />;
  }

  // Show error if any
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error Loading Vehicles</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Show vehicles list
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Vehicle Inventory</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {vehicles.map(vehicle => (
          <div 
            key={vehicle.id} 
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
              background: 'white'
            }}
          >
            <h3>{vehicle.model}</h3>
            <p><strong>Price:</strong> {vehicle.price}</p>
            <p><strong>Status:</strong> {vehicle.status}</p>
            <p><strong>Range:</strong> {vehicle.specifications?.range || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleListWithLoading;