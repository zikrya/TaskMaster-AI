'use client'
import React from 'react'
import Link from 'next/link'
import Cards from '../components/Cards'
import Image from 'next/image';
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full bg-[#D3DCE6] border border-gray-300 shadow-sm rounded-md opacity-90" style={{ height: '60vh' }}>
          <div className='flex h-full px-6'>
            <div className='w-full md:w-1/2 lg:w-1/3 self-center'>
              <h1 className='text-blue-900 text-4xl font-semibold leading-snug mb-4'>The New Age Project Manager</h1>
              <p className='text-black text-xl leading-relaxed mb-6'>Introducing DevLiftoff: Revolutionize Your Development Workflow with Instant, Intelligent Task Allocation and Seamless Project Management!</p>
              <div className='mt-6 flex justify-center md:justify-start'>
                <Link href="/sign-up" className="w-64 md:w-48 text-white bg-[#4d4cd0] hover:bg-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</Link>
              </div>
            </div>
            <div className='w-full md:w-1/2 lg:w-2/3 flex justify-center items-center'>
              <Image src="/DevLiftoff.png" alt="DevLiftoff Logo" width={500} height={500} className="object-contain rounded-3xl" />
            </div>
          </div>
        </div>
        <div className='mt-4'>
          <Cards />
        </div>
        <Footer />
      </div>
    </>
  )
}
