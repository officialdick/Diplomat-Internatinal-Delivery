import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Get shipping rates
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { weight, length, width, height, originZip, destinationZip, carriers, insurance } = req.body;

    if (!weight || !originZip || !destinationZip) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Base rate calculation
    const baseRate = weight * 5 + (length * width * height) / 5000;
    const insuranceFee = insurance ? 50 : 0;

    const rates: any = {};

    if (!carriers || carriers.includes('fedex')) {
      rates.fedex = {
        carrier: 'FedEx',
        basePrice: baseRate * 1.1,
        tax: baseRate * 1.1 * 0.1,
        insurance: insuranceFee,
        totalPrice: baseRate * 1.1 * 1.1 + insuranceFee,
        estimatedDays: 3,
        serviceType: 'FedEx Ground'
      };
    }

    if (!carriers || carriers.includes('ups')) {
      rates.ups = {
        carrier: 'UPS',
        basePrice: baseRate,
        tax: baseRate * 0.1,
        insurance: insuranceFee,
        totalPrice: baseRate * 1.1 + insuranceFee,
        estimatedDays: 4,
        serviceType: 'UPS Ground'
      };
    }

    if (!carriers || carriers.includes('dhl')) {
      rates.dhl = {
        carrier: 'DHL',
        basePrice: baseRate * 0.95,
        tax: baseRate * 0.95 * 0.1,
        insurance: insuranceFee,
        totalPrice: baseRate * 0.95 * 1.1 + insuranceFee,
        estimatedDays: 5,
        serviceType: 'DHL eCommerce'
      };
    }

    res.json({
      origin: originZip,
      destination: destinationZip,
      weight: weight,
      rates: rates
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
