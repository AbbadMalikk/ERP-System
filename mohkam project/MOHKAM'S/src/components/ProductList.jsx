import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products/getproducts');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/products/delete-product/${id}`);
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        navigate('/addProduct', { state: { product } });
    };

    return (
        <div className="min-h-screen gradDynamic p-4">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-4">Product List</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="overflow-x-auto h-screen shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Product SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Product Price - Rs</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Product Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Product Pictures</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{product.Product_SKU}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{product.product_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{product.product_price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{product.product_quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center  text-sm text-gray-900">
                                        <img src={product.product_pictures} alt={product.product_name} className="h-16 ml-6 w-16 object-cover rounded-md " />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 px-2">
                                            <RiEdit2Line />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 ml-2">
                                            <RiDeleteBinLine />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
