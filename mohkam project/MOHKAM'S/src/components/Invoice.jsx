import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios'; // Ensure axios is imported
import Toast from '../hooks/useShowToast'; // Ensure the path is correct

const Invoice = () => {
    const location = useLocation();
    const { InvoiceNum, DOI, clientName, clientPhone, clientId, clientAddress, products } = location.state || {};
    const invoiceRef = useRef(null);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [error, setError] = useState('');
    const [isInvoiceConfirmed, setIsInvoiceConfirmed] = useState(false);

    useEffect(() => {
        const checkInvoice = async () => {
            try {
                const response = await axios.get(`/api/balance/invoiceByNum/${InvoiceNum}`);
                if (response.data) {
                    setIsInvoiceConfirmed(true);
                }
            } catch (error) {
                console.log('Invoice does not exist:', error.response?.data?.error || error.message);
            }
        };

        checkInvoice();
    }, [InvoiceNum]);

    const calculateDueDate = (createdAt) => {
        const dueDate = new Date(createdAt);
        dueDate.setDate(dueDate.getDate() + 15); // Add 15 days
        return dueDate.toLocaleDateString(); // Format to locale date string
    };

    const totalAmount = products.reduce((sum, product) => sum + product.productQuantity * product.salePrice, 0);
    const formattedDOI = new Date(DOI).toLocaleDateString();
    const dueDate = calculateDueDate(DOI);

    const fetchImageBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    const confirmDebit = async () => {
        setLoadingConfirm(true);
        const payload = {
            invoiceNum: InvoiceNum,
            clientId: clientId,
            clientName: clientName,
            products: products.map(product => ({
                productId: product.productId,
                productName: product.productName,
                productQuantity: product.productQuantity,
                productPictures:product.productPictures,
                salePrice: product.salePrice
            })),
            totalAmount: totalAmount,
            dueDate:dueDate,
            DOI:formattedDOI,
            
        };
        console.log('Payload:', payload); // Log the payload for debugging
        try {
            await axios.post('/api/balance/saveAndDebit', {
                invoiceNum: InvoiceNum,
                clientId: location.state.clientId,
                clientName: clientName,
                products: products.map(product => ({
                    productId: product.productId, // Ensure this field is correctly mapped
                    productName: product.productName,
                    productQuantity: product.productQuantity,
                    productPictures:product.productPictures,
                    salePrice: product.salePrice
                })),
                totalAmount: totalAmount,
                dueDate:dueDate,
                DOI:formattedDOI,
                
            });
            setLoadingConfirm(false);
            setIsInvoiceConfirmed(true);
            setToastMessage('Invoice confirmed and debit added to client ledger');
            setShowToast(true);
        } catch (error) {
            setLoadingConfirm(false);
            console.error('Error submitting product:', error.response?.data?.error || error.message);
            setError(error.response?.data?.error || 'Internal Server Error');
        }
    };

    const downloadInvoice = async () => {
        setLoadingDownload(true);
        const pdf = new jsPDF();
        const images = await Promise.all(products.map(product => fetchImageBase64(product.productPictures)));

        html2canvas(invoiceRef.current).then((canvas) => {
            const imgHeight = (canvas.height * 208) / canvas.width;
            const imgDataCanvas = canvas.toDataURL('image/png');
            pdf.addImage(imgDataCanvas, 'PNG', 0, 0, 208, imgHeight);

            // Adjusting the product picture in the PDF to match the img tag
            products.forEach((product, index) => {
                const imgX = 51; // X-coordinate (adjust as needed)
                const imgY = 104.5 + index * 14; // Y-coordinate (adjust as needed)
                const imgWidth = 10; // Width (adjust to match class "h-16 w-16")
                const productImgHeight = 10; // Height (adjust to match class "h-16 w-16")
                pdf.addImage(images[index], 'PNG', imgX, imgY, imgWidth, productImgHeight); // Use same size as img
            });

            pdf.save(`invoice_${InvoiceNum}.pdf`);
            setLoadingDownload(false);
            setToastMessage('Invoice downloaded successfully');
            setShowToast(true);
        });
    };

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
                <button
                    className={`px-4 py-2 rounded flex items-center ${isInvoiceConfirmed ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-green-500 text-white'}`}
                    onClick={confirmDebit}
                    disabled={loadingConfirm || isInvoiceConfirmed}
                >
                    {loadingConfirm && (
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
                    {loadingConfirm ? "Processing..." : isInvoiceConfirmed ? "Confirmed!" : "Confirm Invoice"}
                </button>
            </div>

            <section ref={invoiceRef}>
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
                                            <p>{clientName}</p>
                                            <p>{clientAddress}</p>
                                            <p>{clientPhone}</p>
                                        </div>
                                        <div className="text-sm font-light text-slate-500">
                                            <p className="text-sm font-normal text-slate-700">Invoice Number</p>
                                            <p>000{InvoiceNum}</p>
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
                                            {products.map((product, index) => (
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
                                                    {products.reduce((sum, product) => sum + product.productQuantity * product.salePrice, 0)} Rs
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
                                                    {products.reduce((sum, product) => sum + product.productQuantity * product.salePrice, 0)} Rs
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="mt-48 p-9">
                                    <div className="border-t pt-9 border-slate-200">
                                        <div className="text-sm font-light text-slate-700">
                                            <p>
                                                Payment terms are 14 days from the invoice date. According to the Late Payment of Mohkam Act 0000, late payment may incur a fee. A new invoice will include this fee if payment isn't received within an additional 14 days. Please ensure timely payment to avoid additional charges.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {showToast && <Toast message={toastMessage} />}
        </>
    );
};

export default Invoice;
