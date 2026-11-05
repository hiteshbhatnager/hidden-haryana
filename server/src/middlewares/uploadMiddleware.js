import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/apiResponse.js';

// Memory storage to process in-memory buffers for Cloudinary or local saving
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|avif/;
  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedExtensions.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        'Invalid file type. Only JPEG, JPG, PNG, WEBP, and AVIF images are allowed'
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter,
});
