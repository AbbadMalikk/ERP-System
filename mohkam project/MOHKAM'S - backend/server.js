import express from 'express';
import dotenv from "dotenv"
import connectDB from './connectDB/connectDB.js'; // Adjust the path as per your directory structure
import userRoutes from "./routes/userRoutes.js"
import cookieParser from 'cookie-parser';
import productRoutes from "./routes/productRoutes.js"
import clientRoutes from './routes/clientRoutes.js'
import cors from 'cors'
import cloudinary from 'cloudinary';
import orderRoutes from './routes/orderRoutes.js';
import balanceRoutes from './routes/balanceRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
// Connect to MongoDB
dotenv.config(); 

connectDB();

// Example route using Express
const app = express();

const PORT = process.env.PORT || 5000;
// Example route to create a new user

app.use(express.json({limit:"5mb"})); //To parse json data in req.body
app.use(express.urlencoded({extended:true})) //to parse form data in body
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your frontend URL
    credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
  }));

  // Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Routes
app.use("/api/users",userRoutes)
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/balance',balanceRoutes);
app.use('/api/delivery',deliveryRoutes)

app.listen(5000,()=> console.log(`Server started at http://localhost:${PORT}`));
