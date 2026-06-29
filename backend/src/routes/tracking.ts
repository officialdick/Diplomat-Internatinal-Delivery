import express, { Router, Request, Response } from 'express';
import Shipment from '../models/Shipment';
import { io } from '../index';

const router: Router = express.Router();

// Track shipment
router.get('/:trackingNumber', async (req: Request, res: Response) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });

    if (!shipment) {
      return res.status(404).json({ error: 'Tracking number not found' });
    }

    res.json({
      trackingNumber: shipment.trackingNumber,
      carrier: shipment.carrier,
      status: shipment.status,
      sender: {
        name: shipment.sender.name,
        city: shipment.sender.city,
        country: shipment.sender.country
      },
      recipient: {
        name: shipment.recipient.name,
        city: shipment.recipient.city,
        country: shipment.recipient.country
      },
      createdAt: shipment.timeline.createdAt,
      estimatedDelivery: shipment.timeline.estimatedDelivery,
      deliveredAt: shipment.timeline.deliveredAt,
      lastUpdate: shipment.updatedAt,
      events: shipment.events.map(e => ({
        timestamp: e.timestamp,
        location: e.location,
        status: e.status,
        description: e.description
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get tracking history
router.get('/:trackingNumber/history', async (req: Request, res: Response) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });

    if (!shipment) {
      return res.status(404).json({ error: 'Tracking number not found' });
    }

    res.json({
      trackingNumber: shipment.trackingNumber,
      events: shipment.events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket tracking (real-time)
router.post('/:trackingNumber/subscribe', (req: Request, res: Response) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    res.json({
      message: 'Use WebSocket to subscribe to real-time tracking',
      trackingNumber: trackingNumber,
      wsUrl: 'ws://localhost:5000',
      event: 'subscribe_tracking',
      data: { trackingNumber }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
