const userService = require('../services/userService');
const { uploadService } = require('../services/uploadService');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();

      res.json({
        count: users.length,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.json({
        user
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadProfilePictures(req, res, next) {
    try {
      const userId = parseInt(req.params.id);

      // verify user is uploading their own picture
      if (req.user.id !== userId) {
        return res.status(403).json({ message: 'You can only upload pictures for your own profile' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const pictures = await uploadService.uploadProfilePictures(userId, req.files);

      res.status(201).json({
        message: 'Profile pictures uploaded successfully',
        pictures
      });
    } catch (error) {
      next(error);
    }
  }

  async setDefaultPicture(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const pictureId = parseInt(req.params.pictureId);

      if (req.user.id !== userId) {
        return res.status(403).json({ message: 'You can only modify your own profile pictures' });
      }

      const picture = await uploadService.setDefaultPicture(userId, pictureId);

      res.json({
        message: 'Default profile picture updated',
        picture
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfilePicture(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const pictureId = parseInt(req.params.pictureId);

      if (req.user.id !== userId) {
        return res.status(403).json({ message: 'You can only delete your own profile pictures' });
      }

      const result = await uploadService.deleteProfilePicture(userId, pictureId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();