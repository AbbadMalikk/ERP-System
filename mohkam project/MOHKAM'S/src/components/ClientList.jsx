import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [ledgerClientIds, setLedgerClientIds] = useState(new Set());
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const [clientsResponse, ledgersResponse] = await Promise.all([
                    axios.get('/api/clients/getclients'),
                    axios.get('/api/clients/getclientswithledger'),
                ]);

                setClients(clientsResponse.data);
                setLedgerClientIds(new Set(ledgersResponse.data.map(ledger => ledger.clientId)));
            } catch (error) {
                console.error('Error fetching clients:', error);
                setError('Failed to fetch clients');
            }
        };

        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/clients/delete-client/${id}`);
            setClients(clients.filter(client => client._id !== id));
        } catch (error) {
            console.error('Error deleting client:', error);
            setError('Failed to delete client');
        }
    };

    const handleEdit = (client) => {
        navigate('/addClient', { state: { client } });
    };

    const handleLedger = (clientId) => {
        navigate(`/clientLedger/${clientId}`);
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">Client List</h2>
                {error && <p className="text-red-500">{error}</p>}
                {clients.length === 0 ? (
                    <p className="text-center text-gray-500">No Clients Added</p>
                ) : (
                    <div className="overflow-x-auto h-screen shadow-lg">
                        <table className="min-w-full divide-y h-screen divide-gray-200 bg-white rounded-lg shadow-2xl">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Phone Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {clients.map((client) => (
                                    <tr key={client._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.phoneNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button
                                                onClick={() => handleEdit(client)}
                                                className="text-blue-500 hover:text-blue-700 px-2"
                                            >
                                                <RiEdit2Line />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(client._id)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                <RiDeleteBinLine />
                                            </button>
                                            {ledgerClientIds.has(client._id) && (
                                                <button
                                                    onClick={() => handleLedger(client._id)}
                                                    className="text-green-500 hover:bg-green-400 hover:text-white p-1 rounded underline ml-2"
                                                >
                                                    Ledger
                                                </button>
                                            )}
                                        </td>
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

export default ClientList;
