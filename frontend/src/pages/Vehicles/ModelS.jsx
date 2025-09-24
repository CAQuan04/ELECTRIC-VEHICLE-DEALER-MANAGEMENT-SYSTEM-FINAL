import React from 'react';
import './VehicleDetail.css';

const ModelS = () => {
  const modelSData = {
    name: 'Model S',
    tagline: 'Plaid',
    hero: 'The highest performing sedan ever built',
    image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Hero-Desktop-US.png',
    specs: {
      range: '405 mi',
      acceleration: '1.99s 0-60 mph',
      topSpeed: '200 mph',
      peakPower: '1,020 hp'
    },
    features: [
      {
        title: 'Plaid Powertrain',
        description: 'Model S Plaid has the quickest acceleration of any vehicle in production.'
      },
      {
        title: 'Beyond Ludicrous',
        description: 'With up to 1,020 horsepower and a top speed of 200 mph, Model S Plaid is the highest performing sedan ever built.'
      },
      {
        title: 'Interior of the Future',
        description: 'The ultimate focus on driving: no stalks, no shifting. Model S is designed for effortless control.'
      },
      {
        title: 'Cinematic Experience',
        description: 'The 17" cinematic touchscreen with left-right tilt offers 2200 x 1300 resolution.'
      }
    ],
    gallery: [
      'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Hero-Desktop-US.png',
      'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Interior-Hero-Desktop-US.jpg',
      'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Exterior-Side-Hero-Desktop-US.jpg'
    ]
  };

  return (
    <div className="vehicle-detail">
      <div className="hero-section">
        <div className="hero-content">
          <h1>{modelSData.name}</h1>
          <h2>{modelSData.tagline}</h2>
          <p>{modelSData.hero}</p>
          <div className="hero-specs">
            <div className="spec">
              <span className="spec-value">{modelSData.specs.acceleration}</span>
              <span className="spec-label">0-60 mph</span>
            </div>
            <div className="spec">
              <span className="spec-value">{modelSData.specs.topSpeed}</span>
              <span className="spec-label">Top Speed</span>
            </div>
            <div className="spec">
              <span className="spec-value">{modelSData.specs.range}</span>
              <span className="spec-label">Range</span>
            </div>
            <div className="spec">
              <span className="spec-value">{modelSData.specs.peakPower}</span>
              <span className="spec-label">Peak Power</span>
            </div>
          </div>
          <button className="order-btn">Order Now</button>
        </div>
        <div className="hero-image">
          <img src={modelSData.image} alt="Tesla Model S" />
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          {modelSData.features.map((feature, index) => (
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
          {modelSData.gallery.map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image} alt={`Model S ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelS;