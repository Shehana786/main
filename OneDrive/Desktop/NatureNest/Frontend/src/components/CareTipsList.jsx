import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CareTipsList({ onSelect }) {
  const [plants, setPlants] = useState([]);
  const [filter, setFilter] = useState('All');
  const topics = ['All', 'Watering', 'Sunlight', 'Soil', 'Pruning', 'Temperature'];

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/products') // or your plants API
      .then(res => setPlants(res.data))
      
      .catch(() => alert('Failed to fetch plants'));
      
  }, []);

  // Collect care tips filtered by topic
  const filteredTips = [];

  plants.forEach(plant => {
    if (plant.careTips && typeof plant.careTips === 'object') {
      Object.entries(plant.careTips).forEach(([topic, tip]) => {
        if (tip && (filter === 'All' || filter.toLowerCase() === topic)) {
          filteredTips.push({
            plantId: plant._id,
            plantName: plant.name,
            topic,
            tip,
          });
        }
      });
    }
  });
  

  return (
    <div className="caretips-container">
      <h2>Plant Care Tips</h2>
      <div>
        {topics.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              margin: '5px',
              backgroundColor: filter === t ? 'green' : 'lightgray',
              color: filter === t ? 'white' : 'black',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
       {filteredTips.map(({ plantId, plantName, topic, tip }, index) => (
  <div
    key={index}
    onClick={() => onSelect(plantId)} // ✅ Trigger detail view
    style={{
      border: '1px solid #ccc',
      margin: '10px',
      padding: '10px',
      cursor: 'pointer',
      backgroundColor: '#f9f9f9',
    }}
  >
    <h3>{plantName} - {topic.charAt(0).toUpperCase() + topic.slice(1)}</h3>
    <p>{tip}</p>
  </div>
))}

        
      </div>
    </div>
  );
}

export default CareTipsList;
