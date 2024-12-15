const UserRepository = require('../repositories/userRepository');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(username, email) {
    return await this.userRepository.create({ username, email });
  }

  async getUser(username) {
    return await this.userRepository.findByUsername(username);
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async updateUser(username, userData) {
    return await this.userRepository.update(username, userData);
  }

  async deleteUser(username) {
    return await this.userRepository.delete(username);
  }
}

module.exports = UserService;
