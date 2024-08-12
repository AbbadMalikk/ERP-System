import React, { useState } from 'react';
import axios from 'axios';
import { Link, } from 'react-router-dom';
import Toast from '../hooks/useShowToast';

const NewClientPop = ({ onClose }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/clients/add-client', {
                name,
                phoneNumber,
                address,
            });

            console.log('Client added:', response.data.client);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                onClose(); // Close the popup after submission
            }, 2000);
        } catch (error) {
            console.error('Error submitting client:', error.response?.data?.error || error.message);
            setError(error.response?.data?.error || 'Internal Server Error');
        }
    };

    return (
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
                <h2 className="text-xl font-bold mb-4">{`Add Client`}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900">
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-900">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-700 text-white rounded-lg px-4 py-2.5 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Submit
                        </button>
                        <Link
                            to="/getClient"
                            className="bg-blue-700 text-white rounded-lg px-4 py-2.5 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Show Clients
                        </Link>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
                {showToast && <Toast message={`Client submitted successfully!`} />}
               
            </div>
        </div>
    );
};

export default NewClientPop;
