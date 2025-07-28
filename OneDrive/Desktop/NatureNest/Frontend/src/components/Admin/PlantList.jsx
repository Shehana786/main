import React from 'react';

function PlantList({ plants, onEdit, onDelete }) {
  return (
    <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Care Tips</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {plants.map((plant) => {
          let careTipsObj = plant.careTips;
          if (typeof careTipsObj === 'string') {
            try {
              careTipsObj = JSON.parse(careTipsObj);
            } catch {
              careTipsObj = null;
            }
          }

          return (
            <tr key={plant._id}>
              <td>{plant.name}</td>
              <td>{plant.price}</td>
              <td>{plant.category}</td>
              <td>{plant.stock}</td>
              <td>
                {careTipsObj ? (
                  <ul style={{ paddingLeft: '15px', margin: 0 }}>
                    <li><strong>Watering:</strong> {careTipsObj.watering || 'N/A'}</li>
                    <li><strong>Sunlight:</strong> {careTipsObj.sunlight || 'N/A'}</li>
                    <li><strong>Soil:</strong> {careTipsObj.soil || 'N/A'}</li>
                    <li><strong>Pruning:</strong> {careTipsObj.pruning || 'N/A'}</li>
                    <li><strong>Temperature:</strong> {careTipsObj.temperature || 'N/A'}</li>
                  </ul>
                ) : (
                  'No care tips available'
                )}
              </td>
              <td>
                {plant.imageUrl && (
                  <img
                    src={`http://localhost:5000/uploads/${plant.imageUrl}`}
                    alt={plant.name}
                    width="60"
                  />
                )}
              </td>
              <td>
                <button onClick={() => onEdit(plant)}>Edit</button>
                <button onClick={() => onDelete(plant._id)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PlantList;
