import React from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import './Discover.css';

const Discover = () => {
  const discoverOptions = [
    {
      id: 'demo-drive',
      name: 'Demo Drive',
      description: 'Experience Tesla vehicles firsthand',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Demo_Drive-Desktop-Global.jpg',
      features: ['Test drive any Tesla model', 'Expert guidance', 'No appointment needed', 'Available nationwide'],
      cta: 'Schedule Demo Drive'
    },
    {
      id: 'compare',
      name: 'Compare',
      description: 'Find the perfect Tesla for you',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Model_Lineup-Desktop-Global.jpg',
      features: ['Side-by-side comparison', 'Detailed specifications', 'Performance metrics', 'Pricing options'],
      cta: 'Compare Models'
    },
    {
      id: 'find-us',
      name: 'Find Us',
      description: 'Locate Tesla stores and service centers',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Service-Desktop-Global.jpg',
      features: ['Store locations', 'Service centers', 'Supercharger stations', 'Interactive map'],
      cta: 'Find Location'
    },
    {
      id: 'support',
      name: 'Support',
      description: '24/7 customer support and resources',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Support-Desktop-Global.jpg',
      features: ['Live chat support', 'Owner resources', 'How-to guides', 'Community forums'],
      cta: 'Get Support'
    }
  ];

  return (
    <div className="page-wrapper">
      <Header />
      <div className="discover-page">
        <div className="discover-hero">
          <h1>Discover Tesla</h1>
          <p>Explore, experience, and learn everything about Tesla</p>
        </div>

        <div className="discover-options">
          <h2>Explore Your Options</h2>
          <div className="options-grid">
            {discoverOptions.map((option) => (
              <div key={option.id} className="option-card">
                <div className="option-image">
                  <img src={option.image} alt={option.name} />
                  <div className="option-overlay">
                    <button className="option-cta">{option.cta}</button>
                  </div>
                </div>
                <div className="option-content">
                  <h3>{option.name}</h3>
                  <p className="option-description">{option.description}</p>
                  <ul className="option-features">
                    {option.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="discover-experience">
          <h2>The Tesla Experience</h2>
          <div className="experience-content">
            <div className="experience-text">
              <h3>More than just a car company</h3>
              <p>Tesla is accelerating the world's transition to sustainable energy with electric cars, Solar Roof and integrated renewable energy solutions for homes and businesses.</p>
              <div className="experience-stats">
                <div className="stat">
                  <span className="stat-number">5M+</span>
                  <span className="stat-label">Vehicles delivered</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Superchargers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">127K+</span>
                  <span className="stat-label">Employees</span>
                </div>
              </div>
            </div>
            <div className="experience-image">
              <img src="https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-About_Tesla-Desktop-Global.jpg" alt="Tesla Experience" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Discover;