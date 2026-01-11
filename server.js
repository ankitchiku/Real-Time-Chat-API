require('dotenv').config();
const setupEnvironment = require('./src/config/envSetup');
const app = require('./src/app');
const { sequelize } = require('./src/models');
const setupDatabase = require('./src/config/setupDatabase');
const seedDatabase = require('./src/config/seedData');

setupEnvironment();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Starting Chat API Server...');

    const dbReady = await setupDatabase();
    if (!dbReady) {
      console.error('Database setup failed. Exiting...');
      process.exit(1);
    }

    await sequelize.authenticate();
    console.log('Database connection established.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`Server running on port ${PORT}`);
      console.log(`API docs: http://localhost:${PORT}/api-docs`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  }
}

startServer();