import Payment from '../models/paymentModel.js';
import ClientLedger from '../models/clientLedgerModel.js';
import Invoice from '../models/invoiceModel.js';

// Add payment function
const addPayment = async (req, res) => {
  const { invoiceId } = req.params;
  const { amountPaid } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (amountPaid > invoice.remainingBalance) {
      return res.status(400).json({ message: 'Amount paid exceeds remaining balance' });
    }

    invoice.remainingBalance -= amountPaid;
    await invoice.save();

    const clientLedger = await ClientLedger.findOne({ clientId: invoice.clientId });
    if (clientLedger) {
      clientLedger.credit += amountPaid;
      await clientLedger.save();
    }

    const payment = new Payment({
      clientId: invoice.clientId,
      invoiceNum: invoice.invoiceNum,
      amountPaid,
      paymentMadeOn: new Date()
    });
    await payment.save();

    res.status(200).json({ message: 'Payment added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payments by client ID
const getPaymentsByClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const payments = await Payment.find({ clientId });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export{addPayment,getPaymentsByClient}