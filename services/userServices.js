const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const User = require('../models/userModel');

class UserService {
  // 📌 Create a new user and hash the password before saving
  async create(userData) {
    // Hash password before saving to DB
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);  // Generate salt for hashing
      userData.password = await bcrypt.hash(userData.password, salt);  // Hash password
    }
    
    const user = new User(userData);
    return await user.save();  // Save the user to the database
  }

  // 📌 Get all users (with filter option)
  async findAll(filter = {}) {
    return await User.find(filter);
  }

  // 📌 Find user by ID
  async findById(id) {
    return await User.findById(id);
  }

  // 📌 Update user details
  async update(id, updateData) {
    // If password is updated, hash it again before saving
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  // 📌 Delete user by ID
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
