import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LogoutButton from './LogoutButton'
import { useRecoilValue } from 'recoil'
import userAtom from '../atom/userAtom.js'
import Dashboard from './Dashboard.jsx'

const NavBar = () => {
  const user = useRecoilValue(userAtom)
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  return (
    <nav className=' relative z-20 bg-black  shadow-md'>
      <div className='container px-2 py-4 flex justify-between'>
        <div className='mx-5 text-lg font-bold text-white'>MOHKAM'S</div>
        <ul className='flex gap-4 align-middle'>
          <li><Link to='/' className='text-white hover:bg-orange-400 hover:text-black px-2 py-4 rounded-lg hover:transition duration-500 ease-in-out'>Home</Link></li>
          <li className='relative'>
            <button onClick={toggleDropdown} className='text-white -mt-3.5 hover:bg-orange-400 hover:text-black px-2 py-3.5 rounded-lg hover:transition duration-500 ease-in-out'>
              Operations
            </button>
            {isDropdownOpen && (
              <ul className='absolute bg-white text-black w-32 rounded-lg shadow-lg'>
                <li><Link to='/addClient' className='block px-4 py-2 hover:bg-orange-400 hover:text-black rounded-lg'>Add Client</Link></li>
                <li><Link to='/getClient' className='block px-4 py-2 hover:bg-orange-400 hover:text-black rounded-lg'>Client List</Link></li>
                <li><Link to='/addProduct' className='block px-4 py-2 hover:bg-orange-400 hover:text-black rounded-lg'>Add Product</Link></li>
                <li><Link to='/getProduct' className='block px-4 py-2 hover:bg-orange-400 hover:text-black rounded-lg'>Product List</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link to='/dashboard' className=' text-white block px-4 py-2 hover:bg-orange-400 hover:text-black rounded-lg'>Dashboard</Link>
          </li>
          <li><Link to='/contact' className='text-white hover:bg-orange-400 hover:text-black px-2 py-4 rounded-lg hover:transition duration-500 ease-in-out'>Contact</Link></li>
          {user ? (
            <li className='text-white px-1 py-0.5 hover:bg-orange-400 hover:text-black rounded-lg hover:transition duration-500 ease-in-out'>
              <LogoutButton />
            </li>
          ) : (
            <li>
              <Link
                to='/auth'
                className='text-white hover:bg-orange-400 hover:text-black px-2 py-4 rounded-lg hover:transition duration-500 ease-in-out'
              >
                Login
              </Link>
            </li>
          )
          }

        </ul>
      </div>
    </nav>
  )
}

export default NavBar
