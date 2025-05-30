import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets.js'



const Navbar = () => {



    return (
        <div className='flex items-center px-10 py-4 justify-between'>

            {/*Logo Icon*/}
            <Link to="/home">
                <img className='w-36' src={assets.logo} />
            </Link>
            {/*Navigation Links*/}
            <div className='hidden md:flex items-center gap-4 ml-4 [&>*]:hover:text-pink-500 [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-in-out [&>*]:text-gray-600 [&>*]:font-semibold'>

                <Link to="/collection">Collection</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>

            </div>

            <div className='flex items-center gap-4'>
                <div className='flex [&>*]:size-5 gap-3 [&>*]:cursor-pointer [&>*]:hover:scale-110 [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-in-out'>
                    <img src={assets.search_icon} alt="" />
                    <img src={assets.cart_icon} alt="" />
                    <img tabIndex={0} className='peer focus:outline-none:' src={assets.profile_icon} alt="" />
                    <img className='size-2 md:hidden' src={assets.menu_icon} alt="" />
                </div>

                {/*Dropdown Menu*/}
                <ul className='hidden peer-focus:block absolute right-10 top-16 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-50 gap-3 
                [&>*]:text-gray-600 [&>*]:font-semibold 
                [&>*]:hover:text-pink-500 
                [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-in-out'>
                    <Link to="/login">Login</Link>
                    <Link to="/profile">My Profile</Link>
                    <Link to="/admin">Admin Panel</Link>
                </ul>




                {/* <button className='bg-pink-700 px-4 py-2 rounded-lg text-white'>Login</button> */}

            </div>


        </div>
    )
}

export default Navbar
