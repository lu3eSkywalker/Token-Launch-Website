import Footer from '../components/Designs/Footer'
import Navbar from '../components/Designs/Navbar'
import GetTokenMetadata from '../components/GetTokenMetadata'
import React from 'react'

const tokendata = () => {
  return (
    <div className='bg-slate-700 text-white min-h-screen'>
      <Navbar />
        <GetTokenMetadata />
      <Footer />
    </div>
  )
}

export default tokendata