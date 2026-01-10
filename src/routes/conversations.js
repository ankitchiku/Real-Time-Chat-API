const express = require('express');
const { body } = require('express-validator');
const conversationController = require('../controllers/conversationController');
const { validate } = require('../middlewares/validator');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// all conversation routes require authentication
router.use(protect);

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Create or get existing conversation with another user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantId
 *             properties:
 *               participantId:
 *                 type: integer
 *                 description: ID of the other user
 *     responses:
 *       201:
 *         description: Conversation created or retrieved
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post(
  '/',
  [
    body('participantId').isInt({ min: 1 }).withMessage('Valid participant ID is required')
  ],
  validate,
  conversationController.createConversation
);

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Get all user conversations
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *       401:
 *         description: Not authorized
 */
router.get('/', conversationController.getUserConversations);

/**
 * @swagger
 * /conversations/{id}/messages:
 *   get:
 *     summary: Get messages from a conversation (paginated)
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Conversation ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not part of this conversation
 *       404:
 *         description: Conversation not found
 */
router.get('/:id/messages', conversationController.getConversationMessages);

module.exports = router;