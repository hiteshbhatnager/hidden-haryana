import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post('/', protect, upload.single('image'), uploadImage);

export default router;

