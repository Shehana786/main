import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryView() {
  const [plants, setPlants] = useState([]);
  const [updatingStock, setUpdatingStock] = useState({}); // track inputs per plant

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products');
      setPlants(res.data);
    } catch (err) {
      alert('Failed to fetch plants');
    }
  };

  const handleStockChange = (id, value) => {
    setUpdatingStock(prev => ({ ...prev, [id]: value }));
  };

  const updateStock = async (id) => {
    if (updatingStock[id] == null) return;
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/products/${id}/stock`,
        { stock: Number(updatingStock[id]) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Stock updated!');
      fetchPlants();
      setUpdatingStock(prev => ({ ...prev, [id]: undefined }));
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  return (
    <div>
      <h2>Inventory Management</h2>
      <table>
        <thead>
          <tr>
            <th>Plant Name</th>
            <th>Current Stock</th>
            <th>Update Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((plant) => (
            <tr
              key={plant._id}
              className={plant.stock < 5 ? 'low-stock' : ''}
            >
              <td>{plant.name}</td>
              <td>
                {plant.stock}{' '}
                {plant.stock < 5 && (
                  <span style={{ color: '#d84315', fontWeight: '700', marginLeft: '6px' }}>
                    Low
                  </span>
                )}
              </td>
              <td>
                <input
                  type="number"
                  value={updatingStock[plant._id] || ''}
                  onChange={(e) => handleStockChange(plant._id, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => updateStock(plant._id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryView;
