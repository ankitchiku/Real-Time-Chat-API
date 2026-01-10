# Chat API

A REST API for real-time messaging between users. Built with Node.js, Express, and MySQL.

## What's This?

This is a backend API that handles user accounts, authentication, and private messaging between two users. Think of it like the backend for a simple chat app - users can register, login, send messages to each other, and upload profile pictures.

## Tech Stack

- **Node.js** + **Express** - Server and routing
- **MySQL** - Database
- **Sequelize** - ORM for database operations
- **JWT** - User authentication
- **Multer** - File uploads
- **Swagger** - API documentation

## Getting Started

### What You Need

Make sure you have these installed first:
- Node.js (version 14 or newer)
- MySQL (version 5.7 or newer)
- A code editor
- Postman (optional, for testing)

### Installation

1. Download or clone this project

2. Install all the packages:
```bash
npm install
```

3. Create a MySQL database:
```sql
CREATE DATABASE chat_app;
```

4. Set up your environment variables. Copy the example file:
```bash
cp .env.example .env
```

Then open `.env` and update it with your actual database credentials:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_app

JWT_SECRET=make_this_a_long_random_string
JWT_EXPIRE=7d
```

5. Create the database tables:
```bash
npm run migrate
```

6. Start the server:
```bash
npm run dev
```

If everything worked, you should see:
```
Database connection established successfully.
Server running on port 3000
API docs available at http://localhost:3000/api-docs
```

## How to Use

### Try It Out

The easiest way to test the API is through Swagger. Just open your browser and go to:
```
http://localhost:3000/api-docs
```

You can also import the Postman collection (`Chat-API.postman_collection.json`) if you prefer that.

### Basic Flow

Here's how a typical user interaction works:

1. **Register a new account**
   ```
   POST /api/auth/register
   ```
   Send username, email, and password. You'll get back a JWT token.

2. **Login** (if you already have an account)
   ```
   POST /api/auth/login
   ```
   Use your email and password. You'll get a token back.

3. **Start a conversation**
   ```
   POST /api/conversations
   ```
   Provide another user's ID. This creates (or retrieves) a conversation between you two.

4. **Send messages**
   ```
   POST /api/messages
   ```
   Include the conversation ID and your message text.

5. **Get messages**
   ```
   GET /api/conversations/:id/messages
   ```
   Retrieves all messages from a conversation, with pagination.

### Authentication

Most endpoints need authentication. After logging in or registering, you'll get a JWT token. Include it in your requests like this:

```
Authorization: Bearer your_token_here
```

In Postman, you can set this once in the environment variables and it'll be used automatically.

## Main Features

### User Management
- Register new users with email/password
- Login with JWT tokens
- Get user profiles
- List all users

### Messaging
- Create conversations between two users
- Send text messages
- Retrieve message history (with pagination)
- See who sent each message and when

### Profile Pictures
- Upload one or multiple profile pictures
- Set a default profile picture
- Delete pictures you don't want anymore
- Pictures are stored locally in the `uploads` folder

### Security Stuff
- Passwords are hashed with bcrypt (can't be reversed)
- JWT tokens for authentication
- Rate limiting (prevents spam)
- Input validation on all endpoints
- CORS and Helmet for additional security

## Project Structure

```
chat-api/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Handle incoming requests
│   ├── middlewares/     # Authentication, validation, errors
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── uploads/             # Uploaded profile pictures
├── tests/               # Test files
├── .env                 # Your local config (don't commit this!)
├── server.js            # Starts everything up
└── package.json         # Dependencies and scripts
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get your profile info

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users/:id/profile-pictures` - Upload pictures
- `PATCH /api/users/:id/profile-pictures/:pictureId/default` - Set default pic
- `DELETE /api/users/:id/profile-pictures/:pictureId` - Remove a picture

### Conversations
- `POST /api/conversations` - Start or get a conversation
- `GET /api/conversations` - Your conversations
- `GET /api/conversations/:id/messages` - Get messages (paginated)

### Messages
- `POST /api/messages` - Send a message

## Running Tests

```bash
npm test
```

Tests use Jest. There's a basic authentication test included to get you started.

## Common Issues

**"Database connection failed"**
- Make sure MySQL is running
- Check your `.env` file has the right credentials
- Verify the database exists

**"Port 3000 already in use"**
- Change the PORT in your `.env` file
- Or kill whatever's using port 3000

**"Token invalid or expired"**
- Login again to get a fresh token
- Make sure you're sending it in the Authorization header

**"File upload not working"**
- Check that the `uploads` folder exists
- File must be JPG or PNG, under 2MB

## What's Next?

Some ideas if you want to extend this:

- Add Socket.IO for real-time messages (no page refresh needed)
- Group chats (more than 2 people)
- Message reactions (like, love, etc.)
- Typing indicators
- Read receipts
- User online/offline status
- Message search
- Photo/video sharing in messages
- Push notifications

## Environment Variables

Here's what each variable does:

- `PORT` - Which port the server runs on (default: 3000)
- `NODE_ENV` - development or production
- `DB_HOST` - MySQL server address
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for tokens (keep this private!)
- `JWT_EXPIRE` - How long tokens are valid (e.g., "7d" for 7 days)

## Scripts

```bash
npm start          # Run the server (production)
npm run dev        # Run with auto-restart on file changes
npm test           # Run tests
npm run migrate    # Set up database tables
```

## Notes

- Profile pictures are stored locally in the `uploads` folder. In production, you'd probably want to use cloud storage like AWS S3 instead.
- The API enforces that conversations are only between 2 users. If you need group chats, you'll need to modify the Conversation model.
- Messages are paginated (default 50 per page) to avoid loading too much data at once.
- User passwords are never returned in API responses - they're always excluded.

## License

MIT - do whatever you want with this code.
