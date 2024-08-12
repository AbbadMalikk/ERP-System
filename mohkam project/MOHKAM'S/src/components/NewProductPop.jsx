import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Toast from '../hooks/useShowToast'; // Ensure the path is correct

const NewProductPop = ({ onClose }) => {
    const location = useLocation();
    const productToEdit = location.state?.product || {};
    const [Product_SKU, setProduct_SKU] = useState(productToEdit.Product_SKU || '');
    const [product_name, setProductName] = useState(productToEdit.product_name || '');
    const [product_price, setProductPrice] = useState(productToEdit.product_price || '');
    const [product_quantity, setProductQuantity] = useState(productToEdit.product_quantity || '');
    const [product_pictures, setProductPictures] = useState(productToEdit.product_pictures || '');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const isEditing = !!productToEdit._id;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductPictures(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEditing ? `/api/products/update-product/${productToEdit._id}` : '/api/products/add-product';
            const method = isEditing ? 'put' : 'post';

            const response = await axios[method](url, {
                Product_SKU,
                product_name,
                product_price,
                product_quantity,
                product_pictures,
            });

            console.log(isEditing ? 'Product updated:' : 'Product added:', response.data.product);
            setShowToast(true); // Show toast on successful submission
            setTimeout(() => {
                setShowToast(false);
                onClose(); // Close the popup
            }, 2000); // Hide toast after 5 seconds
        } catch (error) {
            console.error('Error submitting product:', error.response?.data?.error || error.message);
            setError(error.response?.data?.error || 'Internal Server Error');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
            <div className="bg-white rounded-md p-8 max-w-md w-full mx-auto">
                <div className="flex justify-end">
                    <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <h2 className="text-xl font-bold mb-5">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="Product_SKU" className="block mb-2 text-sm font-medium text-gray-900">Product SKU</label>
                        <input
                            type="text"
                            id="Product_SKU"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Product SKU"
                            value={Product_SKU}
                            onChange={(e) => setProduct_SKU(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="product_name" className="block mb-2 text-sm font-medium text-gray-900">Product Name</label>
                        <input
                            type="text"
                            id="product_name"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Product Name"
                            value={product_name}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="product_price" className="block mb-2 text-sm font-medium text-gray-900">Product Price - Rs</label>
                        <input
                            type="number"
                            id="product_price"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Product Price"
                            value={product_price}
                            onChange={(e) => setProductPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="product_quantity" className="block mb-2 text-sm font-medium text-gray-900">Product Quantity</label>
                        <input
                            type="number"
                            id="product_quantity"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Product Quantity"
                            value={product_quantity}
                            onChange={(e) => setProductQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="product_pictures" className="block mb-2 text-sm font-medium text-gray-900">Product Pictures</label>
                        <input
                            type="file"
                            id="product_pictures"
                            accept="image/*"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={handleImageChange}
                            required={!isEditing}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                        >
                            {isEditing ? 'Update' : 'Submit'}
                        </button>
                        <button
                            type="button"
                            className="text-gray-600 hover:text-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {showToast && <Toast message={isEditing ? 'Product updated' : 'Product added'} />}
            </div>
        </div>
    );
};

export default NewProductPop;
