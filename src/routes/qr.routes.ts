import express from 'express';
import { 
  generateStaticQR,
  generateDynamicQR,
  updateDynamicQR,
  trackEvent,
  getEvents,
  getAnalytics,
  getUserQRCodes
} from '../controllers/qr.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate); // All QR routes require authentication

router.post('/static', generateStaticQR);
router.post('/dynamic', generateDynamicQR);
router.put('/:id/update', updateDynamicQR);
router.post('/:id/track', trackEvent);
router.get('/:id/events', getEvents);
router.get('/:id/analytics', getAnalytics);
router.get('/my-codes', getUserQRCodes);

export default router;