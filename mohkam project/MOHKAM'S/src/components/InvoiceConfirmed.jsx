// InvoiceConfirmed.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Toast from '../hooks/useShowToast';

const InvoiceConfirmed = () => {
    const { invoiceId } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loadingDownload, setLoadingDownload] = useState(false);
    const invoiceRef = useRef(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const invoiceResponse = await axios.get(`/api/balance/invoice/${invoiceId}`);
                const invoiceData = invoiceResponse.data;
                setInvoice(invoiceData);

                const clientResponse = await axios.get(`/api/clients/getclientbyID/${invoiceData.clientId}`);
                setClient(clientResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch invoice or client data.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [invoiceId]);

    const calculateDueDate = (createdAt) => {
        const dueDate = new Date(createdAt);
        dueDate.setDate(dueDate.getDate() + 15);
        return dueDate.toLocaleDateString();
    };

    const fetchImageBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    const downloadInvoice = async () => {
        setLoadingDownload(true);
        const pdf = new jsPDF();
        const images = await Promise.all(invoice.products.map(product => fetchImageBase64(product.productPictures)));

        html2canvas(invoiceRef.current).then((canvas) => {
            const imgHeight = (canvas.height * 208) / canvas.width;
            const imgDataCanvas = canvas.toDataURL('image/png');
            pdf.addImage(imgDataCanvas, 'PNG', 0, 0, 208, imgHeight);

            invoice.products.forEach((product, index) => {
                const imgX = 51; 
                const imgY = 104.5 + index * 14; 
                const imgWidth = 10; 
                const productImgHeight = 10;
                pdf.addImage(images[index], 'PNG', imgX, imgY, imgWidth, productImgHeight);
            });

            pdf.save(`invoice_${invoice.invoiceNum}.pdf`);
            setLoadingDownload(false);
            setToastMessage('Invoice downloaded successfully');
            setShowToast(true);
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!invoice || !client) {
        return <p>No invoice or client data found.</p>;
    }

    const formattedDOI = new Date(invoice.DOI).toLocaleDateString();
    const dueDate = calculateDueDate(invoice.DOI);

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-around items-center py-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mb-4 sm:mb-0 sm:mr-4"
                    onClick={downloadInvoice}
                    disabled={loadingDownload}
                >
                    {loadingDownload && (
                        <svg
                            className="animate-spin h-5 w-5 mr-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {loadingDownload ? "Downloading..." : "Download PDF"}
                </button>
            </div>

            <section  ref={invoiceRef}>
                <div className="max-w-5xl mx-auto py-4 bg-white">
                    <article className="overflow-hidden">
                        <div className="bg-white rounded-b-md">
                            <div className="p-9">
                                <div className="space-y-6 text-slate-700">
                                    <img
                                        className="object-cover w-1/3 h-20"
                                        src="../mohkambg.png"
                                        alt="Logo"
                                    />
                                    <p className="text-xl font-extrabold tracking-tight uppercase font-body">
                                        Mohkam's | Designers & Furnishers
                                    </p>
                                </div>
                            </div>
                            <div className="p-9">
                                <div className="flex w-full">
                                    <div className="grid grid-cols-4 gap-12">
                                        <div className="text-sm font-light text-slate-500">
                                            <p className="text-sm font-normal text-slate-700">Invoice Detail:</p>
                                            <p>Mohkam's</p>
                                            <p>699-H3</p>
                                            <p>Johar Town Lahore</p>
                                            <p>Pakistan</p>
                                        </div>
                                        <div className="text-sm font-light text-slate-500">
                                            <p className="text-sm font-normal text-slate-700">Billed To</p>
                                            <p>{client.name}</p>
                                            <p>{client.address}</p>
                                            <p>{client.phone}</p>
                                        </div>
                                        <div className="text-sm font-light text-slate-500">
                                            <p className="text-sm font-normal text-slate-700">Invoice Number</p>
                                            <p>000{invoice.invoiceNum}</p>
                                            <p className="mt-2 text-sm font-normal text-slate-700">Date of Issue</p>
                                            <p>{formattedDOI}</p>
                                        </div>
                                        <div className="text-sm font-light text-slate-500">
                                            <p className="text-sm font-normal text-slate-700">Due</p>
                                            <p>{dueDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-9">
                                <div className="flex flex-col mx-0 mt-8">
                                    <table className="min-w-full divide-y divide-slate-500">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                                                    Description
                                                </th>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                                                    Picture
                                                </th>
                                                <th scope="col" className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell">
                                                    Quantity
                                                </th>
                                                <th scope="col" className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell">
                                                    Rate
                                                </th>
                                                <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-normal text-slate-700 sm:pr-6 md:pr-0">
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoice.products.map((product, index) => (
                                                <tr key={index} className="border-b border-slate-200">
                                                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                                                        <div className="font-medium text-slate-700">{product.productName}</div>
                                                        <div className="mt-0.5 text-slate-500 sm:hidden">
                                                            {product.productQuantity} unit(s) at {product.salePrice} Rs
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <img className="h-16 w-16 object-cover" src={product.productPictures} alt="" />
                                                    </td>
                                                    <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                        {product.productQuantity}
                                                    </td>
                                                    <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                        {product.salePrice} Rs
                                                    </td>
                                                    <td className="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                                        {product.productQuantity * product.salePrice} Rs
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th scope="row" colSpan="4" className="hidden pt-6 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0">
                                                    Subtotal
                                                </th>
                                                <th scope="row" className="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden">
                                                    Subtotal
                                                </th>
                                                <td className="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                                    {invoice.products.reduce((sum, product) => sum + product.productQuantity * product.salePrice, 0)} Rs
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" colSpan="4" className="hidden pt-4 pl-6 pr-3 text-sm font-normal text-right text-slate-700 sm:table-cell md:pl-0">
                                                    Total
                                                </th>
                                                <th scope="row" className="pt-4 pl-4 pr-3 text-sm font-normal text-left text-slate-700 sm:hidden">
                                                    Total
                                                </th>
                                                <td className="pt-4 pl-3 pr-4 text-sm font-normal text-right text-slate-700 sm:pr-6 md:pr-0">
                                                    {invoice.products.reduce((sum, product) => sum + product.productQuantity * product.salePrice, 0)} Rs
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="mt-48 p-9">
                                    <div className="border-t pt-9 border-slate-200">
                                        <div className="text-sm font-light text-slate-700">
                                            <p>
                                                Payment terms are 15 days. Please be aware that according to the
                                                Late Payment of Unwrapped Debts Act 0000, freelancers are entitled
                                                to claim a 00.00 late fee upon non-payment of debts after this
                                                time, at which point a new invoice will be submitted with the
                                                addition of this fee. If payment of the revised invoice is not
                                                received within a further 7 days, additional interest will be
                                                charged to the overdue account and a statutory rate of 8% plus
                                                Bank of England base of 0.5%, totalling 8.5%. Parties cannot
                                                contract out of the Act’s provisions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {showToast && <Toast message={toastMessage} />}
        </>
    );
};

export default InvoiceConfirmed;
