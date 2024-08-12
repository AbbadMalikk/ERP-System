import express from 'express';
import Product from '../models/productModel.js';
import cloudinary from 'cloudinary';

const router = express.Router();

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to handle adding a new product
router.post('/add-product', async (req, res) => {
    try {
        const { Product_SKU, product_name, product_price, product_quantity } = req.body;
        let { product_pictures } = req.body;

        console.log('Received data:', req.body);

        if (!Product_SKU || !product_name || !product_price || !product_quantity || !product_pictures) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const uploadedResponse = await cloudinary.uploader.upload(product_pictures);
        console.log('Cloudinary upload response:', uploadedResponse);
        product_pictures = uploadedResponse.secure_url;


        const newProduct = new Product({
            Product_SKU,
            product_name,
            product_price,
            product_quantity,
            product_pictures,
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/recent', async (req, res) => {
    try {
        const recentProducts = await Product.find().sort({ _id: -1 }).limit(4);
        res.status(200).json(recentProducts);
    } catch (error) {
        console.error('Error fetching recent products:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all products
router.get('/getproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to handle updating a product
router.put('/update-product/:id', async (req, res) => {
    try {
        const { Product_SKU, product_name, product_price, product_quantity } = req.body;
        let { product_pictures } = req.body;

        const currentProduct = await Product.findById(req.params.id);

        if (!currentProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product_pictures && product_pictures.startsWith('data:')) {
            if (currentProduct.product_pictures) {
                const publicId = currentProduct.product_pictures.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadedResponse = await cloudinary.uploader.upload(product_pictures);
            product_pictures = uploadedResponse.secure_url;
        } else {
            product_pictures = currentProduct.product_pictures;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { Product_SKU, product_name, product_price, product_quantity, product_pictures },
            { new: true }
        );

        res.status(200).json({ message: 'Product updated successfully!', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle deleting a product
router.delete('/delete-product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.product_pictures) {
            const publicId = product.product_pictures.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;