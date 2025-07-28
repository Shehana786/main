// src/pages/Cart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import '../Styles/Global.css'; // Your styles go here

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
    const handleCheckout = () => {
    navigate('/Checkout');
  };
    
  return (
 <div className="cart-container">
  <h2 className="cart-title">Your Cart</h2>

  {cartItems.length === 0 ? (
    <p>Your cart is empty.</p>
  ) : (
    <div className="cart-layout">
      {/* Left Side: Cart Items */}
      <div className="cart-items">
        {cartItems.map(item => (
          <div className="cart-item" key={item._id}>
            <div className="cart-info">
              <img src={`http://localhost:5000/Uploads/${item.imageUrl}`} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>Price: ₹{item.price}</span>
              </div>
            </div>
            <div className="cart-quantity">
              <button onClick={() => updateQuantity(item._id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, 1)}
                disabled={item.quantity >= item.stock}
              >
                +
              </button>
              <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side: Summary */}
      <div className="cart-summary">
        <h3> Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item._id}>
              {item.name} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <hr />
        <p><strong>Subtotal:</strong> ₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
        <p><strong>Tax (5%):</strong> ₹{(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.05).toFixed(2)}</p>
        <h3><strong>Total:</strong> ₹{(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.05).toFixed(2)}</h3>
      <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  )}
</div>

  );
};

export default Cart;