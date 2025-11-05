import express from 'express';
import auth from '../middlewares/auth.js';
import {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getSwapRequests,
} from '../controllers/swapController.js';

const router = express.Router();

router.get('/swappable-slots', auth, getSwappableSlots);
router.post('/swap-request', auth, createSwapRequest);
router.post('/swap-response/:requestId', auth, respondToSwapRequest);
router.get('/swap-requests', auth, getSwapRequests);

export default router;
