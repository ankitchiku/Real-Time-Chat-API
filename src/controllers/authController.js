const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      const result = await authService.register({
        username,
        email,
        password,
        firstName,
        lastName
      });

      res.status(201).json({
        message: 'User registered successfully',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.json({
        message: 'Login successful',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      res.json({
        user: req.user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();