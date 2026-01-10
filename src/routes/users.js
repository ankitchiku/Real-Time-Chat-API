const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { upload } = require('../services/uploadService');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (public minimal list)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users/{id}/profile-pictures:
 *   post:
 *     summary: Upload profile pictures
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Pictures uploaded successfully
 *       400:
 *         description: Invalid file or size
 *       403:
 *         description: Forbidden
 */
router.post(
  '/:id/profile-pictures',
  protect,
  upload.array('pictures', 5),
  userController.uploadProfilePictures
);

/**
 * @swagger
 * /users/{id}/profile-pictures/{pictureId}/default:
 *   patch:
 *     summary: Set default profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: pictureId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Default picture updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Picture not found
 */
router.patch(
  '/:id/profile-pictures/:pictureId/default',
  protect,
  userController.setDefaultPicture
);

/**
 * @swagger
 * /users/{id}/profile-pictures/{pictureId}:
 *   delete:
 *     summary: Delete profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: pictureId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Picture deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Picture not found
 */
router.delete(
  '/:id/profile-pictures/:pictureId',
  protect,
  userController.deleteProfilePicture
);

module.exports = router;