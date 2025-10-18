import React, { useState } from 'react';
import { useGlobalLoading, usePageLoading } from '@modules/loading';
import { LoadingPage } from '@modules/loading';

const LoadingDemo = () => {
  const { setGlobalLoading, isGlobalLoading, globalMessage } = useGlobalLoading();
  const { startLoading, stopLoading, isLoading, loadingMessage } = usePageLoading();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [demoData, setDemoData] = useState([]);

  // Demo global loading
  const handleGlobalLoading = async () => {
    setGlobalLoading(true, 'Đang đồng bộ dữ liệu toàn cục với Tesla servers...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('Global sync completed!');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Demo page loading
  const handlePageLoading = async () => {
    const loadingId = startLoading('Đang tải dữ liệu Tesla vehicles...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDemoData([
        { id: 1, name: 'Tesla Model S', price: '$94,990' },
        { id: 2, name: 'Tesla Model 3', price: '$37,990' },
        { id: 3, name: 'Tesla Model X', price: '$104,990' },
        { id: 4, name: 'Tesla Model Y', price: '$52,990' }
      ]);
    } finally {
      stopLoading();
    }
  };

  // Demo different loading variants
  const handleTeslaLoading = async () => {
    const loadingId = startLoading('Đang kết nối với Tesla supercomputer...', 'tesla');
    await new Promise(resolve => setTimeout(resolve, 2500));
    stopLoading();
  };

  const handleDashboardLoading = async () => {
    const loadingId = startLoading('Đang cập nhật dashboard analytics...', 'dashboard');
    await new Promise(resolve => setTimeout(resolve, 2000));
    stopLoading();
  };

  const handleMinimalLoading = async () => {
    const loadingId = startLoading('Loading...', 'minimal');
    await new Promise(resolve => setTimeout(resolve, 1500));
    stopLoading();
  };

  // Clear demo data
  const clearData = () => {
    setDemoData([]);
  };

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 3000);
  };

  const showLoadingPage = () => {
    setShowFullScreen(true);
    setTimeout(() => setShowFullScreen(false), 5000);
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #e53e3e, #3182ce)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Tesla EVM Loading System Demo
      </h1>

      {/* Status Display */}
      <div style={{
        backgroundColor: '#f7fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '2rem',
        maxWidth: '800px',
        margin: '0 auto 2rem auto'
      }}>
        <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Current Status:</h3>
        <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>
          Global Loading: <strong>{isGlobalLoading ? 'Active' : 'Inactive'}</strong>
          {isGlobalLoading && globalMessage && ` - ${globalMessage}`}
        </p>
        <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>
          Page Loading: <strong>{isLoading ? 'Active' : 'Inactive'}</strong>
          {isLoading && loadingMessage && ` - ${loadingMessage}`}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Global Loading Demo */}
        <section style={{
          backgroundColor: '#fff5f5',
          border: '1px solid #fed7d7',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#c53030' }}>Global Loading Demo</h2>
          <p style={{ marginBottom: '1rem', color: '#718096', fontSize: '0.9rem' }}>
            Global loading covers entire application with full overlay
          </p>
          <button 
            onClick={handleGlobalLoading}
            disabled={isGlobalLoading || isLoading}
            style={{
              backgroundColor: isGlobalLoading ? '#a0aec0' : '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: isGlobalLoading ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {isGlobalLoading ? 'Global Loading Active...' : 'Start Global Loading'}
          </button>
        </section>

        {/* Page Loading Demo */}
        <section style={{
          backgroundColor: '#f0fff4',
          border: '1px solid #c6f6d5',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#38a169' }}>Page Loading Demo</h2>
          <p style={{ marginBottom: '1rem', color: '#718096', fontSize: '0.9rem' }}>
            Page loading shows spinner within current page context
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handlePageLoading}
              disabled={isGlobalLoading || isLoading}
              style={{
                backgroundColor: isLoading ? '#a0aec0' : '#38a169',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              Load Vehicle Data
            </button>
            <button 
              onClick={clearData}
              disabled={isGlobalLoading || isLoading}
              style={{
                backgroundColor: '#a0aec0',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              Clear Data
            </button>
          </div>
        </section>

        {/* Loading Variants Demo */}
        <section style={{
          backgroundColor: '#fffaf0',
          border: '1px solid #fbd38d',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#c05621' }}>Loading Variants Demo</h2>
          <p style={{ marginBottom: '1rem', color: '#718096', fontSize: '0.9rem' }}>
            Different loading styles for different contexts
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleTeslaLoading}
              disabled={isGlobalLoading || isLoading}
              style={{
                backgroundColor: isLoading ? '#a0aec0' : '#e53e3e',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '0.8rem'
              }}
            >
              Tesla Style
            </button>
            <button 
              onClick={handleDashboardLoading}
              disabled={isGlobalLoading || isLoading}
              style={{
                backgroundColor: isLoading ? '#a0aec0' : '#3182ce',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '0.8rem'
              }}
            >
              Dashboard Style
            </button>
            <button 
              onClick={handleMinimalLoading}
              disabled={isGlobalLoading || isLoading}
              style={{
                backgroundColor: isLoading ? '#a0aec0' : '#718096',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '0.8rem'
              }}
            >
              Minimal Style
            </button>
          </div>
        </section>

        {/* Data Display */}
        {demoData.length > 0 && (
          <section style={{
            backgroundColor: '#edf2f7',
            border: '1px solid #cbd5e0',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Loaded Tesla Vehicles:</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {demoData.map(vehicle => (
                <div key={vehicle.id} style={{
                  backgroundColor: 'white',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '500', color: '#2d3748' }}>{vehicle.name}</span>
                  <span style={{ color: '#38a169', fontWeight: 'bold' }}>{vehicle.price}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Original Demo Controls */}
        <section style={{
          backgroundColor: '#f0f4f8',
          border: '1px solid #cbd5e0',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <h2>Original Loading Components Demo</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={showLoadingPage}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Show Full Screen Loading
            </button>
            
            <LoadingButton 
              loading={buttonLoading} 
              onClick={handleButtonClick}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              {buttonLoading ? 'Processing...' : 'Click Me (Loading Button)'}
            </LoadingButton>
          </div>
        </section>

        {/* Inline Spinners */}
        <section>
          <h2>Inline Loading Spinners</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <InlineSpinner size="small" color="primary" />
              <span>Small Primary</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <InlineSpinner size="medium" color="secondary" />
              <span>Medium Secondary</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#333', padding: '0.5rem', borderRadius: '0.25rem' }}>
              <InlineSpinner size="large" color="white" />
              <span style={{ color: 'white' }}>Large White</span>
            </div>
          </div>
        </section>

        {/* Minimal Loading Page */}
        <section>
          <h2>Minimal Loading Page</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <LoadingPage 
              variant="minimal" 
              message="Loading data..." 
              showLogo={false}
            />
          </div>
        </section>

        {/* Default Loading Page (in container) */}
        <section>
          <h2>Default Loading Page (Container)</h2>
          <div style={{ 
            height: '400px', 
            border: '1px solid #ddd', 
            borderRadius: '0.5rem', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <LoadingPage 
              variant="default" 
              message="Initializing EV Management System..."
            />
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2>Usage Examples</h2>
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '0.5rem' }}>
            <h3>Import:</h3>
            <pre style={{ background: '#e9ecef', padding: '0.5rem', borderRadius: '0.25rem', overflow: 'auto' }}>
{`import { LoadingPage } from '@modules/loading';`}
            </pre>
            
            <h3>Basic Usage:</h3>
            <pre style={{ background: '#e9ecef', padding: '0.5rem', borderRadius: '0.25rem', overflow: 'auto' }}>
{`// Full screen loading
<LoadingPage message="Loading application..." />

// Minimal loading
<LoadingPage variant="minimal" showLogo={false} />

// Inline spinner
<InlineSpinner size="medium" color="primary" />

// Loading button
<LoadingButton loading={isLoading} onClick={handleClick}>
  Submit
</LoadingButton>`}
            </pre>
          </div>
        </section>
      </div>

      {/* Full Screen Loading Overlay */}
      {showFullScreen && (
        <LoadingPage 
          variant="full-screen" 
          message="Loading Electric Vehicle Management System..."
        />
      )}
    </div>
  );
};

export default LoadingDemo;