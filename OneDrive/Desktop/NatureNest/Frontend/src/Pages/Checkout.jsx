import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import axios from "axios";

const Checkout = ({ user }) => {
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();

  console.log("User in checkout:", user);

  const [form, setForm] = useState({
    fullname: "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Cash on Delivery",
    cardNumber: "",
    expiryDate: "",
    cvv: ""

  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first");
    if (cartItems.length === 0) return alert("Your cart is empty");

    try {
      const order = {
      
    userId: user._id,
    ...form,
    items: cartItems.map(item => ({
    productId: item._id, // or item.productId if already correct
    quantity: item.quantity,
    price: item.price,
    }))
  };

      const res = await axios.post("http://localhost:5000/api/orders/checkout", order);
      alert("Order placed successfully!");
      setCartItems([]);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={handleChange}
          required
        />
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
        </select>
        {(form.paymentMethod === "Credit Card" || form.paymentMethod === "Debit Card") && (
  <>
    <input
      type="text"
      name="cardNumber"
      placeholder="Card Number"
      value={form.cardNumber}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      name="expiryDate"
      placeholder="Expiry Date (MM/YY)"
      value={form.expiryDate}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      name="cvv"
      placeholder="CVV"
      value={form.cvv}
      onChange={handleChange}
      required
    />
  </>
)}


        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
