import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className='bg-[#7a79ea] text-white py-10 w-full'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between'>
        <div className='mb-6 md:mb-0'>
          <h2 className='text-2xl font-bold mb-2'>DevLiftoff</h2>
          <p className='text-white mb-4 max-w-xs'>DevLiftoff is creating the best place to learn and get good at project management and development workflows.</p>
        </div>
        <div className='flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Links</h3>
            <ul>
              <li className='mb-2'><Link href='/sign-up' className='text-white'>Join DevLiftoff</Link></li>
              <li className='mb-2'><Link href='/sign-in' className='text-white'>Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>About Us</h3>
            <ul>
              <li className='mb-2'><Link href='/about' className='text-white'>Our Story</Link></li>
              <li className='mb-2'><Link href='/team' className='text-white'>Team</Link></li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Support</h3>
            <ul>
              <li className='mb-2'><Link href='/help' className='text-white'>Help Center</Link></li>
              <li className='mb-2'><Link href='/contact' className='text-white'>Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
