'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Cards from '../components/Cards'
import Image from 'next/image';
import Footer from '../components/Footer'
import FeatureGrid from '../components/FeatureGrid'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  return (
    <>
      <motion.div
        className="flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.div
          className="w-full bg-[#D3DCE6] border border-gray-300 shadow-sm rounded-md opacity-90"
          style={{ height: '60vh' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='flex h-full px-6'>
            <div className='w-full md:w-1/2 lg:w-1/3 self-center'>
              <h1 className='text-blue-900 text-4xl font-semibold leading-snug mb-4'>The New Age Project Manager</h1>
              <p className='text-black text-xl leading-relaxed mb-6'>DevLiftoff is committed to building the best platform available for understanding development workflows and project management. Instead of the footer. Getting good sounds weird</p>
              <div className='mt-6 flex justify-center md:justify-start'>
                <Link href="/sign-up" className="w-64 md:w-48 text-white bg-[#4d4cd0] hover:bg-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</Link>
              </div>
            </div>
            <div className='w-full md:w-1/2 lg:w-2/3 flex justify-center items-center'>
              <Image src="/DevLiftoff.png" alt="DevLiftoff Logo" width={500} height={500} className="object-contain rounded-3xl" />
            </div>
          </div>
        </motion.div>
        <motion.div className='mt-4' variants={fadeInUp}>
          <Cards />
        </motion.div>
        <motion.div className='mt-10' variants={fadeInUp}>
          <FeatureGrid />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Footer />
        </motion.div>
      </motion.div>
    </>
  )
}
