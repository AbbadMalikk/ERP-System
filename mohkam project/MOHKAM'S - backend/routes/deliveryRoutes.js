import express from 'express';
import DeliveryConfirmed from '../models/deliveryConfirmedModel.js';
import Invoice from '../models/invoiceModel.js';

const router = express.Router();

// Route to get all deliveryConfirmed objects
router.get('/deliveries', async (req, res) => {
  try {
    const deliveries = await DeliveryConfirmed.find();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deliveries', error });
  }
});

// Route to get all invoices with status 'paid' not in deliveryConfirmed
router.get('/invoices/not-delivered', async (req, res) => {
  try {
    const deliveredInvoices = await DeliveryConfirmed.find().distinct('invoiceNum');
    const invoices = await Invoice.find({ invoiceNum: { $nin: deliveredInvoices }, status: 'paid' });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices', error });
  }
});

// Route to save a new deliveryConfirmed
router.post('/deliveries', async (req, res) => {
  try {
    const { invoiceNum, clientName, clientId, products, address, phoneNumber } = req.body;

    const deliveryConfirmed = new DeliveryConfirmed({
      invoiceNum,
      clientName,
      clientId,
      products,
      address,
      phoneNumber
    });

    await deliveryConfirmed.save();
    res.status(201).json(deliveryConfirmed);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save delivery', error });
  }
});

export default router;
