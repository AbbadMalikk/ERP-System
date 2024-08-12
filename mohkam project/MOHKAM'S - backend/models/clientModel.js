import mongoose from 'mongoose';

const { Schema } = mongoose;

const clientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String },
  phoneNumber: { type: Number, required: true, unique: true },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
