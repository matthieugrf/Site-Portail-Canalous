const User = require('../models/userModel');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await User.findByUsernameAndPassword(username, password);

    if (users.length > 0) {
      res.json({ message: 'Login successful', user: users[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await User.create(username, password);
    res.json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
