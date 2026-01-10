const conversationService = require('../services/conversationService');

class ConversationController {
  async createConversation(req, res, next) {
    try {
      const { participantId } = req.body;
      const user1Id = req.user.id;

      const conversation = await conversationService.createOrGetConversation(
        user1Id,
        participantId
      );

      res.status(201).json({
        message: 'Conversation created or retrieved successfully',
        conversation
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserConversations(req, res, next) {
    try {
      const userId = req.user.id;

      const conversations = await conversationService.getUserConversations(userId);

      res.json({
        count: conversations.length,
        conversations
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversationMessages(req, res, next) {
    try {
      const conversationId = parseInt(req.params.id);
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const result = await conversationService.getConversationMessages(
        conversationId,
        userId,
        page,
        limit
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConversationController();