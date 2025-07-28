import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CareTipDetail({ id, onBack }) {
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setPlant(res.data))
      
      .catch(() => alert('Failed to load plant details'));
  }, [id]);

  if (!plant) return <div>Loading...</div>;
  const getEmbedUrl = (url) => {
  if (!url) return '';
  return url.replace("watch?v=", "embed/");
};


  return (
   <div className="caretip-detail-container">
  <button className="back-button" onClick={onBack}>← Back to Care Tips</button>
  <h2>{plant.name}</h2>
  <p><strong>Category:</strong> {plant.category}</p>
  <p><strong>Description:</strong> {plant.description}</p>

  <img
    src={plant.imageUrl ? `http://localhost:5000/Uploads/${plant.imageUrl}` : '/default.jpg'}
    alt={plant.name}
    onError={e => { e.target.src = '/default.jpg'; }}
  />

  <h3>Care Tips</h3>
  <ul>
    {Object.entries(plant.careTips || {}).map(([topic, tip]) =>
      topic !== 'videoUrl' && tip ? (
        <li key={topic}>
          <strong>{topic.charAt(0).toUpperCase() + topic.slice(1)}:</strong> {tip}
        </li>
      ) : null
    )}
  </ul>

  {plant.careTips?.videoUrl && (
    <div style={{ marginTop: '20px' }}>
      <h4>Watch Video</h4>
      <iframe
  width="100%"
  height="315"
  src={getEmbedUrl(plant.careTips?.videoUrl)}
  title="Care Tip Video"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>

    </div>
  )}
</div>
  );
}

export default CareTipDetail;
