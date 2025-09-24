import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import './Shop.css';

const Shop = () => {
  const shopCategories = [
    {
      id: 'accessories',
      name: 'Accessories',
      description: 'Premium accessories for your Tesla',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Mobile_Connector-Desktop-US.jpg',
      items: ['Mobile Connector', 'Wall Connector', 'Adapters', 'Charging Accessories'],
      featured: '$230 - $550'
    },
    {
      id: 'apparel',
      name: 'Apparel',
      description: 'Tesla fashion and lifestyle clothing',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Tesla-Lifestyle-Hero-Desktop.jpg',
      items: ['T-Shirts', 'Hoodies', 'Jackets', 'Hats & Caps'],
      featured: '$35 - $200'
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      description: 'Tesla-inspired lifestyle products',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Tesla-Tequila-Desktop.jpg',
      items: ['Tesla Tequila', 'Model S for Kids', 'Phone Cases', 'Drinkware'],
      featured: '$50 - $1,500'
    },
    {
      id: 'charging',
      name: 'Charging',
      description: 'Home and mobile charging solutions',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Wall_Connector-Desktop-US.jpg',
      items: ['Wall Connector', 'Mobile Connector', 'Adapters', 'Installation'],
      featured: '$230 - $500'
    },
    {
      id: 'vehicle-accessories',
      name: 'Vehicle Accessories',
      description: 'Enhance your Tesla experience',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-All-Weather-Interior-Liners-Desktop.jpg',
      items: ['Floor Mats', 'Roof Racks', 'Mud Flaps', 'Interior Accessories'],
      featured: '$75 - $800'
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Tesla Wall Connector',
      price: '$400',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Wall_Connector-Desktop-US.jpg',
      category: 'Charging'
    },
    {
      id: 2,
      name: 'Tesla Mobile Connector',
      price: '$230',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Mobile_Connector-Desktop-US.jpg',
      category: 'Charging'
    },
    {
      id: 3,
      name: 'Tesla Tequila',
      price: '$250',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Tesla-Tequila-Desktop.jpg',
      category: 'Lifestyle'
    },
    {
      id: 4,
      name: 'Model S for Kids',
      price: '$1,500',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-for-Kids-Desktop.jpg',
      category: 'Lifestyle'
    }
  ];

  return (
    <div className="page-wrapper">
      <Header />
      <div className="shop-page">
      <div className="shop-hero">
        <h1>Tesla Shop</h1>
        <p>Discover Tesla accessories, charging solutions, and lifestyle products</p>
      </div>

      <div className="shop-categories">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {shopCategories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.name} />
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="category-items">
                  {category.items.map((item, index) => (
                    <span key={index} className="item-tag">{item}</span>
                  ))}
                </div>
                <div className="category-price">
                  <span>{category.featured}</span>
                </div>
                <Link to={`/shop/${category.id}`} className="btn-primary">
                  Shop {category.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3>{product.name}</h3>
                <div className="product-price">{product.price}</div>
                <button className="btn-add-cart">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shop-benefits">
        <h2>Why Shop Tesla</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Free shipping on orders over $100</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔧</div>
            <h3>Expert Installation</h3>
            <p>Professional installation services available</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>30-day return policy on most items</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Tesla Quality</h3>
            <p>Premium quality products designed for Tesla vehicles</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default Shop;