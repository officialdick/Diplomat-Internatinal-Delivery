import express, { Router, Request, Response } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import Shipment from '../models/Shipment';
import User from '../models/User';

const router: Router = express.Router();

// Get dashboard stats
router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const deliveredShipments = await Shipment.countDocuments({ status: 'delivered' });
    const inTransitShipments = await Shipment.countDocuments({ status: 'in_transit' });
    const pendingShipments = await Shipment.countDocuments({ status: 'pending' });
    const failedShipments = await Shipment.countDocuments({ status: 'failed' });
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Shipment.aggregate([
      { $group: { _id: null, total: { $sum: '$pricing.totalPrice' } } }
    ]);

    res.json({
      totalShipments,
      deliveredShipments,
      inTransitShipments,
      pendingShipments,
      failedShipments,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      successRate: totalShipments > 0 ? ((deliveredShipments / totalShipments) * 100).toFixed(2) : 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all shipments
router.get('/shipments', authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { status, carrier, limit = 50, skip = 0 } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (carrier) filter.carrier = carrier;

    const shipments = await Shipment.find(filter)
      .sort({ 'timeline.createdAt': -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Shipment.countDocuments(filter);

    res.json({
      total,
      limit: Number(limit),
      skip: Number(skip),
      shipments
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { role, limit = 50, skip = 0 } = req.query;
    const filter: any = {};

    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await User.countDocuments(filter);

    res.json({
      total,
      limit: Number(limit),
      skip: Number(skip),
      users
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update shipment (admin only)
router.put('/shipments/:trackingNumber', authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const shipment = await Shipment.findOneAndUpdate(
      { trackingNumber: req.params.trackingNumber },
      { status, notes, updatedAt: new Date() },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({ message: 'Shipment updated', shipment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get revenue report
router.get('/reports/revenue', authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const filter: any = {};

    if (startDate || endDate) {
      filter['timeline.createdAt'] = {};
      if (startDate) filter['timeline.createdAt'].$gte = new Date(startDate as string);
      if (endDate) filter['timeline.createdAt'].$lte = new Date(endDate as string);
    }

    const revenue = await Shipment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.totalPrice' },
          totalShipments: { $sum: 1 },
          avgPrice: { $avg: '$pricing.totalPrice' }
        }
      }
    ]);

    res.json(revenue[0] || { totalRevenue: 0, totalShipments: 0, avgPrice: 0 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
