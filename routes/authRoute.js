const express = require('express');
const router = express.Router();
const authService = require('../services/authServices');

// 📌 [POST] Login
// Endpoint: POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// 📌 [POST] Logout
// Endpoint: POST /api/auth/logout
router.post('/logout', (req, res) => {
  // Just send logout message (Token will be deleted client-side)
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
