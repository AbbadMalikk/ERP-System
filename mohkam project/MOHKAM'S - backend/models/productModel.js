import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  Product_SKU: { type: String, required: true, unique: true },
  product_name: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_pictures: { type: String, required: true },  // URL string for image
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
