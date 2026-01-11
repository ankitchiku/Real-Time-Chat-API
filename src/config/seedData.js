const { User, Conversation, Message } = require('../models');

async function seedDatabase() {
  try {
    // Check if data already exists
    const userCount = await User.count();
    
    if (userCount > 0) {
      console.log('Database already has data. Skipping seed...');
      return;
    }

    console.log('Seeding database with sample data...');

    // Create sample users
    const users = await User.bulkCreate([
      {
        username: 'alice_wonder',
        email: 'alice@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Wonderland',
        isActive: true
      },
      {
        username: 'bob_builder',
        email: 'bob@example.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Builder',
        isActive: true
      },
      {
        username: 'charlie_brown',
        email: 'charlie@example.com',
        password: 'password123',
        firstName: 'Charlie',
        lastName: 'Brown',
        isActive: true
      },
      {
        username: 'diana_prince',
        email: 'diana@example.com',
        password: 'password123',
        firstName: 'Diana',
        lastName: 'Prince',
        isActive: true
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample conversations
    const conversations = await Conversation.bulkCreate([
      {
        user1Id: users[0].id,
        user2Id: users[1].id,
        lastMessageAt: new Date()
      },
      {
        user1Id: users[0].id,
        user2Id: users[2].id,
        lastMessageAt: new Date()
      },
      {
        user1Id: users[1].id,
        user2Id: users[2].id,
        lastMessageAt: new Date()
      }
    ]);

    console.log(`✅ Created ${conversations.length} conversations`);

    // Create sample messages
    const messages = await Message.bulkCreate([
      {
        conversationId: conversations[0].id,
        senderId: users[0].id,
        content: 'Hey Bob! How are you doing?',
        isRead: true
      },
      {
        conversationId: conversations[0].id,
        senderId: users[1].id,
        content: 'Hi Alice! I\'m doing great, thanks for asking!',
        isRead: true
      },
      {
        conversationId: conversations[0].id,
        senderId: users[0].id,
        content: 'That\'s wonderful to hear. Want to grab coffee later?',
        isRead: false
      },
      {
        conversationId: conversations[1].id,
        senderId: users[0].id,
        content: 'Charlie, did you finish the project report?',
        isRead: true
      },
      {
        conversationId: conversations[1].id,
        senderId: users[2].id,
        content: 'Almost done! Just need to add the final section.',
        isRead: false
      }
    ]);

    console.log(`✅ Created ${messages.length} messages`);
    console.log('\n✨ Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: alice@example.com | Password: password123');
    console.log('Email: bob@example.com | Password: password123');
    console.log('Email: charlie@example.com | Password: password123\n');

  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}

module.exports = seedDatabase;