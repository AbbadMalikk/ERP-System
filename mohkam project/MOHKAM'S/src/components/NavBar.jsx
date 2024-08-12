import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useRecoilValue } from 'recoil';
import userAtom from '../atom/userAtom.js';

const NavBar = () => {
  const user = useRecoilValue(userAtom);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className='relative z-20 bg-black max-w-full shadow-md'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <div className='text-lg font-bold text-white'>MOHKAM'S</div>
        <div className='flex items-center gap-4'>
          {user ? (
            <>
              <Link
                to="/"
                className="text-white hover:bg-orange-400 hover:text-black px-2 py-2 rounded-lg transition duration-500 ease-in-out"
              >
                Dashboard
              </Link>
              <div className="text-white px-1 py-1 hover:bg-orange-400 hover:text-black rounded-lg transition duration-500 ease-in-out">
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-white hover:bg-orange-400 hover:text-black px-2 py-2 rounded-lg transition duration-500 ease-in-out"
              >
                Login
              </Link>
              <Link
                to="/contact"
                className="text-white hover:bg-orange-400 hover:text-black px-2 py-2 rounded-lg transition duration-500 ease-in-out"
              >
                Contact
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
