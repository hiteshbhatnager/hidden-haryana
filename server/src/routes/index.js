import { Router } from 'express';
import authRoutes from './authRoutes.js';
import destinationRoutes from './destinationRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/destinations', destinationRoutes);
router.use('/upload', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Hidden Haryana API is running seamlessly',
    timestamp: new Date().toISOString(),
  });
});

export default router;
