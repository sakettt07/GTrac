import React from 'react'
import Navbar from '../components/Navbar'

const OverView = () => {
  return (
    <>
    <Navbar />
    <section className='w-full h-screen bg-black pt-16 px-4'>
      <h1 className='text-white'>This is the overview page</h1>
    </section>
    </>
  )
}

export default OverView