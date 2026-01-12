const { User, Conversation, Message } = require('../models');

async function seedDatabase() {
  try {
    const userCount = await User.count();
    
    if (userCount > 0) {
      console.log('Database already has data. Skipping seed...');
      return;
    }

    console.log('Seeding database with sample data...');

    const users = await User.bulkCreate([
      {
        username: 'Ankit',
        email: 'ankit@example.com',
        password: 'password123',
        firstName: 'Ankit',
        lastName: 'Gupta',
        isActive: true
      },
      {
        username: 'Cheeku',
        email: 'cheeku@example.com',
        password: 'password123',
        firstName: 'Cheeku',
        lastName: 'Gupta',
        isActive: true
      },
      {
        username: 'Harsh',
        email: 'harsh@example.com',
        password: 'password123',
        firstName: 'Harsh',
        lastName: 'Rajput',
        isActive: true
      },
      {
        username: 'Ashwin',
        email: 'ashwin@example.com',
        password: 'password123',
        firstName: 'Ashwin',
        lastName: 'Girdhar',
        isActive: true
      }
    ]);

    console.log(`Created ${users.length} users`);

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

    console.log(`Created ${conversations.length} conversations`);

    const messages = await Message.bulkCreate([
      {
        conversationId: conversations[0].id,
        senderId: users[0].id,
        content: 'Hey Cheeku! How are you doing?',
        isRead: true
      },
      {
        conversationId: conversations[0].id,
        senderId: users[1].id,
        content: 'Hi Ankit! I\'m doing great, thanks for asking!',
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
        content: 'Harsh, did you finish the project report?',
        isRead: true
      },
      {
        conversationId: conversations[1].id,
        senderId: users[2].id,
        content: 'Almost done! Just need to add the final section.',
        isRead: false
      }
    ]);

    console.log(`Created ${messages.length} messages`);
    console.log('\n Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: ankit@example.com | Password: password123');
    console.log('Email: cheeku@example.com | Password: password123');
    console.log('Email: harsh@example.com | Password: password123');
    console.log('Email: ashwin@example.com | Password: password123\n');

  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}

module.exports = seedDatabase;
