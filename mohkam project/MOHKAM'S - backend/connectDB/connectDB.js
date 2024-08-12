import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/Mohkam';

const connectDB = async () => {
  try {
    const conn= await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
