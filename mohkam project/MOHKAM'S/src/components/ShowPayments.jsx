import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowPayments = () => {
    const [clients, setClients] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

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

    const handleClientChange = async (e) => {
        setSelectedClient(e.target.value);
        try {
            const res = await axios.get(`/api/balance/payments/${e.target.value}`);
            setPayments(res.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">Show Payments</h2>

                <div className="mb-6 flex justify-center">
                    <div className="w-full max-w-md">
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
                </div>

                {payments.length > 0 && (
                    <div className="overflow-x-auto h-screen shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Invoice Num</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Amount Paid</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Payment Made On</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map(payment => (
                                    <tr key={payment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.invoiceNum}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {payment.amountPaid}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payment.paymentMadeOn).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowPayments;
