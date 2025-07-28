import React, { useState, useEffect } from 'react';
import axios from 'axios';


const BookVisitForm = () => {
  const [form, setForm] = useState({
    service: '',
    name: '',
    email: '',
    plant: '',
    date: '',
    address: '',
  });

  const [plants, setPlants] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/products')
      .then(res => setPlants(res.data))
      .catch(err => console.error('Failed to fetch plants', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', form);
      alert('Your request has been submitted!');
      setForm({
        service: '',
        name: '',
        email: '',
        plant: '',
        date: '',
        address: '',
      });
    } catch {
      alert('Submission failed.');
    }
  };

  return (
    <div className="book-form">
      <h3> Book Visit / Delivery</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              name="service"
              value="visit"
              checked={form.service === 'visit'}
              onChange={handleChange}
            />
            Book Visit
          </label>
          <label style={{ marginLeft: '15px' }}>
            <input
              type="radio"
              name="service"
              value="delivery"
              checked={form.service === 'delivery'}
              onChange={handleChange}
            />
            Delivery
          </label>
        </div>

        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />

        <select name="plant" value={form.plant} onChange={handleChange} required>
          <option value="">Select Plant</option>
          {plants.map(p => (
            <option key={p._id} value={p.name}>{p.name}</option>
          ))}
        </select>

        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />

        {form.service === 'delivery' && (
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Delivery Address"
            required
          />
        )}

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default BookVisitForm;
