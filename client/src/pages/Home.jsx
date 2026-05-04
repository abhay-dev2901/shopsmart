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
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Unable to load products');
        }
        const data = await response.json();
        setProducts(data.length > 0 ? data : MOCK_PRODUCTS);
      } catch (error) {
        setProducts(MOCK_PRODUCTS);
      } finally {
      setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

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
        <div>
          <p className="hero-kicker">Curated daily essentials</p>
          <h1>Shop smarter without the clutter</h1>
          <p>
            Compare practical tech, accessories, and everyday gear in one fast
            checkout flow.
          </p>
        </div>
        <div className="hero-stats">
          <span>{products.length}</span>
          <strong>ready-to-ship products</strong>
        </div>
      </div>

      <div className="filters">
        <div>
          <h2>Featured Products</h2>
          <p>Filter by category and add items to your cart.</p>
        </div>
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
            <div className="product-image">
              {product.image?.startsWith('http') ? (
                <img src={product.image} alt={product.name} />
              ) : (
                product.image
              )}
            </div>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              {product.stock !== undefined && (
                <span className="stock-pill">{product.stock} in stock</span>
              )}
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
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
