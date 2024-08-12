import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/orders/ordersid');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to fetch orders');
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/orders/delete-order/${id}`);
            setOrders(orders.filter(order => order._id !== id));
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Failed to delete order');
        }
    };

    const handleEdit = (order) => {
        navigate('/addOrder', { state: { order } });
    };

    const handleInvoice = (order) => {
        const productDetails = order.products.map(product => ({
            productId: product.productID,
            productName: product.product_name,
            SKU: product.productID.Product_SKU,
            productQuantity: product.ProductReq,
            salePrice: product.salePrice,
            productPictures: product.productPictures
        }));

        navigate('/invoice', {
            state: {
                InvoiceNum: order.OrderID,
                DOI: order.createdAt,
                clientId: order.clientID._id,
                clientName: order.clientID.name,
                clientPhone: order.clientID.phoneNumber,
                clientAddress: order.clientID.address,
                products: productDetails
            }
        });
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">Order List</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="overflow-x-auto h-screen shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Product Pictures</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.OrderID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.clientID.name}</td>
                                    <td className="px-6 py-4  text-sm text-gray-900">
                                        {order.products.map(product => product.product_name).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex flex-wrap">
                                            {order.products.map(product => (
                                                <img
                                                    key={product.productID}
                                                    src={product.productPictures}
                                                    alt="Product"
                                                    className="h-16 w-16 object-cover rounded-md m-1"
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(order)}
                                            className="text-blue-500 hover:text-blue-700 mx-2"
                                        >
                                            <RiEdit2Line className="inline-block text-xl" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="text-red-500 hover:text-red-700 mx-2"
                                        >
                                            <RiDeleteBinLine className="inline-block text-xl" />
                                        </button>
                                        <button
                                            onClick={() => handleInvoice(order)}
                                            className="text-green-500 hover:text-white hover:bg-green-500 rounded px-3 py-1"
                                        >
                                            Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
