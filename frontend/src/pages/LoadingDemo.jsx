import React, { useState } from 'react';
import LoadingPage, { LoadingSpinner as InlineSpinner, LoadingButton } from '../shared/components/LoadingPage';

const LoadingDemo = () => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

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
      <h1>Loading Components Demo</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
        
        {/* Demo Buttons */}
        <section>
          <h2>Demo Controls</h2>
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
{`import LoadingPage, { LoadingSpinner as InlineSpinner, LoadingButton } from '../shared/components/LoadingPage';`}
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