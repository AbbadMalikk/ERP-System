import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Delivery = () => {
  const { state } = useLocation();
  const { invoice } = state;
  const [productStatuses, setProductStatuses] = useState(
    invoice.products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      productQuantity: product.productQuantity,
      salePrice: product.salePrice,
      status: '',
      reason: ''
    }))
  );
  const [clientInfo, setClientInfo] = useState({ address: '', phoneNumber: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get(`/api/clients/getclientbyID/${invoice.clientId}`);
        setClientInfo({
          address: response.data.address,
          phoneNumber: response.data.phoneNumber
        });
      } catch (error) {
        setError('Failed to fetch client information');
      }
    };

    fetchClientInfo();
  }, [invoice.clientId]);

  const handleStatusChange = (index, status) => {
    const newStatuses = [...productStatuses];
    newStatuses[index].status = status;
    setProductStatuses(newStatuses);
  };

  const handleReasonChange = (index, reason) => {
    const newStatuses = [...productStatuses];
    newStatuses[index].reason = reason;
    setProductStatuses(newStatuses);
  };

  const handleSave = async () => {
    try {
      const deliveryData = {
        invoiceNum: invoice.invoiceNum,
        clientName: invoice.clientName,
        clientId: invoice.clientId,
        products: productStatuses,
        address: clientInfo.address,
        phoneNumber: clientInfo.phoneNumber
      };
      await axios.post('/api/delivery/deliveries', deliveryData);
      navigate('/delivery-list');
    } catch (error) {
      setError('Error saving delivery');
      console.error('Error saving delivery:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 bg-white">
      <h2 className="text-center text-2xl font-bold mb-4">Delivery Details</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-hidden">
        <div className="p-9 bg-white rounded-b-md">
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
                  <p>{invoice.clientName}</p>
                  <p>{clientInfo.address}</p>
                  <p>{clientInfo.phoneNumber}</p>
                </div>
                <div className="text-sm font-light text-slate-500">
                  <p className="text-sm font-normal text-slate-700">Invoice Number</p>
                  <p>000{invoice.invoiceNum}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-9">
            <div className="flex flex-col mx-0 mt-8">
              <table className="min-w-full divide-y divide-slate-500">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                      Product Name
                    </th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                      Quantity
                    </th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                      Sale Price
                    </th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                      Status
                    </th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                      Reason (if Unavailable)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productStatuses.map((product, index) => (
                    <tr key={product.productId} className="border-b border-slate-200">
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                        <div className="font-medium text-slate-700">{product.productName}</div>
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                        <div className="text-slate-500">{product.productQuantity}</div>
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                        <div className="text-slate-500">{product.salePrice} Rs</div>
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                        <label>
                          <input
                            type="radio"
                            name={`status-${product.productId}`}
                            value="Confirmed"
                            checked={product.status === 'Confirmed'}
                            onChange={() => handleStatusChange(index, 'Confirmed')}
                          />
                          <span className="px-2">Confirmed</span>
                        </label>
                        <label className="ml-2">
                          <input
                            type="radio"
                            name={`status-${product.productId}`}
                            value="Unavailable"
                            checked={product.status === 'Unavailable'}
                            onChange={() => handleStatusChange(index, 'Unavailable')}
                          />
                          <span className="px-2">Unavailable</span>
                        </label>
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                        {/* {product.status === 'Unavailable' && ( */}
                          <input
                            type="text"
                            placeholder="Reason"
                            value={product.reason}
                            onChange={(e) => handleReasonChange(index, e.target.value)}
                            className="border rounded px-2 py-1"
                            style={{ minWidth: '150px' }} // Add this line
                          />
                        {/* )} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Save Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
