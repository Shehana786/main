import React, { useState, useEffect } from 'react';
import ProductManager from '../components/Admin/ProductManager';
import AdminOrders from '../components/Admin/AdminOrders';
import InventoryView from '../components/Admin/InventoryView';
import { io } from 'socket.io-client';
import '../Styles/AdminStyle.css';

const socket = io('http://localhost:5000');

const AdminDashboard = () => {
  const [tab, setTab] = useState('products');

  useEffect(() => {
    socket.on('lowStockAlert', (data) => {
      alert(`Low stock for ${data.name}: Only ${data.stock} left!`);
    });

    return () => {
      socket.off('lowStockAlert');  // cleanup listener when component unmounts
    };
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <nav>
        <button
          className={tab === 'products' ? 'active' : ''}
          onClick={() => setTab('products')}
        >
          Product Manager
        </button>
        <button
          className={tab === 'orders' ? 'active' : ''}
          onClick={() => setTab('orders')}
        >
          Orders Panel
        </button>
        <button
          className={tab === 'inventory' ? 'active' : ''}
          onClick={() => setTab('inventory')}
        >
          Inventory View
        </button>
      
      </nav>
      <hr />
      <div className="flex-container">
        {tab === 'products' && <ProductManager />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'inventory' && <InventoryView />}
         
      </div>
    </div>
  );
};

export default AdminDashboard;
