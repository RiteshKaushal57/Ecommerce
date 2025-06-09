import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets.js';
import { useUserContext } from '../context/UserContext.jsx';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const menuDropdownRef = useRef(null);

  const { isLogin, logout, user, handleLoginAsSeller } = useUserContext();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target)
      ) {
        setIsMenuDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handler for Login as Admin
  const handleLoginAsAdmin = async () => {
    await handleLoginAsSeller();
    // After seller status is updated, the UI will automatically show Admin Panel
  };

  return (
    <div className='flex items-center px-10 py-4 justify-between'>
      <Link to="/">
        <img className='w-36' src={assets.logo} alt="logo" />
      </Link>

      <div className='hidden md:flex items-center gap-4 ml-4 [&>*]:hover:text-pink-500 [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-in-out [&>*]:text-gray-600 [&>*]:font-semibold'>
        <Link to="/collection">Collection</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex [&>*]:size-5 gap-3 [&>*]:cursor-pointer items-center'>
          <Link to="/cart">
            <img src={assets.cart_icon} alt="cart" />
          </Link>

          {/* Profile Dropdown */}
          <div className='flex flex-col relative' ref={profileDropdownRef}>
            <button
              className='w-full text-left border-none bg-transparent focus:outline-none'
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            >
              <img src={assets.profile_icon} alt='profile' className='cursor-pointer' />
            </button>
            <ul
              className={`absolute right-0 top-10 w-40 bg-white border border-gray-300 rounded shadow-md py-2 z-50 ${isProfileDropdownOpen ? 'block' : 'hidden'
                }`}
            >
              {isLogin ? (
                <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                  <Link to="/" onClick={() => { logout(); setIsProfileDropdownOpen(false); toast.success('You logged out successfully'); }}>Logout</Link>
                </li>
              ) : (
                <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                  <Link to="/login" onClick={() => setIsProfileDropdownOpen(false)}>Login</Link>
                </li>
              )}
              <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)}>My Profile</Link>
              </li>

              {/* Conditional rendering for seller/admin */}
              {isLogin && user && user.isSeller ? (
                <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                  <Link to="/admin-panel" onClick={() => setIsProfileDropdownOpen(false)}>Admin Panel</Link>
                </li>
              ) : isLogin && user && !user.isSeller ? (
                <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                  <button
                    className='w-full text-left bg-transparent border-none p-0 m-0 font-semibold text-gray-600 hover:text-pink-500'
                    onClick={handleLoginAsAdmin}
                  >
                    Login as Admin
                  </button>
                </li>
              ) : null}

              <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                <Link to="/orders" onClick={() => setIsProfileDropdownOpen(false)}>Orders</Link>
              </li>
            </ul>
          </div>

          {/* Hamburger Dropdown */}
          <div className='flex flex-col relative' ref={menuDropdownRef}>
            <button
              className='w-full text-left border-none bg-transparent focus:outline-none'
              onClick={() => setIsMenuDropdownOpen((prev) => !prev)}
            >
              <img className='size-4 md:hidden' src={assets.menu_icon} alt="menu" />
            </button>
            <ul
              className={`absolute right-0 top-10 w-40 bg-white border border-gray-300 rounded shadow-md py-2 z-50 ${isMenuDropdownOpen ? 'block' : 'hidden'
                }`}
            >
              <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                <Link to="/collection" onClick={() => setIsMenuDropdownOpen(false)}>Collection</Link>
              </li>
              <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                <Link to="/about" onClick={() => setIsMenuDropdownOpen(false)}>About</Link>
              </li>
              <li className='px-4 py-2 hover:text-pink-500 text-gray-600 font-semibold'>
                <Link to="/contact" onClick={() => setIsMenuDropdownOpen(false)}>Contact</Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
