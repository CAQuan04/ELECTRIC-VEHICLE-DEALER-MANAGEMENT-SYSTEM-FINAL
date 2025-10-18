import React from 'react';
import { Header, Footer } from '@modules/layout';
import './Information.css';

const Information = () => {
  return (
    <div className="page-wrapper">
      <Header />
      <div className="information-page">
      <div className="information-hero">
        <h1>About Tesla</h1>
        <p>Accelerating the world's transition to sustainable energy</p>
      </div>

      <div className="company-info">
        <h2>Our Mission</h2>
        <div className="mission-grid">
          <div className="mission-card">
            <h3>Sustainable Energy</h3>
            <p>Tesla's mission is to accelerate the world's transition to sustainable energy through increasingly affordable electric vehicles.</p>
          </div>
          <div className="mission-card">
            <h3>Innovation</h3>
            <p>We're constantly pushing the boundaries of technology to create products that change the world.</p>
          </div>
          <div className="mission-card">
            <h3>Global Impact</h3>
            <p>Making a positive impact on the environment and society through sustainable transportation solutions.</p>
          </div>
        </div>
      </div>

      <div className="company-stats">
        <div className="stat">
          <span className="stat-number">5M+</span>
          <span className="stat-label">Vehicles Delivered</span>
        </div>
        <div className="stat">
          <span className="stat-number">50,000+</span>
          <span className="stat-label">Superchargers</span>
        </div>
        <div className="stat">
          <span className="stat-number">127,000+</span>
          <span className="stat-label">Employees</span>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default Information;