import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlantList from './PlantList';
import '../../Styles/Global.css';

function ProductManager() {
  const categories = ['Indoor', 'Outdoor', 'Medicinal', 'Decorative'];
  const defaultCareTips = {
    watering: '',
    sunlight: '',
    soil: '',
    pruning: '',
    temperature: '',
    videoUrl:'',
  };

  const [plants, setPlants] = useState([]);
  const [plant, setPlant] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    careTips: { ...defaultCareTips },
    featured: false,
  });
  const [editingPlant, setEditingPlant] = useState(null);
  const [image, setImage] = useState(null);

  const fetchPlants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products');
      setPlants(res.data);
    } catch {
      console.error('Failed to fetch plants');
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in plant.careTips) {
      setPlant(prev => ({
        ...prev,
        careTips: { ...prev.careTips, [name]: value },
      }));
    } else if (type === 'checkbox') {
      setPlant(prev => ({ ...prev, [name]: checked }));
    } else {
      setPlant(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all plant properties except careTips
   Object.entries(plant).forEach(([key, val]) => {
  if (key !== 'careTips') {
    formData.append(key, val);
  }
});
formData.append('careTips', JSON.stringify(plant.careTips ?? {}));


    if (image) formData.append('image', image);

    try {
      if (editingPlant) {
        await axios.put(
          `http://localhost:5000/api/admin/products/${editingPlant._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        alert('Plant updated!');
      } else {
        await axios.post('http://localhost:5000/api/admin/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Plant added!');
      }

      setPlant({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: '',
        careTips: { ...defaultCareTips },
        featured: false,
      });
      setImage(null);
      setEditingPlant(null);
      fetchPlants();
    } catch {
      alert('Failed to save plant');
    }
  };

  const handleEdit = (plantToEdit) => {
    setPlant({
      name: plantToEdit.name || '',
      price: plantToEdit.price || '',
      category: plantToEdit.category || '',
      description: plantToEdit.description || '',
      stock: plantToEdit.stock || '',
      careTips: plantToEdit.careTips
        ? { ...defaultCareTips, ...plantToEdit.careTips }
        : { ...defaultCareTips },
      featured: plantToEdit.featured || false,
    });
    setEditingPlant(plantToEdit);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Plant deleted!');
      fetchPlants();
    } catch {
      alert('Failed to delete plant');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <input
          type="text"
          name="name"
          value={plant.name}
          onChange={handleChange}
          placeholder="Plant Name"
          required
        />
        <input
          type="number"
          name="price"
          value={plant.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <select name="category" value={plant.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <textarea
          name="description"
          value={plant.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="stock"
          value={plant.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          required
        />

        <h3>Care Tips</h3>
        <input
          type="text"
          name="watering"
          value={plant.careTips.watering}
          onChange={handleChange}
          placeholder="Watering Instructions"
        />
        <input
          type="text"
          name="sunlight"
          value={plant.careTips.sunlight}
          onChange={handleChange}
          placeholder="Sunlight Needs"
        />
        <input
          type="text"
          name="soil"
          value={plant.careTips.soil}
          onChange={handleChange}
          placeholder="Soil Type"
        />
        <input
          type="text"
          name="pruning"
          value={plant.careTips.pruning}
          onChange={handleChange}
          placeholder="Pruning Instructions"
        />
        <input
          type="text"
          name="temperature"
          value={plant.careTips.temperature}
          onChange={handleChange}
          placeholder="Temperature Range"
        />
        <input
    type="text"
    name="videoUrl"
    value={plant.careTips.videoUrl || ''}
    onChange={handleChange}
    placeholder="Video URL (e.g., YouTube embed link)"
/>


        <label>
          <input
            type="checkbox"
            name="featured"
            checked={plant.featured}
            onChange={handleChange}
          />
          Featured Product
        </label>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">{editingPlant ? 'Update Plant' : 'Add Plant'}</button>
      </form>

      <div style={{ flex: 1 }}>
        <PlantList plants={plants} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default ProductManager;
