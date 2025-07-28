require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
//console.log('JWT_SECRET used for verification:', JWT_SECRET);

module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  
    req.user = decoded; 
    console.log(' Token decoded:', decoded);
    next();
  } catch (err) {
    console.error(' Invalid token', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
