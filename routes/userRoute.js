const express = require('express');
const router = express.Router();
const userService = require('../services/userServices'); // Assuming you have a userService to handle database operations

// 📌 [POST] Create new user
router.post('/newUser', async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: err.message
    });
  }
});

// 📌 [GET] Get all users
router.get('/', async (req, res) => {
  try {
    const users = await userService.findAll();
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: err.message
    });
  }
});

// 📌 [GET] Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: err.message
    });
  }
});

// 📌 [PUT] Update user
router.put('/updateUser/:id', async (req, res) => {
  try {
    const updatedUser = await userService.update(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: err.message
    });
  }
});

// 📌 [DELETE] Delete user
router.delete('/deleteUser/:id', async (req, res) => {
  try {
    const deletedUser = await userService.delete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: err.message
    });
  }
});

module.exports = router;
