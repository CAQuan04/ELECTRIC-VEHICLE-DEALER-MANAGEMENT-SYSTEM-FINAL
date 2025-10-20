import React from 'react';
import './VehicleDetail.css';

const Model3 = () => {
  const model3Data = {
    name: 'Model 3',
    tagline: 'Highland',
    hero: 'The most affordable Tesla sedan',
    image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Exterior-Hero-Desktop-LHD.jpg',
    specs: {
      range: '358 mi',
      acceleration: '3.1s 0-60 mph',
      topSpeed: '162 mph',
      peakPower: '510 hp'
    },
    features: [
      {
        title: 'Highland Design',
        description: 'Refined exterior with improved aerodynamics and premium interior materials.'
      },
      {
        title: 'Advanced Technology',
        description: 'Features the latest in Tesla technology with over-the-air updates.'
      },
      {
        title: 'Autopilot Included',
        description: 'Standard Autopilot features for enhanced safety and convenience.'
      },
      {
        title: 'Glass Roof',
        description: 'All-glass roof provides more headroom and UV protection.'
      }
    ],
    gallery: [
      'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Exterior-Hero-Desktop-LHD.jpg',
      'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Interior-Hero-Desktop-LHD.jpg',
      'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Side-Hero-Desktop-LHD.jpg'
    ]
  };

  return (
    <div className="vehicle-detail">
      <div className="hero-section">
        <div className="hero-content">
          <h1>{model3Data.name}</h1>
          <h2>{model3Data.tagline}</h2>
          <p>{model3Data.hero}</p>
          <div className="hero-specs">
            <div className="spec">
              <span className="spec-value">{model3Data.specs.acceleration}</span>
              <span className="spec-label">0-60 mph</span>
            </div>
            <div className="spec">
              <span className="spec-value">{model3Data.specs.topSpeed}</span>
              <span className="spec-label">Top Speed</span>
            </div>
            <div className="spec">
              <span className="spec-value">{model3Data.specs.range}</span>
              <span className="spec-label">Range</span>
            </div>
            <div className="spec">
              <span className="spec-value">{model3Data.specs.peakPower}</span>
              <span className="spec-label">Peak Power</span>
            </div>
          </div>
          <button className="order-btn">Order Now</button>
        </div>
        <div className="hero-image">
          <img src={model3Data.image} alt="Tesla Model 3" />
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          {model3Data.features.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="gallery-section">
        <h2>Gallery</h2>
        <div className="gallery-grid">
          {model3Data.gallery.map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image} alt={`Model 3 ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Model3;