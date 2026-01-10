const conversationService = require('../services/conversationService');

class MessageController {
  async sendMessage(req, res, next) {
    try {
      const { conversationId, content } = req.body;
      const senderId = req.user.id;

      const message = await conversationService.sendMessage(
        conversationId,
        senderId,
        content
      );

      res.status(201).json({
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();