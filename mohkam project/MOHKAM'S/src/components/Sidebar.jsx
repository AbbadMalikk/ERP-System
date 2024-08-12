import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil'
import userAtom from '../atom/userAtom.js'


const Sidebar = () => {

    const user = useRecoilValue(userAtom)

    return (
        <aside className="relative bg-gray-800 h-auto  w-64">
            <div className="h-auto">
                {/* Sidebar Menu */}
                <nav>
                    <div>
                        <ul>
                            {/* Menu Item Dashboard */}
                            
                            <div className="mt-1 space-y-1">
                                <ul>
                            {user? ( <React.Fragment>
                                <li><h3 className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-lg py-4 text-gray-400 duration-300 ease-in-out hover:text-white">{user.username}</h3></li>
                                    <li>
                                    <a href={`mailto:${user.email}`}
                  className="group py-2 relative text-sm flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">
                  {user.email}
                </a></li>
                            </React.Fragment>
                            ) : <li  className="group py-2 relative text-md flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">Welcome to Mohkam's</li> }
                                    
                                    <hr className='ml-7 w-4/5 py-2 text-red-600' />
                                    <li><Link to='/addClient' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">Add Client</Link></li>
                                    <li><Link to='/getClient' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">Client List</Link></li>
                                    <li><Link to='/addProduct' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">Add Product</Link></li>
                                    <li><Link to='/getProduct' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400
                                     duration-300 ease-in-out hover:text-white">Product List</Link></li>
                                     <li><Link to='/addOrder' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">Add Order</Link></li>
                                     <li><Link to='/getOrder' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400
                                     duration-300 ease-in-out hover:text-white">Order List</Link></li>
                                    <li><Link to='/invoices' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">Invoice List</Link></li>
                                    <li><Link to='/payment' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400
                                     duration-300 ease-in-out hover:text-white">Add Payment</Link></li>
                                     <li><Link to='/delivery-list' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400
                                     duration-300 ease-in-out hover:text-white">Delivery List</Link></li>
                                
                                    <li><Link to='/contact' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">Contact</Link></li>
                                    {/* <li><Link to='/invoice' className="group py-2 relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white">Invoice temp</Link></li> */}
                                    
                                </ul>
                            </div>




                        </ul>
                    </div>
                </nav>

            </div>
        </aside>
    );
};

export default Sidebar;
