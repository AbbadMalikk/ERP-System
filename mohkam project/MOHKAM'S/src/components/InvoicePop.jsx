import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Invoice = () => {
    const location = useLocation();
    const { InvoiceNum, DOI, clientName, clientPhone, SKU, clientAddress, productName, productQuantity, salePrice, productPictures } = location.state || {};
    const invoiceRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const calculateDueDate = (createdAt) => {
        const dueDate = new Date(createdAt);
        dueDate.setDate(dueDate.getDate() + 15); // Add 15 days
        return dueDate.toLocaleDateString(); // Format to locale date string
    };

    const formattedDOI = new Date(DOI).toLocaleDateString();
    const dueDate = calculateDueDate(DOI);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const downloadInvoice = async () => {
        setLoading(true); // Set loading to true
        const pdf = new jsPDF();

        // Convert the image to Base64
        const imgResponse = await fetch(productPictures);
        const imgBlob = await imgResponse.blob();
        const imgData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imgBlob);
        });

        html2canvas(invoiceRef.current).then((canvas) => {
            const imgHeight = (canvas.height * 208) / canvas.width; // Height for the full invoice
            const imgDataCanvas = canvas.toDataURL('image/png');
            pdf.addImage(imgDataCanvas, 'PNG', 0, 0, 208, imgHeight);

            // Adjusting the product picture in the PDF to match the img tag
            const imgX = 51; // X-coordinate (adjust as needed)
            const imgY = 104.5; // Y-coordinate (adjust as needed)
            const imgWidth = 10; // Width (adjust to match class "h-16 w-16")
            const productImgHeight = 10; // Height (adjust to match class "h-16 w-16")
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, productImgHeight); // Use same size as img

            pdf.save(`invoice_${InvoiceNum}.pdf`);
            setLoading(false);
        });
    };



    return (
        <>
         <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 shadow-md w-full max-w-md">
                <button
                    onClick={onClose}
                    className="relative top-2 left-96 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            <button className="relative top-4 left-9 bg-blue-500 text-white px-4 py-2 rounded flex items-center" onClick={downloadInvoice} disabled={loading}>
                {loading && (
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
                {loading ? "Downloading..." : "Download PDF"}
            </button>
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
                                        onLoad={handleImageLoad}
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
                                            <tr className="border-b border-slate-200">
                                                <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                                                    <div className="font-medium text-slate-700">{productName}</div>
                                                    <div className="mt-0.5 text-slate-500 sm:hidden">
                                                        {productQuantity} unit(s) at {salePrice} Rs
                                                    </div>
                                                </td>
                                                <td>
                                                    <img className="h-16 w-16 object-cover" src={productPictures} alt="" onLoad={handleImageLoad} />
                                                </td>
                                                <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                    {productQuantity}
                                                </td>
                                                <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                                                    {salePrice} Rs
                                                </td>
                                                <td className="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                                                    {productQuantity * salePrice} Rs
                                                </td>
                                            </tr>
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
                                                    {productQuantity * salePrice} Rs
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
                                                    {productQuantity * salePrice} Rs
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="mt-48 p-9">
                                    <div className="border-t pt-9 border-slate-200">
                                        <div className="text-sm font-light text-slate-700">
                                            <p>
                                                Payment terms are 14 days from the invoice date. According to the Late Payment of Mohkam Act 0000, late payment may incur a fee. A new invoice will include this fee if payment isn't received within an additional 14 days.

                                                Please ensure timely payment to avoid additional charges.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
            </div>
            </div>
        </>
    );
};

export default Invoice;
