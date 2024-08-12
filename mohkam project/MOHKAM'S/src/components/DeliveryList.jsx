import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeliveryList = () => {
    const [deliveryConfirmed, setDeliveryConfirmed] = useState([]);
    const [invoicesNotDelivered, setInvoicesNotDelivered] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveryData = async () => {
            try {
                const deliveriesResponse = await axios.get('/api/delivery/deliveries');
                setDeliveryConfirmed(deliveriesResponse.data);

                const invoicesResponse = await axios.get('/api/delivery/invoices/not-delivered');
                setInvoicesNotDelivered(invoicesResponse.data);
            } catch (error) {
                setError('Failed to fetch data');
            }
        };

        fetchDeliveryData();
    }, []);

    const handleSelectInvoice = (invoice) => {
        navigate('/delivery', { state: { invoice } });
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">Delivery List</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="flex flex-col mt-4 mb-2">
                    {/* Confirmed Deliveries Table */}
                    <h3 className="text-xl font-bold mb-2">Confirmed Deliveries</h3>
                    <div className="overflow-x-auto h-80 shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Invoice Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Client Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Products</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Phone Number</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {deliveryConfirmed.map((delivery) => (
                                    <tr key={delivery.invoiceNum} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.invoiceNum}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.clientName}</td>
                                        <td className="px-6 py-4  text-sm text-gray-900">
                                            {delivery.products.map((product) => (
                                                <div key={product.productId}>
                                                    {product.productName} - {product.status} {product.status === 'Unavailable' && `(${product.reason})`}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.phoneNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-200 border-gray-200 mt-6 mb-6 h-0.5"></div>

                    {/* Invoices to be Delivered Table */}
                    <h3 className="text-xl font-bold mb-2">Orders to be Delivered</h3>
                    <div className="overflow-x-auto h-80 shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Invoice Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Client Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoicesNotDelivered.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.invoiceNum}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.clientName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {invoice.totalAmount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button onClick={() => handleSelectInvoice(invoice)} className="text-blue-500 hover:text-white hover:bg-blue-500 p-1 rounded">
                                                Select
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryList;
