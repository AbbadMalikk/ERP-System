import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    OrderID: { type: String, required: true, unique: true },
    clientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    products: [
        {
            productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            product_name: { type: String, required: true },
            productActualPrice: { type: Number, required: true },
            salePrice: { type: Number, required: true },
            productPictures: { type: String, required: true },
            ProductReq: { type: Number, required: true },
        },
    ],
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
