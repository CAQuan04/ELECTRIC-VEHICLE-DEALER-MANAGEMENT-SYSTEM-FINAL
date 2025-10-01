import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../../shared/components/Header';
import Footer from '../../../../shared/components/Footer';
import './Vehicles.css';

const Vehicles = () => {
  const vehicles = [
    {
      id: 'model-s',
      name: 'Model S',
      tagline: 'Plaid',
      description: 'Beyond Ludicrous',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Hero-Desktop-US.png',
      startingPrice: '$74,990',
      topSpeed: '200 mph',
      acceleration: '1.99s 0-60 mph',
      range: '405 mi'
    },
    {
      id: 'model-3',
      name: 'Model 3',
      tagline: 'Highland',
      description: 'From $38,990',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Exterior-Hero-Desktop-LHD.jpg',
      startingPrice: '$38,990',
      topSpeed: '162 mph',
      acceleration: '3.1s 0-60 mph',
      range: '358 mi'
    },
    {
      id: 'model-x',
      name: 'Model X',
      tagline: 'Plaid',
      description: 'From $79,990',
      image: 'https://static1.pocketlintimages.com/wordpress/wp-content/uploads/2024/05/tesla-model-x.jpg',
      startingPrice: '$79,990',
      topSpeed: '163 mph',
      acceleration: '2.5s 0-60 mph',
      range: '348 mi'
    },
    {
      id: 'model-y',
      name: 'Model Y',
      tagline: 'Performance',
      description: 'From $52,490',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg',
      startingPrice: '$52,490',
      topSpeed: '155 mph',
      acceleration: '3.5s 0-60 mph',
      range: '330 mi'
    },
    {
      id: 'cybertruck',
      name: 'Cybertruck',
      tagline: 'Beast',
      description: 'From $60,990',
      image: 'https://cdn.magzter.com/1406567956/1701902482/articles/l3D7l_ggN1702027544376/TESLAS-DISRUPTIVE-BREAKTHROUGH-PRESE-FOR-THE-PICKUP-INDUSTRY.jpg',
      startingPrice: '$60,990',
      topSpeed: '130 mph',
      acceleration: '2.6s 0-60 mph',
      range: '340 mi'
    }
  ];

  return (
    <div className="page-wrapper">
      <Header />
      <div className="vehicles-page">
        <div className="vehicles-hero">
          <h1>Tesla Vehicles</h1>
          <p>Experience the future of transportation with our complete lineup of electric vehicles</p>
        </div>

        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <div className="vehicle-image">
                <img src={vehicle.image} alt={vehicle.name} />
              </div>
              <div className="vehicle-info">
                <h2>{vehicle.name}</h2>
                <h3>{vehicle.tagline}</h3>
                <p className="vehicle-description">{vehicle.description}</p>
                
                <div className="vehicle-specs">
                  <div className="spec">
                    <span className="spec-value">{vehicle.range}</span>
                    <span className="spec-label">Range</span>
                  </div>
                  <div className="spec">
                    <span className="spec-value">{vehicle.acceleration}</span>
                    <span className="spec-label">0-60 mph</span>
                  </div>
                  <div className="spec">
                    <span className="spec-value">{vehicle.topSpeed}</span>
                    <span className="spec-label">Top Speed</span>
                  </div>
                </div>

                <div className="vehicle-actions">
                  <Link to={`/vehicles/${vehicle.id}`} className="btn-primary">
                    Learn More
                  </Link>
                  <button className="btn-secondary">Order Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vehicles;