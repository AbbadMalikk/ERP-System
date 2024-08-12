import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, required: true },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  invoiceNum: { type: String, required: true }
});

const clientLedgerSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  clientName: { type: String, required: true },
  credit: { type: Number, default: 0 },
  debit: { type: Number, default: 0 },
  balance: { type: Number, default: function () {
    return this.debit - this.credit;
  }},
  transactions: [transactionSchema]
}, { timestamps: true });

clientLedgerSchema.pre('save', function (next) {
  this.balance = this.debit - this.credit;
  next();
});

const ClientLedger = mongoose.model('ClientLedger', clientLedgerSchema);

export default ClientLedger;
