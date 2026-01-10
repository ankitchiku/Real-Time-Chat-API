const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Conversation = require('./Conversation')(sequelize);
const Message = require('./Message')(sequelize);
const ProfilePicture = require('./ProfilePicture')(sequelize);

// define associations
User.hasMany(ProfilePicture, { foreignKey: 'userId', as: 'profilePictures' });
ProfilePicture.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

Conversation.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Conversation.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

module.exports = {
  sequelize,
  User,
  Conversation,
  Message,
  ProfilePicture
};