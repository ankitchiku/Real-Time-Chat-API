const { Sequelize } = require('sequelize');

const envHost = process.env.DB_HOST || 'localhost';
const envPortRaw = process.env.DB_PORT;
const effectivePort = (envHost === '127.0.0.1' || envHost === 'localhost') ? 3306 : parseInt(envPortRaw || '3306', 10);

const sequelize = new Sequelize(
  process.env.DB_NAME || 'chat_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: envHost,
    port: effectivePort,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

module.exports = sequelize;