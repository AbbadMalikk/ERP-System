import mongoose from 'mongoose';

const { Schema } = mongoose;

const invoiceSchema = new Schema({
  invoiceNum: { type: String, required: true, unique: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  clientName: { type: String, required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      productPictures:{type:String, required: true },
      productName: { type: String, required: true },
      productQuantity: { type: Number, required: true },
      salePrice: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  remainingBalance: { type: Number }, // Add remainingBalance
  status: { type: String, enum: ['unpaid', 'partial-paid', 'paid'], default: 'unpaid' },
  DOI:{type:String},
  dueDate:{type:String},
}, { timestamps: true });

invoiceSchema.pre('save', function (next) {
  if (this.isNew) {
    this.remainingBalance = this.totalAmount;
  }
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
