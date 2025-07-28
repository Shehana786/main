import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from '../Context/CartContext';
import { FiBell } from 'react-icons/fi';
import '../Styles/Global.css';
import axios from "axios";

const Header = ({ user, setUser }) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchTodaysReminders = async () => {
      try {
        const token = localStorage.getItem("token");

        const today = new Date();
        const dayStartUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        const dayEndUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0));

        const res = await axios.get(
          `http://localhost:5000/api/reminders?start=${dayStartUTC.toISOString()}&end=${dayEndUTC.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReminders(res.data);
      } catch (err) {
        console.error("Failed to fetch today's reminders:", err.message);
      }
    };

    fetchTodaysReminders();
  }, []);

  // Calculate how many reminders are for today
  const countTodayReminders = () => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.date);
      return reminderDate >= startOfToday && reminderDate < endOfToday;
    }).length;
  };

  const todayReminderCount = countTodayReminders();
console.log(todayReminderCount);
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <img className="logo" src="/assets/logo.png" alt="Logo" />
      <NavLink className="nav-link" to="/" end>Home</NavLink>
      <NavLink className="nav-link" to="/Catalog">Catalog</NavLink>
      <NavLink className="nav-link" to="/caretips">Care Tips</NavLink>

      <NavLink className="nav-link" to="/CareSchedule" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        Care Calendar
        <FiBell className="bell-icon" style={{ marginLeft: 5, fontSize: '1.5rem' }} />
        {todayReminderCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 7px",
              fontSize: "12px",
              fontWeight: "bold",
              transform: "translate(50%, -50%)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {todayReminderCount}
          </span>
        )}
      </NavLink>

      {user ? (
        <button className="nav-link logout-btn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <NavLink className="nav-link" to="/login">Login</NavLink>
      )}

      <NavLink className="nav-link cart-link" to="/Cart">
        Cart
        {cartItems.length > 0 && (
          <span className="cart-badge">{cartItems.length}</span>
        )}
      </NavLink>
    </nav>
  );
};

export default Header;
