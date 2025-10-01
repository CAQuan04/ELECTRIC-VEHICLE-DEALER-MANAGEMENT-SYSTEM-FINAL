import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../../shared/components/Header';
import Footer from '../../../../shared/components/Footer';
import './Charging.css';

const Charging = () => {
  const chargingOptions = [
    {
      id: 'home-charging',
      name: 'Home Charging',
      description: 'The most convenient way to charge',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Wall_Connector-Desktop-US.jpg',
      features: ['Wall Connector', 'Mobile Connector', 'Nema 14-50', 'Up to 44 mi/hr'],
      price: 'Starting at $400'
    },
    {
      id: 'supercharger',
      name: 'Supercharger',
      description: 'The fastest way to charge on the road',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Supercharger-Desktop-US.jpg',
      features: ['50,000+ connectors globally', 'Up to 200 mi in 15 minutes', '99.95% uptime', '24/7 monitoring'],
      price: 'Pay per kWh'
    },
    {
      id: 'destination-charging',
      name: 'Destination Charging',
      description: 'Charging at hotels and destinations',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Destination_Charging-Desktop-US.jpg',
      features: ['Hotels & Restaurants', 'Shopping Centers', 'Workplace Charging', 'Convenient Locations'],
      price: 'Often complimentary'
    },
    {
      id: 'mobile-charging',
      name: 'Mobile Charging',
      description: 'Charge anywhere with portable solutions',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Mobile_Connector_8A-Desktop-US.jpg',
      features: ['Mobile Connector', 'Gen 2 Adapter Bundle', 'Standard Outlets', 'Emergency Charging'],
      price: 'Starting at $230'
    }
  ];

  return (
    <div className="page-wrapper">
      <Header />
      <div className="charging-page">
      <div className="charging-hero">
        <h1>Tesla Charging</h1>
        <p>Power your journey with our comprehensive charging ecosystem</p>
        <div className="charging-stats">
          <div className="stat">
            <span className="stat-number">50,000+</span>
            <span className="stat-label">Superchargers</span>
          </div>
          <div className="stat">
            <span className="stat-number">99.95%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat">
            <span className="stat-number">15 min</span>
            <span className="stat-label">200 mi range</span>
          </div>
        </div>
      </div>

      <div className="charging-grid">
        {chargingOptions.map((option) => (
          <div key={option.id} className="charging-card">
            <div className="charging-image">
              <img src={option.image} alt={option.name} />
            </div>
            <div className="charging-info">
              <h2>{option.name}</h2>
              <p className="charging-description">{option.description}</p>
              
              <div className="charging-features">
                {option.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="checkmark">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="charging-price">
                <span>{option.price}</span>
              </div>

              <div className="charging-actions">
                <Link to={`/charging/${option.id}`} className="btn-primary">
                  Learn More
                </Link>
                <button className="btn-secondary">Find Locations</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="charging-network">
        <h2>Tesla Charging Network</h2>
        <div className="network-content">
          <div className="network-text">
            <h3>The world's largest fast-charging network</h3>
            <p>Tesla operates the world's largest global, fast-charging network. Located on major routes near convenient amenities, Superchargers keep you charged when you're away from home.</p>
            <div className="network-features">
              <div className="network-feature">
                <h4>Reliable</h4>
                <p>99.95% uptime and 24/7 customer support</p>
              </div>
              <div className="network-feature">
                <h4>Fast</h4>
                <p>Up to 200 miles of range in 15 minutes</p>
              </div>
              <div className="network-feature">
                <h4>Convenient</h4>
                <p>Located near shopping, dining and wifi</p>
              </div>
            </div>
          </div>
          <div className="network-image">
            <img src="https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Supercharger-V4-Interior-Hero-Desktop-Global.jpg" alt="Tesla Supercharger Network" />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default Charging;