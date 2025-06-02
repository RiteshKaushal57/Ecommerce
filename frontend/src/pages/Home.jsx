import React from 'react'
import Hero from '../components/Homepage/Hero'
import Collection from '../components/Homepage/Collection'

const Home = () => {
  return (
    <div className='flex flex-col gap-10'>
      <Hero />
      <Collection />
    </div>
  )
}

export default Home
