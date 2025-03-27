const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Environment variables for admin login
    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;
    
    // Check if credentials match environment variables
    if (envUsername && envPassword && username === envUsername && password === envPassword) {
      const payload = {
        user: {
          id: 'admin',
          username: envUsername
        }
      };
      
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      return;
    }
    
    // If not matching environment variables, return invalid credentials
    return res.status(400).json({ message: 'Invalid credentials' });
    
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/check-ip
// @desc    Check if request is from authorized IP
// @access  Public
router.get('/check-ip', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const authorizedIP = process.env.MANAGEMENT_HOST || '167.235.21.86';
  
  if (clientIP === authorizedIP) {
    res.status(200).json({ authorized: true });
  } else {
    res.status(403).json({ authorized: false });
  }
});

module.exports = router;
