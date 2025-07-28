// Catalog.jsx
import React, { useEffect, useState } from 'react';
import PlantCard from '../components/PlantCard';
import Sidebar from '../components/Sidebar';
import { useCart } from '../Context/CartContext';
import axios from 'axios';
import '../Styles/Global.css';


const Catalog = () => {
  const [plants, setPlants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, removeFromCart, cartItems } = useCart();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        setPlants(res.data);
        setFiltered(res.data);
      })
      .catch(() => alert('Failed to load products'));
  }, []);

useEffect(() => {
  const fetchPlants = async () => {
    try {
      let url = 'http://localhost:5000/api/products';
      if (selectedCategories.length === 1) {
        url += `?category=${selectedCategories[0]}`;
      }
      const res = await axios.get(url);
      setPlants(res.data);
      setFiltered(res.data);
    } catch {
      alert('Failed to load products');
    }
  };
  fetchPlants();
}, [selectedCategories]);


  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (value === 'all') {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((cat) => cat !== value)
    );
  };

  const addToCartHandler = () => {
    if (!selectedPlant) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedPlant);
    }
    alert(`Added ${quantity} "${selectedPlant.name}" to cart!`);
  };

  const removeFromCartHandler = () => {
    if (!selectedPlant) return;
    removeFromCart(selectedPlant._id);
    alert(`Removed "${selectedPlant.name}" from cart!`);
  };

  const isInCart = selectedPlant
    ? cartItems.some((item) => item._id === selectedPlant._id)
    : false;

  const incrementQuantity = () => {
    if (quantity < (selectedPlant?.stock || 1)) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="catalog-container">
      <Sidebar selectedCategories={selectedCategories} onCategoryChange={handleCategoryChange} />
      <div className="plant-grid">
        {filtered.length > 0 ? (
          filtered.map((pl) => (
            <div key={pl._id} onClick={() => setSelectedPlant(pl)} style={{ cursor: 'pointer' }}>
              <PlantCard plant={pl} />
            </div>
          ))
        ) : (
          <p>No plants match the selected filters.</p>
        )}
      </div>
      <div className="details-section">
        {selectedPlant ? (
          <>
            <img className="details-image" src={`http://localhost:5000/Uploads/${selectedPlant.imageUrl}`} alt={selectedPlant.name} />
            <h2 className="details-title">{selectedPlant.name}</h2>
            <p className="details-text"><strong>Description:</strong> {selectedPlant.description}</p>
            <p className="details-text"><strong>Care:</strong> {selectedPlant.care}</p>
            <p className="price">Price: ${selectedPlant.price.toFixed(2)}</p>
            <p className="quantity">Stock: {selectedPlant.stock}</p>

            <div className="quantity-selector">
              <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={incrementQuantity} disabled={quantity >= selectedPlant.stock}>+</button>
            </div>

            <div className="button-group">
              {!isInCart ? (
                <button className="button" onClick={addToCartHandler}>Add to Cart</button>
              ) : (
                <button className="button remove" onClick={removeFromCartHandler}>
                  Remove from Cart
                </button>
              )}
            </div>
          </>
        ) : (
          <p>Select a plant to see details</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
