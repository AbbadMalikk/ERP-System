import express from 'express';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

const router = express.Router();

// Add Order
router.post('/add-order', async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const {  OrderID, clientID, products } = req.body;
    
    // Validate clientID and products array
    if (!clientID || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    // Validate each product and quantity
    for (const product of products) {
      const { productID, ProductReq } = product;
      const existingProduct = await Product.findById(productID);

      if (!existingProduct || ProductReq > existingProduct.product_quantity) {
        return res.status(400).json({ error: 'Invalid product or insufficient quantity' });
      }
    }

    const newOrder = new Order({  OrderID, clientID, products });
    await newOrder.save();

    // Deduct product quantities
    for (const product of products) {
      const { productID, ProductReq } = product;
      const existingProduct = await Product.findById(productID);
      existingProduct.product_quantity -= ProductReq;
      await existingProduct.save();
    }

    res.status(201).json({ message: 'Order added successfully!', order: newOrder });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Get all orders
router.get('/ordersid', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('clientID', 'name phoneNumber address')
      .populate('products.productID', 'product_name product_pictures Product_SKU');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Order
router.delete('/delete-order/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Restore product quantities
    for (const product of deletedOrder.products) {
      const existingProduct = await Product.findById(product.productID);
      existingProduct.product_quantity += product.ProductReq;
      await existingProduct.save();
    }

    res.status(200).json({ message: 'Order deleted successfully!' });
  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit Order
router.put('/update-order/:id', async (req, res) => {
  try {
    const { clientID, products } = req.body;

    // Validate each product and quantity
    for (const product of products) {
      const { productID, ProductReq } = product;
      const existingProduct = await Product.findById(productID);

      if (!existingProduct || ProductReq > existingProduct.product_quantity) {
        return res.status(400).json({ error: 'Invalid product or insufficient quantity' });
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { clientID, products },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Adjust product quantities
    for (const product of updatedOrder.products) {
      const existingProduct = await Product.findById(product.productID);
      existingProduct.product_quantity += product.ProductReq;
      await existingProduct.save();
    }

    // Deduct product quantities
    for (const product of products) {
      const existingProduct = await Product.findById(product.productID);
      existingProduct.product_quantity -= product.ProductReq;
      await existingProduct.save();
    }

    res.status(200).json({ message: 'Order updated successfully!', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
