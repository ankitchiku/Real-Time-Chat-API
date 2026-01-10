const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const { validate } = require('../middlewares/validator');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// all message routes require authentication
router.use(protect);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - content
 *             properties:
 *               conversationId:
 *                 type: integer
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not part of this conversation
 */
router.post(
  '/',
  [
    body('conversationId').isInt({ min: 1 }).withMessage('Valid conversation ID is required'),
    body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be 1-5000 characters')
  ],
  validate,
  messageController.sendMessage
);

module.exports = router;