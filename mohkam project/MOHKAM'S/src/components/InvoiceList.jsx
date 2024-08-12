import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('/api/balance/invoices');
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setError('Failed to fetch invoices');
            }
        };

        fetchInvoices();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/balance/invoice/${id}`);
            setInvoices(invoices.filter(invoice => invoice._id !== id));
        } catch (error) {
            console.error('Error deleting invoice:', error);
            setError('Failed to delete invoice');
        }
    };

    const handleInvoiceClick = (invoiceId) => {
        navigate(`/invoice-confirmed/${invoiceId}`);
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">Invoice List</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="overflow-x-auto h-screen shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Invoice Num</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Client Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Remaining Balance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoices.map((invoice) => (
                                <tr key={invoice._id} onClick={() => handleInvoiceClick(invoice._id)} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.invoiceNum}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.clientName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {invoice.products.map(product => product.productName).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.totalAmount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.remainingBalance}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents the click event from propagating to the row's onClick
                                                handleDelete(invoice._id);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <RiDeleteBinLine className="inline-block text-xl" />
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

export default InvoiceList;
