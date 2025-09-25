import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connection } from '../db.js';

const router = express.Router();

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  player_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// Register
router.post('/register', async (req, res) => {
  const { email, password, playerName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  connection.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    connection.query('INSERT INTO users SET ?', { email, password: hashedPassword, player_name: playerName }, (error, results) => {
      if (error) throw error;
      res.status(201).json({ message: 'User registered' });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        player_name: user.player_name
      }
    });
  });
});

export default router;