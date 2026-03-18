import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Home.css';

// Mock products - replace with API call
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    image: '🎧',
    description: 'Premium sound quality with noise cancellation',
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: '⌚',
    description: 'Fitness tracking and notifications',
    category: 'Wearables',
  },
  {
    id: 3,
    name: 'Laptop Backpack',
    price: 49.99,
    image: '🎒',
    description: 'Durable and stylish laptop backpack',
    category: 'Accessories',
  },
  {
    id: 4,
    name: 'Wireless Mouse',
    price: 29.99,
    image: '🖱️',
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Electronics',
  },
  {
    id: 5,
    name: 'USB-C Cable',
    price: 14.99,
    image: '🔌',
    description: 'Fast charging USB-C cable',
    category: 'Accessories',
  },
  {
    id: 6,
    name: 'Phone Stand',
    price: 19.99,
    image: '📱',
    description: 'Adjustable phone stand for desk',
    category: 'Accessories',
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 500);
  }, []);

  const categories = ['All', ...new Set(MOCK_PRODUCTS.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Welcome to ShopSmart</h1>
        <p>Discover amazing products at great prices</p>
      </div>

      <div className="filters">
        <h3>Filter by Category:</h3>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No products found in this category</p>
        </div>
      )}
    </div>
  );
}
