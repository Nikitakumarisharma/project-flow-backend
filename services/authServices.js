const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // User model

const JWT_SECRET = '123'; // Ye secret ko env variable se lena chahiye, secure rakhna

class AuthService {
  // 📌 Login user and generate JWT token
  async login(email, password) {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' } // 1 hour expiration time for token
    );

    return { token, user }; // Return token and user details
  }

  // 📌 Logout (client side pe token delete karna hoga)
  logout() {
    return { message: 'User logged out successfully' };
  }
}

module.exports = new AuthService();
