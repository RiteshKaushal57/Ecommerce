import React from 'react'
import Hero from '../components/Homepage/Hero'
import Collection from '../components/Homepage/Collection'
import Policies from '../components/Homepage/Policies'
import About from './About'

const Home = () => {
  return (
    <div className='flex flex-col gap-10'>
      <Hero />
      <Collection limit={10} paginate={false} />
      <Policies />
  
    </div>
  )
}

export default Home
