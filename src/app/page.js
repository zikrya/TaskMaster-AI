'use client'
import React from 'react'
import Link from 'next/link'
import Cards from '../components/Cards'

export default function Home() {
  return (
    <>
      <div className="flex-row justify-center">
      <div className="w-full bg-[#D3DCE6] border border-gray-300 shadow-sm rounded-md opacity-50" style={{ height: '45vh' }}>
  <div className='flex h-full'>
    <div className='w-full md:w-1/3 self-center ml-3'>
      <h1 className='text-blue-900 text-4xl font-semibold leading-snug mb-6'>The New Age Project Manager</h1>
      <p className='text-black text-xl leading-relaxed mb-6'>Introducing DevLiftoff: Revolutionize Your Development Workflow with Instant, Intelligent Task Allocation and Seamless Project Management!</p>
      <div className='mt-12 flex justify-center md:justify-start'>
        <Link href="/sign-up"type="button" className="w-64 md:w-48 text-white bg-gradient-to-r from-purple-400 via-purple-400 to-purple-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</Link>
      </div>
    </div>
  </div>
</div>
        <div className='mt-4'>
          <Cards />
        </div>
      </div>
    </>
  )
}

