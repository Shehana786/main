import React, { useState } from 'react';
import axios from 'axios';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';

function Login({setUser}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [showSignup, setShowSignup] = useState(false);
   const navigate = useNavigate();//Use to navigate different pages

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } else {
      localStorage.removeItem('user');
      setUser(null);
    }
    
    console.log('Login response:', res.data);
    
    if (res.data.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
    
  } catch (err) {
    alert('Login failed');
    console.error(err);
  }
};


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Log In</button>
      </form>
     <p onClick={() => setShowSignup(true)} style={{ color: 'blue', cursor: 'pointer' }}>
        Don't have an account? Sign up
      </p>
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </div>
    
    
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    backgroundColor: '#f0fff0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#2e7d32', 
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outlineColor: '#2e7d32',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#2e7d32', 
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Login;
