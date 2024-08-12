import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Toast from '../hooks/useShowToast'; // Ensure the path is correct

export function AddProduct() {
    const location = useLocation();
    const productToEdit = location.state?.product || {};
    const [Product_SKU, setProduct_SKU] = useState(productToEdit.Product_SKU || '');
    const [product_name, setProductName] = useState(productToEdit.product_name || '');
    const [product_price, setProductPrice] = useState(productToEdit.product_price || '');
    const [product_quantity, setProductQuantity] = useState(productToEdit.product_quantity || '');
    const [product_pictures, setProductPictures] = useState(productToEdit.product_pictures || '');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);
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
        setLoading(true); // Set loading state to true

        try {
            const url = isEditing ? `/api/products/update-product/${productToEdit._id}` : '/api/products/add-product';
            const method = isEditing ? 'put' : 'post';

            const response = await axios[method](url, JSON.stringify({
                Product_SKU,
                product_name,
                product_price,
                product_quantity,
                product_pictures,
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(isEditing ? 'Product updated:' : 'Product added:', response.data.product);
            setShowToast(true); // Show toast on successful submission
            setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
        } catch (error) {
            console.error('Error submitting product:', error.response?.data?.error || error.message);
            setError(error.response?.data?.error || 'Internal Server Error');
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg flex">
                <form className="w-2/3 max-w-md mx-auto" onSubmit={handleSubmit}>
                    <div className="font-bold py-4 text-center text-2xl mb-6">
                        <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="Product_SKU" className="block mb-2 text-sm font-medium text-gray-900">Product SKU</label>
                        <input
                            type="text"
                            id="Product_SKU"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={handleImageChange}
                            required={!isEditing}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mb-2 sm:mb-0 text-center"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <span>Loading...</span> // Spinner or text during loading
                            ) : (
                                isEditing ? 'Update' : 'Submit'
                            )}
                        </button>
                        <Link to="/getProduct">
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                                Show Products
                            </button>
                        </Link>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
                <div className="w-2/5 p-4">
                    {product_pictures && (
                        <img
                            src={product_pictures}
                            alt="Product Preview"
                            className="w-full h-full object-cover rounded-lg border border-gray-300"
                        />
                    )}
                </div>
            </div>
            {showToast && <Toast message={isEditing ? "updated" : "submitted"} />}
        </div>
    );
}
