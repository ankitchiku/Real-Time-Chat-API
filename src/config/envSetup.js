const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function setupEnvironment() {
  const envPath = path.join(__dirname, '../../.env');
  const examplePath = path.join(__dirname, '../../.env.example');
  
  // Check if .env exists, if not create from example
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found. Creating from .env.example...\n');
    
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log('✅ Created .env file from .env.example\n');
    } else {
      console.error('❌ .env.example not found! Cannot auto-create .env');
      process.exit(1);
    }
  }
  
  // Re-read .env to get latest values. Do NOT override existing process.env
  // so that environment variables injected by Docker / CI take precedence.
  require('dotenv').config();
  
  // Generate JWT_SECRET if not set or is placeholder
  const placeholders = [
    'auto_generated_on_first_run',
    'your_secret_key_here',
    'shared_dev_secret_key_change_in_production',
    'change_this_to_random_string',
    'your_super_secret_jwt_key_change_this_in_production'
  ];
  
  if (!process.env.JWT_SECRET || placeholders.includes(process.env.JWT_SECRET)) {
    const newSecret = crypto.randomBytes(64).toString('hex');
    
    // Read .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace JWT_SECRET line
    if (envContent.includes('JWT_SECRET=')) {
      envContent = envContent.replace(
        /JWT_SECRET=.*/,
        `JWT_SECRET=${newSecret}`
      );
    } else {
      envContent += `\nJWT_SECRET=${newSecret}\n`;
    }
    
    // Write back to .env
    fs.writeFileSync(envPath, envContent);
    
    // Update process.env
    process.env.JWT_SECRET = newSecret;
    
    console.log('🔐 Auto-generated secure JWT_SECRET');
    console.log('   Saved to .env: ' + newSecret.substring(0, 30) + '...\n');
  } else {
    console.log('✅ Using existing JWT_SECRET from .env\n');
  }
  
  // Validate required environment variables
  const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease check your .env file!\n');
    process.exit(1);
  }
  
  // Warn if using default database password (common mistake)
  if (!process.env.DB_PASSWORD) {
    console.log('⚠️  WARNING: DB_PASSWORD is not set in .env');
    console.log('   If your MySQL has a password, the connection will fail!\n');
  }
}

module.exports = setupEnvironment;