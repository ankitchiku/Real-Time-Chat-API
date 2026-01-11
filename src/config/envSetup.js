const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function setupEnvironment() {
  const envPath = path.join(__dirname, '../../.env');
  const examplePath = path.join(__dirname, '../../.env.example');

  if (!fs.existsSync(envPath)) {
    console.log('.env file not found. Creating from .env.example...');

    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log('Created .env file from .env.example');
    } else {
      console.error('.env.example not found. Cannot auto-create .env');
      process.exit(1);
    }
  }

  require('dotenv').config();

  const placeholders = [
    'auto_generated_on_first_run',
    'your_secret_key_here',
    'shared_dev_secret_key_change_in_production',
    'change_this_to_random_string',
    'your_super_secret_jwt_key_change_this_in_production'
  ];

  if (!process.env.JWT_SECRET || placeholders.includes(process.env.JWT_SECRET)) {
    const newSecret = crypto.randomBytes(64).toString('hex');

    let envContent = fs.readFileSync(envPath, 'utf8');

    if (envContent.includes('JWT_SECRET=')) {
      envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${newSecret}`);
    } else {
      envContent += `\nJWT_SECRET=${newSecret}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    process.env.JWT_SECRET = newSecret;

    console.log('Auto-generated secure JWT_SECRET');
  } else {
    console.log('Using existing JWT_SECRET from .env');
  }

  const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(key => console.error(` - ${key}`));
    process.exit(1);
  }

  if (!process.env.DB_PASSWORD) {
    console.log('WARNING: DB_PASSWORD is not set in .env');
  }
}

module.exports = setupEnvironment;