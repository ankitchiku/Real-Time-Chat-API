require('dotenv').config();
const { sequelize } = require('../models');

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // force: false means it won't drop existing tables
    // alter: true will try to modify existing tables to match models
    await sequelize.sync({ force: false, alter: true });
    
    console.log('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();