import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ClientLedger = () => {
    const { clientId } = useParams();
    const [ledger, setLedger] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLedgerAndInvoices = async () => {
            try {
                const ledgerResponse = await axios.get(`/api/balance/ledger/${clientId}`);
                setLedger(ledgerResponse.data);

                const invoicesResponse = await axios.get(`/api/balance/invoices/${clientId}`);
                setInvoices(invoicesResponse.data);

                const paymentsResponse = await axios.get(`/api/balance/payments/${clientId}`);
                setPayments(paymentsResponse.data);
            } catch (error) {
                console.error('Error fetching ledger, invoices, and payments:', error);
                setError('Failed to fetch ledger, invoices, and payments');
            }
        };

        fetchLedgerAndInvoices();
    }, [clientId]);

    if (!ledger) {
        return <p>Loading...</p>;
    }

    const totalDebit = ledger.transactions.reduce((total, transaction) => total + transaction.debit, 0);
    const totalCredit = ledger.transactions.reduce((total, transaction) => total + transaction.credit, 0);
    const balance = totalDebit - totalCredit;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">Client Ledger</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-6">
                    <h3 className="text-xl text-blue-800 font-semibold">Client Details:</h3>
                    <p>Name: {ledger.clientName}</p>
                    <p>Id: {ledger.clientId}</p>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl text-blue-800 font-semibold">Ledger Summary</h3>
                    <div className="overflow-x-auto h-48 shadow-lg">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Debit</th>
                                    <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Credit</th>
                                    <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Balance</th>
                                    <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Type</th>
                                    <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Invoice</th>
                                    <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledger.transactions.length > 0 ? (
                                    ledger.transactions.map((transaction, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 text-center border-b">{transaction.debit}</td>
                                            <td className="py-2 px-4 text-center border-b">{transaction.credit}</td>
                                            <td className="py-2 px-4 text-center border-b">{transaction.balance}</td>
                                            <td className="py-2 px-4 text-center border-b">{transaction.type}</td>
                                            <td className="py-2 px-4 text-center border-b">{transaction.invoiceNum}</td>
                                            <td className="py-2 px-4 text-center border-b">{new Date(transaction.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-2 px-4 text-center border-b" colSpan="6">No Transactions Found</td>
                                    </tr>
                                )}
                               
                            </tbody>
                        </table>
                    </div>
                    <tr>
                                    <td className="py-2 px-11 text-center font-bold border-b">{totalDebit}</td>
                                    <td className="py-2 px-11 text-center font-bold border-b">{totalCredit}</td>
                                    <td className="py-2 px-12 text-center font-bold border-b">{balance}</td>
                                    <td className="py-2 px-8 text-center font-bold border-b">Total</td>
                   </tr>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-6 md:mb-0">
                        <div className="shadow-2xl">
                            <h3 className="text-xl text-blue-800 font-semibold">Client Invoices</h3>
                            <div className="overflow-x-auto h-48">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-3 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Invoice Number</th>
                                            <th className="py-2 px-3 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Total Amount</th>
                                            <th className="py-2 px-3 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Date of Issue</th>
                                            <th className="py-2 px-3 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Due Date</th>
                                            <th className="py-2 px-3 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.length > 0 ? (
                                            invoices.map((invoice, index) => (
                                                <tr key={index}>
                                                    <td className="py-2 px-3 text-center border-b">{invoice.invoiceNum}</td>
                                                    <td className="py-2 px-3 text-center border-b">{invoice.totalAmount}</td>
                                                    <td className="py-2 px-3 text-center border-b">{new Date(invoice.DOI).toLocaleDateString()}</td>
                                                    <td className="py-2 px-3 text-center border-b">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                                    <td className="py-2 px-3 text-center border-b">{invoice.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="py-2 px-3 text-center border-b" colSpan="5">No Invoices Found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 pl-0 md:pl-2">
                        <div className="shadow-2xl">
                            <h3 className="text-xl text-blue-800 font-semibold">Client Payments</h3>
                            <div className="overflow-x-auto h-48">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Invoice Num</th>
                                            <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Amount</th>
                                            <th className="py-2 px-4 text-xs font-medium text-blue-800 uppercase tracking-wider border-b">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.length > 0 ? (
                                            payments.map((payment, index) => (
                                                <tr key={index}>
                                                    <td className="py-2 px-4 text-center border-b">{payment.invoiceNum}</td>
                                                    <td className="py-2 px-4 text-center border-b">{payment.amountPaid}</td>
                                                    <td className="py-2 px-4 text-center border-b">{new Date(payment.paymentMadeOn).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="py-2 px-4 text-center border-b" colSpan="3">No Payments Found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientLedger;
