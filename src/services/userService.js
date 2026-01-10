const { User, ProfilePicture } = require('../models');

class UserService {
  async getAllUsers() {
    const users = await User.findAll({
      attributes: ['id', 'username', 'firstName', 'lastName', 'createdAt'],
      where: { isActive: true },
      include: [
        {
          model: ProfilePicture,
          as: 'profilePictures',
          where: { isDefault: true },
          required: false,
          attributes: ['id', 'url', 'filename']
        }
      ]
    });

    return users;
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: ProfilePicture,
          as: 'profilePictures',
          attributes: ['id', 'url', 'filename', 'isDefault']
        }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new UserService();