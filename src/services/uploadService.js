const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { ProfilePicture } = require('../models');

// ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG images are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 2 * 1024 * 1024 // 2MB
  },
  fileFilter: fileFilter
});

class UploadService {
  async uploadProfilePictures(userId, files) {
    const pictures = [];

    for (const file of files) {
      const url = `/uploads/${file.filename}`;
      
      const picture = await ProfilePicture.create({
        userId,
        filename: file.filename,
        url,
        isDefault: false
      });

      pictures.push(picture);
    }

    // if this is the first picture, make it default
    const userPictures = await ProfilePicture.findAll({ where: { userId } });
    if (userPictures.length === pictures.length) {
      await pictures[0].update({ isDefault: true });
    }

    return pictures;
  }

  async setDefaultPicture(userId, pictureId) {
    const picture = await ProfilePicture.findOne({
      where: { id: pictureId, userId }
    });

    if (!picture) {
      throw new Error('Profile picture not found');
    }

    // unset all other defaults
    await ProfilePicture.update(
      { isDefault: false },
      { where: { userId } }
    );

    // set new default
    await picture.update({ isDefault: true });

    return picture;
  }

  async deleteProfilePicture(userId, pictureId) {
    const picture = await ProfilePicture.findOne({
      where: { id: pictureId, userId }
    });

    if (!picture) {
      throw new Error('Profile picture not found');
    }

    // delete file from filesystem
    const filePath = path.join(uploadsDir, picture.filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // if it was default, set another as default
    if (picture.isDefault) {
      const otherPicture = await ProfilePicture.findOne({
        where: { userId, id: { [require('sequelize').Op.ne]: pictureId } }
      });

      if (otherPicture) {
        await otherPicture.update({ isDefault: true });
      }
    }

    await picture.destroy();

    return { message: 'Profile picture deleted successfully' };
  }
}

module.exports = {
  upload,
  uploadService: new UploadService()
};