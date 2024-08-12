import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toast from '../hooks/useShowToast'; // Ensure the path is correct

const AddPayment = () => {
    const [clients, setClients] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [amountPaid, setAmountPaid] = useState(0);
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await axios.get('/api/clients/getclients');
                setClients(res.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        if (selectedClient) {
            const fetchInvoices = async () => {
                try {
                    const res = await axios.get(`/api/balance/invoices/${selectedClient}`);
                    setInvoices(res.data);
                } catch (error) {
                    console.error('Error fetching invoices:', error);
                }
            };
            fetchInvoices();
        }
    }, [selectedClient]);

    const handleClientChange = (e) => {
        setSelectedClient(e.target.value);
        setSelectedInvoice(null);
    };

    const handleInvoiceChange = (e) => {
        const invoice = invoices.find(inv => inv._id === e.target.value);
        setSelectedInvoice(invoice);
    };

    const handleAmountPaidChange = (e) => {
        setAmountPaid(e.target.value);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!selectedInvoice) {
            setError('Please select an invoice.');
            return;
        }
        if (amountPaid <= 0) {
            setError('Amount paid must be greater than zero.');
            return;
        }

        try {
            const res = await axios.put(`/api/balance/add-payment/${selectedInvoice._id}`, {
                amountPaid: parseFloat(amountPaid),
            });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        } catch (error) {
            console.error('Error adding payment:', error.message);
            setError('Failed to add payment');
        }
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">Add Payment</h2>

                <form className="space-y-6" onSubmit={handlePayment}>
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="flex-1">
                            <label htmlFor="client" className="block mb-2 text-sm font-medium text-gray-700">Select Client</label>
                            <select
                                id="client"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={handleClientChange}
                                value={selectedClient || ''}
                                required
                            >
                                <option value="">Select a client</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="invoice" className="block mb-2 text-sm font-medium text-gray-700">Select Invoice</label>
                            <select
                                id="invoice"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={handleInvoiceChange}
                                value={selectedInvoice?._id || ''}
                                required
                            >
                                <option value="">Select an invoice</option>
                                {invoices.map(invoice => (
                                    <option key={invoice._id} value={invoice._id}>
                                        {invoice.invoiceNum}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedInvoice && (
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <div className="mb-4">
                                <h3 className="text-gray-900">Invoice Total Amount: Rs {selectedInvoice.totalAmount}</h3>
                                <h3 className="text-gray-900">Remaining Balance: Rs {selectedInvoice.remainingBalance}</h3>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="amountPaid" className="block mb-2 text-sm font-medium text-gray-700">Amount Paid</label>
                                <input
                                    type="number"
                                    id="amountPaid"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    value={amountPaid}
                                    onChange={handleAmountPaidChange}
                                    min="0"
                                    max={selectedInvoice.remainingBalance}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
                        >
                            Confirm Payment
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/showpayment')}
                            className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
                        >
                            Show Payments
                        </button>
                    </div>
                    
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
                {showToast && <Toast message="Payment submitted" />}
            </div>
        </div>
    );
};

export default AddPayment;
