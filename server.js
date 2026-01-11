require('dotenv').config();
const setupEnvironment = require('./src/config/envSetup');
const app = require('./src/app');
const { sequelize } = require('./src/models');
const setupDatabase = require('./src/config/setupDatabase');
const seedDatabase = require('./src/config/seedData');

// Setup environment (auto-generate JWT_SECRET if needed)
setupEnvironment();

const PORT = process.env.PORT || 3000;

// setup database and start server
async function startServer() {
  try {
    console.log('🚀 Starting Chat API Server...\n');
    
    // Step 1: Setup database (create if doesn't exist)
    const dbReady = await setupDatabase();
    if (!dbReady) {
      console.error('❌ Database setup failed. Exiting...');
      process.exit(1);
    }
    
    // Step 2: Connect with Sequelize
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Step 3: Sync models (create/update tables)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database tables synchronized.');
      
      // Step 4: Seed database with sample data (only in dev and if empty)
      await seedDatabase();
    }
    
    // Step 5: Start Express server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log('='.repeat(50) + '\n');
      console.log('Ready to accept requests! 🎉\n');
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
}

startServer();