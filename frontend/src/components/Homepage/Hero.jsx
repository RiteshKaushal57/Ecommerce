import React from 'react'
import { assets } from '../../assets/frontend_assets/assets'
const Hero = () => {
    return (
        <div className=' px-10 py-4'>
            <div className='flex flex-col sm:flex-row items-center justify-center border border-gray-400'>
                <div className='w-full sm:w-1/2 flex-col py-10 sm:py-0 flex items-center '>
                    <p className='font-medium'>OUR BEST SELLERS</p>
                    <h1 className='text-3xl'>Latest collection</h1>
                    <p className='font-semibold'>Shop now</p>
                </div>
                <img className='w-full sm:w-1/2' src={assets.hero_img} />
            </div>
        </div>
    )
}

export default Hero
