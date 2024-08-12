import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [recentClients, setRecentClients] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchRecentClients = async () => {
      try {
        const response = await axios.get('/api/clients/recent');
        setRecentClients(response.data);
      } catch (error) {
        console.error('Error fetching recent clients:', error);
      }
    };

    const fetchRecentProducts = async () => {
      try {
        const response = await axios.get('/api/products/recent');
        setRecentProducts(response.data);
      } catch (error) {
        console.error('Error fetching recent products:', error);
      }
    };

    fetchRecentClients();
    fetchRecentProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="text-3xl font-bold mb-6">
          <h3>WELCOME TO MOHKAM'S</h3>
        </div>
        <div className="flex justify-between">
          <div className="w-7/12 bg-white shadow-md rounded-lg overflow-y-auto h-96">
            <h3 className="px-4 py-2 font-bold border-b">Recently Added Clients</h3>
            <div className="px-4 py-4">
              {recentClients.length > 0 ? (
                recentClients.map(client => (
                  <div key={client._id} className="mb-2">
                    <p className="text-sm font-semibold">Name: {client.name}</p>
                    <p className="text-xs text-gray-500">Phone Number: {client.phoneNumber}</p>
                    <p className="text-xs text-gray-500">Address: {client.address}</p>
                  </div>
                ))
              ) : (
                <p>No Clients Added</p>
              )}
              <Link to="/getClient" className="text-blue-500 underline hover:text-blue-700">
                See more...
              </Link>
            </div>
          </div>
          <div className="w-2/5 bg-white shadow-md rounded-lg overflow-y-auto h-auto">
            <h3 className="px-4 py-2 font-bold border-b">Recently Added Products</h3>
            <div className="px-4 py-4">
              {recentProducts.length > 0 ? (
                recentProducts.map(product => (
                  <div key={product._id} className="mb-2">
                    <p className="text-sm font-semibold">Name: {product.product_name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.Product_SKU}</p>
                    <p className="text-xs text-gray-500">Price: ${product.product_price}</p>
                    <p className="text-xs text-gray-500">Quantity: {product.product_quantity}</p>
                  </div>
                ))
              ) : (
                <p>No Products Added</p>
              )}
              <Link to="/getProduct" className="text-blue-500 underline hover:text-blue-700">
                See more...
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
