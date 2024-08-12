import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Toast from '../hooks/useShowToast'; // Ensure the path is correct

export function AddClient() {
    const location = useLocation();
    const clientToEdit = location.state?.client || {};
    const [name, setName] = useState(clientToEdit.name || '');
    const [phoneNumber, setPhoneNumber] = useState(clientToEdit.phoneNumber || '');
    const [address, setAddress] = useState(clientToEdit.address || '');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const isEditing = !!clientToEdit._id;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEditing ? `/api/clients/update-client/${clientToEdit._id}` : '/api/clients/add-client';
            const method = isEditing ? 'put' : 'post';

            const response = await axios[method](url, {
                name,
                phoneNumber,
                address,
            });

            console.log(isEditing ? 'Client updated:' : 'Client added:', response.data.client);
            setShowToast(true); // Show toast on successful submission
            setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
        } catch (error) {
            console.error('Error submitting client:', error.response?.data?.error || error.message);
            setError(error.response?.data?.error || 'Internal Server Error');
        }
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">{isEditing ? 'Edit Client' : 'Add Client'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            {isEditing ? 'Update' : 'Submit'}
                        </button>
                        <Link to="/getClient" className="w-full sm:w-auto">
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                                Show Clients
                            </button>
                        </Link>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
                
                {showToast && <Toast message={isEditing ? 'Client updated successfully!' : 'Client added successfully!'} />}
            </div>
        </div>
    );
}
