import express from 'express';
import Invoice from '../models/invoiceModel.js';
import ClientLedger from '../models/clientLedgerModel.js';
import Payment from '../models/paymentModel.js'
import {addPayment, getPaymentsByClient} from '../controller/balanceController.js';

const router = express.Router();

router.post('/saveAndDebit', async (req, res) => {
  const { invoiceNum, clientId, clientName, products, totalAmount, DOI, dueDate } = req.body;

  try {
    const invoice = new Invoice({
      invoiceNum,
      clientId,
      clientName,
      products,
      totalAmount,
      status: 'unpaid',
      DOI,
      dueDate,
    });
    await invoice.save();

    let clientLedger = await ClientLedger.findOne({ clientId });
    if (!clientLedger) {
      clientLedger = new ClientLedger({
        clientId,
        clientName,
        debit: totalAmount,
        transactions: [{
          type: 'NewOrder',
          debit: totalAmount,
          credit: 0,
          balance: totalAmount,
          invoiceNum,
          date: new Date()
        }]
      });
    } else {
      clientLedger.debit += totalAmount;
      clientLedger.transactions.push({
        type: 'NewOrder',
        debit: totalAmount,
        credit: 0,
        balance: clientLedger.debit - clientLedger.credit,
        invoiceNum,
        date: new Date()
      });
    }
    await clientLedger.save();

    res.status(201).json({
      message: 'Invoice saved and debit added to client ledger',
      invoice,
      clientLedger
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to save invoice and update client ledger',
      error: error.message
    });
  }
});

router.get('/invoiceByNum/:invoiceNum', async (req, res) => {
  const { invoiceNum } = req.params;

  try {
      const invoice = await Invoice.findOne({invoiceNum}); 
      if (invoice) {
          res.status(200).json(invoice);
      } else {
          res.status(404).json({
              message: 'Invoice not found'
          });
      }
  } catch (error) {
      res.status(500).json({
          message: 'Server error',
          error: error.message
      });
  }
});

// BalanceRoutes.js
router.get('/invoice/:invoiceId', async (req, res) => {
  const { invoiceId } = req.params;

  try {
      const invoice = await Invoice.findById(invoiceId); // Use findById directly
      if (invoice) {
          res.status(200).json(invoice);
      } else {
          res.status(404).json({
              message: 'Invoice not found'
          });
      }
  } catch (error) {
      res.status(500).json({
          message: 'Server error',
          error: error.message
      });
  }
});


router.get('/ledger/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    const clientLedger = await ClientLedger.findOne({ clientId });
    if (clientLedger) {
      res.status(200).json(clientLedger);
    } else {
      res.status(404).json({
        message: 'Client ledger not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

router.get('/invoices/:clientId', async (req
, res) => {
const { clientId } = req.params;

try {
const invoices = await Invoice.find({ clientId });
res.status(200).json(invoices);
} catch (error) {
res.status(500).json({
message: 'Server error',
error: error.message
});
}
});

router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

router.delete('/invoice/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the invoice to get its totalAmount, clientId, and status
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found'
      });
    }

    const { clientId, totalAmount, status, remainingBalance, invoiceNum } = invoice;

    // Delete the invoice
    await Invoice.findByIdAndDelete(id);

    // Find the client ledger and update the credit or debit amount based on invoice status
    let clientLedger = await ClientLedger.findOne({ clientId });
    if (clientLedger) {
      if (status === 'paid') {
        clientLedger.credit -= totalAmount;
        clientLedger.debit -= totalAmount;
        if (clientLedger.credit < 0) clientLedger.credit = 0;
      }
      if (status === 'partial-paid') {
        const paid = totalAmount - remainingBalance;
        clientLedger.credit -= paid;
        clientLedger.debit -= totalAmount;
      } else {
        clientLedger.debit -= totalAmount;
        if (clientLedger.debit < 0) clientLedger.debit = 0;
      }

      // Remove the transactions associated with the deleted invoice
      clientLedger.transactions = clientLedger.transactions.filter(
        transaction => transaction.invoiceNum !== invoiceNum
      );

      await clientLedger.save();
    }

    res.status(200).json({
      message: 'Invoice and associated transactions deleted successfully, client ledger updated'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete invoice',
      error: error.message
    });
  }
});


router.put('/add-payment/:invoiceId', async (req, res) => {
  const { invoiceId } = req.params;
  const { amountPaid } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.remainingBalance -= amountPaid;
    if (invoice.remainingBalance < 0) invoice.remainingBalance = 0;
    invoice.status = invoice.remainingBalance === 0 ? 'paid' : 'partial-paid';
    await invoice.save();

    let clientLedger = await ClientLedger.findOne({ clientId: invoice.clientId });
    if (clientLedger) {
      clientLedger.credit += amountPaid;
      clientLedger.transactions.push({
        type: 'Payment',
        debit: 0,
        credit: amountPaid,
        balance: clientLedger.debit - clientLedger.credit,
        invoiceNum: invoice.invoiceNum
      });
      await clientLedger.save();
    }

    const payment = new Payment({
      invoiceNum: invoice.invoiceNum,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      amountPaid
    });
    await payment.save();

    res.status(200).json({
      message: 'Payment added successfully',
      invoice,
      clientLedger,
      payment
    });
  } catch (error) {
    console.error('Error adding payment:', error.message);
    res.status(500).json({ message: 'Failed to add payment', error: error.message });
  }
});

// Route to add payment
router.put('/add-payment/:invoiceId', addPayment);

// Route to get payments by client ID
router.get('/payments/:clientId', getPaymentsByClient);

export default router;
