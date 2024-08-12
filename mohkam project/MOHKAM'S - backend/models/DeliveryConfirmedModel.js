import mongoose from 'mongoose';

const { Schema } = mongoose;

const deliveryConfirmedSchema = new Schema({
  invoiceNum: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      productQuantity: { type: Number, required: true },
      salePrice: { type: Number, required: true },
      status: { type: String, enum: ['Unavailable', 'Confirmed'], required: true },
      reason: { type: String } // Required if status is 'Unavailable'
    }
  ],
  address: { type: String, required: true },
  phoneNumber: { type: Number, required: true }
}, { timestamps: true });

const DeliveryConfirmed = mongoose.model('DeliveryConfirmed', deliveryConfirmedSchema);

export default DeliveryConfirmed;
