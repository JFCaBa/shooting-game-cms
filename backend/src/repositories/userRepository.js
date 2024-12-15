const User = require('../models/User');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByUsername(username) {
    return await User.findOne({ username });
  }

  async findAll() {
    return await User.find();
  }

  async update(username, userData) {
    return await User.findOneAndUpdate(
      { username },
      userData,
      { new: true, runValidators: true }
    );
  }

  async delete(username) {
    const result = await User.deleteOne({ username });
    return result.deletedCount > 0;
  }
}

module.exports = UserRepository;
