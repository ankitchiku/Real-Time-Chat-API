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

  // Load .env file first
  require('dotenv').config({ path: envPath });

  // Ensure certain .env values (DB_* and PORT) override existing system/user env vars.
  // This helps when a persistent OS env (e.g. DB_PORT=3307) was set previously
  // but the project .env intentionally sets a different value (e.g. 3306).
  try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split(/\r?\n/).forEach(line => {
      const m = line.match(/^([^#=\s]+)=(.*)$/);
      if (!m) return;
      const key = m[1].trim();
      let val = m[2] || '';
      val = val.trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // Keys we explicitly want to enforce from .env
      if (['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'PORT'].includes(key)) {
        process.env[key] = val;
      }
    });
    console.log('Applied DB and PORT variables from .env (overriding system env if present)');
  } catch (err) {
    // If reading fails, fallback to dotenv-loaded values (if any)
    console.error('Could not apply overrides from .env:', err.message);
  }

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