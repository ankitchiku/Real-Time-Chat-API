const { Conversation, User, Message } = require('../models');
const { Op } = require('sequelize');

class ConversationService {
  async createOrGetConversation(user1Id, user2Id) {
    if (user1Id === user2Id) {
      throw new Error('Cannot create conversation with yourself');
    }

    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    let conversation = await Conversation.findOne({
      where: {
        user1Id: smallerId,
        user2Id: largerId
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'user2', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    if (conversation) {
      return conversation;
    }

    conversation = await Conversation.create({
      user1Id: smallerId,
      user2Id: largerId
    });

    conversation = await Conversation.findByPk(conversation.id, {
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'user2', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    return conversation;
  }

  async sendMessage(conversationId, senderId, content) {

    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.user1Id !== senderId && conversation.user2Id !== senderId) {
      throw new Error('You are not part of this conversation');
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content
    });

    await conversation.update({ lastMessageAt: new Date() });

    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    return messageWithSender;
  }

  async getConversationMessages(conversationId, userId, page = 1, limit = 50) {
    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new Error('You are not part of this conversation');
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
      where: { conversationId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      messages: rows.reverse(), 
      pagination: {
        total: count,
        page,
        pages: Math.ceil(count / limit),
        limit
      }
    };
  }

  async getUserConversations(userId) {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'user2', attributes: ['id', 'username', 'firstName', 'lastName'] },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          required: false
        }
      ],
      order: [['lastMessageAt', 'DESC']]
    });

    return conversations;
  }
}

module.exports = new ConversationService();