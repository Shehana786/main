import React from 'react';

const PlantCard = ({ plant, onClick, style }) => {
  // Add 'clickable' class if onClick prop exists
  const classNames = onClick ? 'plant-card clickable' : 'plant-card';

  return (
    <div className={classNames} style={style} onClick={onClick}>
      <img src={`http://localhost:5000/Uploads/${plant.imageUrl}`}  alt={plant.name} />
      <h3>{plant.name}</h3>
      <p>{plant.shortDescription || plant.desc || ''}</p>
    </div>
  );
};

export default PlantCard;
