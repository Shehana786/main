import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './Pages/Home';
import Catalog from './Pages/Catalog';
import Login from './Pages/Login';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Signup from './Pages/Signup';
import AdminDashboard from './Pages/AdminDashboard';
import './Styles/Global.css';
import CareTipsPage from './Pages/CareTipsPage';
import CareSchedule from './Pages/CareSchedule';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on first render
 // In App.js
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  console.log('Loaded storedUser from localStorage:', storedUser);
  if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed user:', parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing storedUser:', error);
      localStorage.removeItem('user');
    }
  } else {
    console.log('No valid user in localStorage');
  }
}, []);


  return (
    <div>
      <h1>Welcome to Plant Nursery App</h1>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Catalog" element={<Catalog />} />
         <Route path="/caretips" element={<CareTipsPage />} />
         <Route path="/careschedule" element={<CareSchedule />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout user={user} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
