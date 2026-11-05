import { Router } from 'express';
import {
  getDestinations,
  getFeaturedDestinations,
  getHiddenGems,
  getRecentDestinations,
  getDestinationsMeta,
  getDestinationByIdOrSlug,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { validateDestination } from '../middlewares/validateMiddleware.js';

const router = Router();

// Public routes for exploration and homepage
router.get('/', getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/hidden-gems', getHiddenGems);
router.get('/recent', getRecentDestinations);
router.get('/meta', getDestinationsMeta);
router.get('/:idOrSlug', getDestinationByIdOrSlug);

// Protected routes (Admin / authenticated managers)
router.post('/', protect, authorize('admin'), validateDestination, createDestination);
router.put('/:id', protect, authorize('admin'), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

export default router;

