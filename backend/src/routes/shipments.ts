import express, { Router, Request, Response } from 'express';
import Shipment from '../models/Shipment';
import { authMiddleware } from '../middleware/auth';
import { FedExService } from '../services/FedExService';
import { UPSService } from '../services/UPSService';
import { DHLService } from '../services/DHLService';

const router: Router = express.Router();

// Initialize carrier services
const fedexService = new FedExService(
  process.env.FEDEX_API_KEY || '',
  process.env.FEDEX_API_SECRET || '"
);
const upsService = new UPSService(process.env.UPS_API_KEY || '');
const dhlService = new DHLService(process.env.DHL_API_KEY || '');

// Create shipment
router.post('/create', authMiddleware, async (req: any, res: Response) => {
  try {
    const {
      senderName,
      senderEmail,
      senderPhone,
      senderAddress,
      senderCity,
      senderState,
      senderZip,
      senderCountry,
      recipientName,
      recipientEmail,
      recipientPhone,
      recipientAddress,
      recipientCity,
      recipientState,
      recipientZip,
      recipientCountry,
      weight,
      length,
      width,
      height,
      description,
      contents,
      value,
      carrier,
      insurance,
      signatureRequired
    } = req.body;

    // Generate tracking number
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    const trackingNumber = `${carrier.toUpperCase()}${timestamp}${random}`;
    const shipmentId = `SHIP${Date.now()}`;

    // Calculate pricing (basic calculation)
    const basePrice = weight * 5 + (length * width * height) / 5000;
    const tax = basePrice * 0.1;
    const totalPrice = basePrice + tax + (insurance ? 50 : 0);

    const shipment = new Shipment({
      trackingNumber,
      shipmentId,
      customerId: req.user.userId,
      carrier,
      status: 'pending',
      sender: {
        name: senderName,
        email: senderEmail,
        phone: senderPhone,
        address: senderAddress,
        city: senderCity,
        state: senderState,
        zip: senderZip,
        country: senderCountry
      },
      recipient: {
        name: recipientName,
        email: recipientEmail,
        phone: recipientPhone,
        address: recipientAddress,
        city: recipientCity,
        state: recipientState,
        zip: recipientZip,
        country: recipientCountry
      },
      package: {
        weight,
        dimensions: { length, width, height },
        description,
        contents: contents || [],
        value: value || 0
      },
      pricing: {
        basePrice,
        tax,
        totalPrice,
        currency: 'USD'
      },
      timeline: {
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      insurance: insurance || false,
      signature_required: signatureRequired || false,
      events: [{
        timestamp: new Date(),
        location: 'Order placed',
        status: 'pending',
        description: 'Your shipment has been created and is pending pickup'
      }]
    });

    await shipment.save();

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment: {
        shipmentId: shipment.shipmentId,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        carrier: shipment.carrier,
        totalPrice: shipment.pricing.totalPrice,
        estimatedDelivery: shipment.timeline.estimatedDelivery
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all shipments for user
router.get('/my-shipments', authMiddleware, async (req: any, res: Response) => {
  try {
    const shipments = await Shipment.find({ customerId: req.user.userId })
      .sort({ 'timeline.createdAt': -1 })
      .limit(50);

    res.json({
      total: shipments.length,
      shipments: shipments.map(s => ({
        shipmentId: s.shipmentId,
        trackingNumber: s.trackingNumber,
        status: s.status,
        carrier: s.carrier,
        totalPrice: s.pricing.totalPrice,
        createdAt: s.timeline.createdAt,
        estimatedDelivery: s.timeline.estimatedDelivery
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get shipment details
router.get('/:trackingNumber', async (req: Request, res: Response) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({
      shipmentId: shipment.shipmentId,
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      carrier: shipment.carrier,
      sender: shipment.sender,
      recipient: shipment.recipient,
      package: shipment.package,
      pricing: shipment.pricing,
      createdAt: shipment.timeline.createdAt,
      estimatedDelivery: shipment.timeline.estimatedDelivery,
      deliveredAt: shipment.timeline.deliveredAt,
      events: shipment.events
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update shipment status
router.put('/:trackingNumber/status', authMiddleware, async (req: any, res: Response) => {
  try {
    const { status, location, description } = req.body;

    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    shipment.status = status;

    if (status === 'delivered') {
      shipment.timeline.deliveredAt = new Date();
    } else if (status === 'picked_up') {
      shipment.timeline.pickedUpAt = new Date();
    }

    shipment.events.push({
      timestamp: new Date(),
      location: location || 'Unknown',
      status: status,
      description: description || `Shipment ${status}`
    });

    await shipment.save();

    res.json({ message: 'Shipment status updated', shipment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel shipment
router.delete('/:trackingNumber', authMiddleware, async (req: any, res: Response) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { trackingNumber: req.params.trackingNumber, customerId: req.user.userId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({ message: 'Shipment cancelled successfully', shipment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
