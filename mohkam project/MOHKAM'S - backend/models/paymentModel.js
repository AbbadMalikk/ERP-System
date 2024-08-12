import mongoose from 'mongoose';

const { Schema } = mongoose;

const paymentSchema = new Schema({
  invoiceNum: { type: String, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  clientName: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  paymentMadeOn: { type: Date, default: Date.now }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
