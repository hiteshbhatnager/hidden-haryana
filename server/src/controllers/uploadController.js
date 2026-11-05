import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists for fallback local storage
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * @desc    Upload single image to Cloudinary (or local storage fallback)
 * @route   POST /api/upload
 * @access  Private
 */
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please select an image file to upload');
  }

  // If Cloudinary is actively configured with valid keys
  if (isCloudinaryConfigured()) {
    try {
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'hidden-haryana/destinations',
              resource_type: 'image',
              transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadStream();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            url: result.secure_url,
            public_id: result.public_id,
            caption: req.body.caption || '',
          },
          'Image uploaded to Cloudinary successfully'
        )
      );
    } catch (error) {
      console.warn('Cloudinary upload error, falling back to local storage:', error.message);
    }
  }

  // Local storage fallback
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(req.file.originalname) || '.jpg';
  const filename = `dest-${uniqueSuffix}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, req.file.buffer);

  const localUrl = `/uploads/${filename}`;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        url: localUrl,
        public_id: filename,
        caption: req.body.caption || '',
      },
      'Image uploaded successfully'
    )
  );
});
