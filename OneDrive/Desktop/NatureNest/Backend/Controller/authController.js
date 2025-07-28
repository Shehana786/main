const User = require('../Models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

exports.signup = async (req, res) => {
  console.log('Request body:', req.body);
  const { email, password,role } = req.body;

  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User
    ({ email, password: hashedPassword ,
       role: role || 'customer' 
      });
    await user.save();
    console.log(user);   
     console.log('User saved to DB:', user);



    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    // Create a safe user object without the password
    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    res.json({ token, role: user.role, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
