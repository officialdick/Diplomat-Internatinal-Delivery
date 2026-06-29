import express from 'express';
import authRoutes from './auth';
import shipmentsRoutes from './shipments';
import trackingRoutes from './tracking';
import adminRoutes from './admin';
import ratesRoutes from './rates';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/shipments', shipmentsRoutes);
router.use('/tracking', trackingRoutes);
router.use('/admin', adminRoutes);
router.use('/rates', ratesRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DIPLOMAT INTERNATIONAL DELIVERY LTD - API'
  });
});

export default router;
