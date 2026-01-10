const { Conversation, User, Message } = require('../models');
const { Op } = require('sequelize');

class ConversationService {
  async createOrGetConversation(user1Id, user2Id) {
    if (user1Id === user2Id) {
      throw new Error('Cannot create conversation with yourself');
    }

    // normalize user IDs so we always store smaller ID as user1
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    // check if conversation exists
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

    // create new conversation
    conversation = await Conversation.create({
      user1Id: smallerId,
      user2Id: largerId
    });

    // fetch with user details
    conversation = await Conversation.findByPk(conversation.id, {
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'user2', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    return conversation;
  }

  async sendMessage(conversationId, senderId, content) {
    // verify conversation exists and user is part of it
    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.user1Id !== senderId && conversation.user2Id !== senderId) {
      throw new Error('You are not part of this conversation');
    }

    // create message
    const message = await Message.create({
      conversationId,
      senderId,
      content
    });

    // update conversation last message time
    await conversation.update({ lastMessageAt: new Date() });

    // fetch message with sender info
    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    return messageWithSender;
  }

  async getConversationMessages(conversationId, userId, page = 1, limit = 50) {
    // verify user is part of conversation
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
      messages: rows.reverse(), // reverse to show oldest first
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