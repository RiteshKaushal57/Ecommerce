import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets.js';
import { useUserContext } from '../context/UserContext.jsx'




const Navbar = () => {


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { isLogin, logout } = useUserContext()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className='flex items-center px-10 py-4 justify-between'>
      <Link to="/home">
        <img className='w-36' src={assets.logo} alt="logo" />
      </Link>

      <div className='hidden md:flex items-center gap-4 ml-4 [&>*]:hover:text-pink-500 [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-in-out [&>*]:text-gray-600 [&>*]:font-semibold'>
        <Link to="/collection">Collection</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>``
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex [&>*]:size-5 gap-3 [&>*]:cursor-pointer'>
          <img src={assets.search_icon} alt="search" />
          <Link to="/cart">
            <img src={assets.cart_icon} alt="cart" />
          </Link>
          {/* Profile Dropdown */}
          <div className='flex flex-col relative' ref={dropdownRef}>
            <button
              className='w-full text-left border-none bg-transparent focus:outline-none'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src={assets.profile_icon} alt='profile' className='cursor-pointer' />
            </button>
            <ul
              className={`absolute right-0 top-10 w-40 bg-white border border-gray-300 rounded shadow-md py-2 z-50 ${isDropdownOpen ? 'block' : 'hidden'
                }`}
            >
              {isLogin ? <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                <Link to="/" onClick={()=> {logout(); setIsDropdownOpen(false)}}>Logout</Link>
              </li> :
                <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                  <Link to="/login" onClick={() => setIsDropdownOpen(false)}>Login</Link>
                </li>
              }

              <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>My Profile</Link>
              </li>
              <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                <Link to="/admin" onClick={() => setIsDropdownOpen(false)}>Admin Panel</Link>
              </li>
            </ul>
          </div>

          <img className='size-2 md:hidden' src={assets.menu_icon} alt="menu" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
