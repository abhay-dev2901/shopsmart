import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const TAX_RATE = 0.1;

export default function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart, getTotalPrice } = useCart();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    delivery: 'standard',
    payment: 'card',
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const subtotal = getTotalPrice();
  const shipping = formData.delivery === 'express' ? 12 : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (cart.length === 0 && !order) {
    return (
      <div className="checkout-shell">
        <div className="checkout-empty">
          <p className="eyebrow">Checkout</p>
          <h1>Your cart is empty</h1>
          <p>Add items before starting checkout.</p>
          <Link to="/" className="checkout-primary-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const updateField = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Please log in again before checkout.');
      }

      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed.');
      }

      setOrder(data.order);
      clearCart();
      setStatus('complete');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  if (order) {
    return (
      <div className="checkout-shell">
        <section className="order-confirmation">
          <p className="eyebrow">Order Confirmed</p>
          <h1>Thanks, {user.name}</h1>
          <p>
            Order #{order.id} has been placed for ${order.total.toFixed(2)}.
          </p>
          <div className="confirmation-grid">
            <div>
              <span>Status</span>
              <strong>{order.status}</strong>
            </div>
            <div>
              <span>Items</span>
              <strong>{order.items.length}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{formData.delivery}</strong>
            </div>
          </div>
          <Link to="/" className="checkout-primary-link">
            Back to Store
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="checkout-shell">
      <div className="checkout-heading">
        <p className="eyebrow">Secure Checkout</p>
        <h1>Review and place your order</h1>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <section className="checkout-panel">
          <div className="panel-heading">
            <span>1</span>
            <div>
              <h2>Contact and delivery</h2>
              <p>Use an address where you can receive the package.</p>
            </div>
          </div>

          <div className="checkout-grid">
            <label>
              Full name
              <input
                name="name"
                value={formData.name}
                onChange={updateField}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={updateField}
                required
              />
            </label>
            <label className="full-width">
              Street address
              <input
                name="address"
                value={formData.address}
                onChange={updateField}
                required
              />
            </label>
            <label>
              City
              <input
                name="city"
                value={formData.city}
                onChange={updateField}
                required
              />
            </label>
            <label>
              State
              <input
                name="state"
                value={formData.state}
                onChange={updateField}
                required
              />
            </label>
            <label>
              ZIP
              <input
                name="zip"
                value={formData.zip}
                onChange={updateField}
                inputMode="numeric"
                required
              />
            </label>
          </div>
        </section>

        <section className="checkout-panel">
          <div className="panel-heading">
            <span>2</span>
            <div>
              <h2>Delivery and payment</h2>
              <p>Select how this order should be handled.</p>
            </div>
          </div>

          <div className="choice-row">
            <label className="choice-option">
              <input
                type="radio"
                name="delivery"
                value="standard"
                checked={formData.delivery === 'standard'}
                onChange={updateField}
              />
              <span>
                <strong>Standard</strong>
                Free delivery
              </span>
            </label>
            <label className="choice-option">
              <input
                type="radio"
                name="delivery"
                value="express"
                checked={formData.delivery === 'express'}
                onChange={updateField}
              />
              <span>
                <strong>Express</strong>
                $12 priority delivery
              </span>
            </label>
          </div>

          <div className="choice-row">
            <label className="choice-option">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={formData.payment === 'card'}
                onChange={updateField}
              />
              <span>
                <strong>Card</strong>
                Pay securely now
              </span>
            </label>
            <label className="choice-option">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={formData.payment === 'cod'}
                onChange={updateField}
              />
              <span>
                <strong>Cash</strong>
                Pay on delivery
              </span>
            </label>
          </div>
        </section>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <span className="summary-thumb">
                  {item.image?.startsWith('http') ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    item.image
                  )}
                </span>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-lines">
            <div>
              <span>Items</span>
              <strong>{itemCount}</strong>
            </div>
            <div>
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</strong>
            </div>
            <div>
              <span>Tax</span>
              <strong>${tax.toFixed(2)}</strong>
            </div>
            <div className="grand-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <button
            type="submit"
            className="place-order-btn"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Placing Order...' : 'Place Order'}
          </button>
          <Link to="/cart" className="back-to-cart">
            Back to Cart
          </Link>
        </aside>
      </form>
    </div>
  );
}
