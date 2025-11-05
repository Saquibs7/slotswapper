import express from 'express';
import auth from '../middlewares/auth.js';
import { getMyEvents, createEvent, updateEventStatus } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', auth, getMyEvents);
router.post('/', auth, createEvent);
router.patch('/:eventId/status', auth, updateEventStatus);

export default router;
