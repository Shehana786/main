import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Global.css'; // your CSS

const Home = () => {
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [categories, setCategories] = useState([]);

 
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/products/featured');
        setFeaturedPlants(res.data);
      } catch (error) {
        console.error('Failed to fetch featured plants', error);
      }
    };
    fetchFeatured();
  },[]);

   useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  fetchCategories();
}, []);


  return (
    <div className="main-container">
      {/* HERO */}
      <section className="hero-section">
        <img className="hero-image" src="/assets/hero.jpg" alt="Hero Plant" />
        <div className="hero-text">
          <h1>Welcome to NatureNest 🌿</h1>
          <p>Discover, shop, and learn plant care from the experts.</p>
          <a href="/catalog">
            <button>Shop Now</button>
          </a>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="category-section">
        <h2>Shop by Category</h2>
       <div className="category-cards">
  {Array.isArray(categories) &&
    categories
      .filter(cat => cat && typeof cat.name === 'string')
      .map((cat, i) => (
        <a
          key={i}
          href={`/catalog?category=${cat.name.toLowerCase()}`}
          className="category-card"
        >
         <img
            src={`http://localhost:5000/Uploads/${cat.imageUrl || 'placeholder.jpg'}`}
            alt={cat.name}
          />
          <h3>{cat.name}Plants</h3>
        </a>
      ))}
</div>

      </section>

     {/* FEATURED PRODUCTS*/} 
       <section className="featured-section">
        <h2> Featured Plants</h2>
        <div className="plant-grid">
          {featuredPlants.map((plant) => (
            <div className="plant-card" key={plant._id}>
              <img src={`http://localhost:5000/uploads/${plant.imageUrl}`} alt={plant.name} />
              <h3>{plant.name}</h3>
              <p>{plant.price}</p>
              <a href={`/product/${plant._id}`}>
                <button>View Details</button>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} NatureNest | All rights reserved 🌱</p>
      </footer>
    </div>
  );
};

export default Home;
