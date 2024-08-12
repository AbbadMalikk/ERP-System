import './App.css';
import NavBar from './components/NavBar';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Contact from './components/Contact';
import { AddClient } from './components/AddClient';
import { useRecoilValue } from 'recoil';
import userAtom from './atom/userAtom';
import AuthPage from './components/AuthPage';
import ClientList from './components/ClientList';
import { AddProduct } from './components/AddProduct';
import ProductList from './components/ProductList';
import Dashboard from './components/Dashboard';
import './gradDynamic.css';
import Sidebar from './components/Sidebar';
import AddOrder from './components/AddOrder';
import OrderList from './components/OrderList';
import Invoice from './components/Invoice';
import ClientLedger from './components/ClientLedger';
import InvoiceList from './components/InvoiceList';
import AddPayment from './components/AddPayment';
import ShowPayments from './components/ShowPayments';
import Delivery from './components/Delivery';
import DeliveryList from './components/DeliveryList';
import InvoiceConfirmed from './components/InvoiceConfirmed';
import Loader from './components/Loader';
import { useState, useEffect } from 'react';


function App() {
  const user = useRecoilValue(userAtom);
  const location = useLocation();
  const showSidebar = location.pathname !== '/contact' && location.pathname !== '/auth';

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!user) return
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <NavBar />
      <div className="layout">
        {showSidebar && <Sidebar />}
        <div className="content-container" style={{ flex: showSidebar ? 1 : 'auto', position: 'relative' }}>
          {loading ? (
            <Loader />
          ) : (
            <div className="content">
              <Routes>
                <Route path='/' element={user ? <Dashboard /> : <Navigate to="/auth" />} />
                <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to="/" />} />
                <Route path="/addClient" element={user ? <AddClient /> : <Navigate to="/auth" />} />
                <Route path="/getClient" element={user ? <ClientList /> : <Navigate to="/auth" />} />
                <Route path="/addProduct" element={user ? <AddProduct /> : <Navigate to="/auth" />} />
                <Route path="/getProduct" element={user ? <ProductList /> : <Navigate to="/auth" />} />
                <Route path="/addOrder" element={user ? <AddOrder /> : <Navigate to="/auth" />} />
                <Route path="/getOrder" element={user ? <OrderList /> : <Navigate to="/auth" />} />
                <Route path="/invoice" element={user ? <Invoice /> : <Navigate to="/auth" />} />
                <Route path="/clientLedger/:clientId" element={user ? <ClientLedger /> : <Navigate to="/auth" />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/invoices" element={user ? <InvoiceList /> : <Navigate to="/auth" />} />
                <Route path="/showpayment" element={user ? <ShowPayments /> : <Navigate to="/auth" />} />
                <Route path="/payment" element={user ? <AddPayment /> : <Navigate to="/auth" />} />
                <Route path="/delivery" element={user ? <Delivery /> : <Navigate to="/auth" />} />
                <Route path="/delivery-list" element={user ? <DeliveryList /> : <Navigate to="/auth" />} />
                <Route path="/invoice-confirmed/:invoiceId" element={user ? <InvoiceConfirmed /> : <Navigate to="/auth" />} />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
