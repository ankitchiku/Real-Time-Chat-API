const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;
  
  try {
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server...');

    const dbName = process.env.DB_NAME || 'chat_app';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' ready!`);

    await connection.query(`USE \`${dbName}\``);

    await connection.end();
    console.log('Database setup completed successfully!\n');
    
    return true;
  } catch (error) {
    console.error('Database setup failed!');
    console.error('Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL is running');
    console.error('2. DB_USER and DB_PASSWORD in .env are correct');
    console.error('3. MySQL user has permission to CREATE DATABASE\n');
    
    if (connection) {
      await connection.end();
    }
    
    return false;
  }
}

module.exports = setupDatabase;