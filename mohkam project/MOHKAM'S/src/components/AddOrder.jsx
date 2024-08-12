import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Toast from '../hooks/useShowToast'; // Ensure the path is correct
import NewClientPop from './NewClientPop.jsx'; // Import AddClient component
import NewProductPop from './NewProductPop.jsx'; // Import AddProduct component

const AddOrder = () => {
    const location = useLocation();
    const orderToEdit = location.state?.order || {};
    const [orderID, setOrderID] = useState(orderToEdit.orderID || 0);
    const [clients, setClients] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState(orderToEdit.clientID || '');
    const [selectedProducts, setSelectedProducts] = useState(orderToEdit.products || []);
    const [currentProduct, setCurrentProduct] = useState('');
    const [productActualPrice, setProductActualPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [productPictures, setProductPictures] = useState('');
    const [productReq, setProductReq] = useState(0);
    const [availableQuantity, setAvailableQuantity] = useState(0); // Track available product quantity
    const [showAddClient, setShowAddClient] = useState(false); // State to control AddClient popup
    const [showAddProduct, setShowAddProduct] = useState(false); // State to control AddProduct popup
    const [editingProductIndex, setEditingProductIndex] = useState(null); // Track the product being edited
    const isEditing = !!orderToEdit._id;

    useEffect(() => {
        const fetchOrderID = async () => {
            try {
                const response = await axios.get('/api/orders/ordersid');
                setOrderID(response.data.length + 1);
            } catch (error) {
                console.error('Error fetching order ID:', error.message);
            }
        };

        const fetchClients = async () => {
            try {
                const response = await axios.get('/api/clients/getclients');
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error.message);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products/getproducts');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        const initializeData = async () => {
            if (!isEditing) {
                await fetchOrderID();
            }
            await fetchClients();
            await fetchProducts();

            if (isEditing) {
                if (orderToEdit.OrderID) {
                    setOrderID(orderToEdit.OrderID)
                }
                if (orderToEdit.clientID) {
                    setSelectedClient(orderToEdit.clientID);
                }
                if (orderToEdit.products) {
                    setSelectedProducts(orderToEdit.products);
                }
            }
        };

        initializeData();
    }, [isEditing, orderToEdit.OrderID, orderToEdit.clientID, orderToEdit.products]);

    const handleProductChange = (e) => {
        const product = products.find((product) => product._id === e.target.value);
        setCurrentProduct(e.target.value);
        if (product) {
            setProductActualPrice(product.product_price);
            setProductPictures(product.product_pictures);
            setAvailableQuantity(product.product_quantity); // Update available quantity on product change
        }
    };

    const handleAddProduct = () => {
        const newProduct = {
            productID: currentProduct,
            product_name: products.find(p => p._id === currentProduct)?.product_name,
            productActualPrice,
            salePrice,
            productPictures,
            ProductReq: productReq,
        };

        const updatedProducts = editingProductIndex !== null
            ? selectedProducts.map((prod, index) => index === editingProductIndex ? newProduct : prod)
            : [...selectedProducts, newProduct];

        setSelectedProducts(updatedProducts);

        // Reset fields for the next product
        setCurrentProduct('');
        setProductActualPrice(0);
        setSalePrice(0);
        setProductPictures('');
        setProductReq(0);
        setAvailableQuantity(0);
        setEditingProductIndex(null);
    };

    const handleEditProduct = (index) => {
        const product = selectedProducts[index];
        setCurrentProduct(product.productID);
        setProductActualPrice(product.productActualPrice);
        setSalePrice(product.salePrice);
        setProductPictures(product.productPictures);
        setProductReq(product.ProductReq);
        setAvailableQuantity(products.find(p => p._id === product.productID)?.product_quantity || 0);
        setEditingProductIndex(index);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newOrder = {
            OrderID: isEditing ? orderToEdit.OrderID : orderID,
            clientID: selectedClient,
            products: selectedProducts,
        };

        try {
            const url = isEditing ? `/api/orders/update-order/${orderToEdit._id}` : '/api/orders/add-order';
            const method = isEditing ? 'put' : 'post';

            console.log('New Order:', newOrder);

            const response = await axios[method](url, newOrder);

            // Check response status and handle success or error
            if (response.status === 200 || response.status === 201) {
                setShowToast(true); // Show toast on successful submission
                setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
            } else {
                throw new Error(`Failed to ${isEditing ? 'update' : 'add'} order. Server responded with status ${response.status}`);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} order:`, error.message);
            setError(`Failed to ${isEditing ? 'update' : 'add'} order. Please try again.`);
        }
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">{isEditing ? 'Edit Order' : 'Add Order'}</h2>
                {showAddClient && <NewClientPop onClose={() => setShowAddClient(false)} />}
                {showAddProduct && <NewProductPop onClose={() => setShowAddProduct(false)} />}

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Order ID: {orderID}</label>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Select Client:</label>
                        <div className="flex">
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                <option value="">Select a client</option>
                                {clients.map((client) => (
                                    <option key={client._id} value={client._id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                                onClick={() => setShowAddClient(true)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Select Product:</label>
                        <div className="flex">
                            <select
                                value={currentProduct}
                                onChange={handleProductChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                <option value="">Select a product</option>
                                {products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.product_name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                                onClick={() => setShowAddProduct(true)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-xs font-light text-gray-700">Quantity Available: {availableQuantity}</label>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Actual Price:</label>
                        <input
                            type="number"
                            value={productActualPrice}
                            onChange={(e) => setProductActualPrice(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            disabled
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Sale Price:</label>
                        <input
                            type="number"
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Product Quantity:</label>
                        <input
                            type="number"
                            value={productReq}
                            onChange={(e) => setProductReq(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Product Pictures URL:</label>
                        <input
                            type="text"
                            value={productPictures}
                            onChange={(e) => setProductPictures(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            disabled
                        />
                        
                    </div>
                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5"
                    >
                        {editingProductIndex !== null ? 'Update Product' : 'Add Product'}
                    </button>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Selected Products:</label>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {selectedProducts.map((product, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={product.productPictures} alt={product.product_name} className="w-16 h-16 object-cover" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.product_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.salePrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.ProductReq}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                type="button"
                                                onClick={() => handleEditProduct(index)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedProducts(selectedProducts.filter((_, i) => i !== index))}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        {isEditing ? 'Update Order' : 'Add Order'}
                    </button>
                </form>
                {showToast && <Toast message="Order submitted successfully!" />}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default AddOrder;
