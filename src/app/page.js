'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Cards from '../components/landing/Cards';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from '../components/landing/Footer';
import FeatureGrid from '../components/landing/FeatureGrid';
import { useSticky } from '../context/StickContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  const { setIsSticky } = useSticky();

  useEffect(() => {
    setIsSticky(true);
    return () => setIsSticky(false);
  }, [setIsSticky]);

  return (
    <>
      <div className="flex flex-col items-center">
        <motion.div
          className="w-full bg-[#D3DCE6] border border-gray-300 shadow-sm rounded-md opacity-90"
          style={{ height: 'auto', minHeight: '60vh' }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className='flex flex-col lg:flex-row h-full px-6'>
            <div className='w-full lg:w-1/2 self-center text-center lg:text-left'>
              <h1 className='text-blue-900 text-4xl font-semibold leading-snug mb-4'>The New Age Project Manager</h1>
              <p className='text-black text-xl leading-relaxed mb-6'>DevLiftoff is committed to building the best platform available for understanding development workflows and project management.</p>
              <div className='mt-6 flex justify-center lg:justify-start'>
                <Link href="/sign-up" className="w-64 md:w-48 text-white bg-[#4d4cd0] hover:bg-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</Link>
              </div>
            </div>
            <div className='w-full lg:w-1/2 flex justify-center items-center mt-6 lg:mt-0'>
              <div className='relative w-full max-w-md'>
                <Image src="/DevLiftoff.png" alt="DevLiftoff Logo" layout="responsive" width={500} height={500} className="object-contain rounded-3xl" />
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div className='mt-10 w-full p-10' initial="hidden" animate="visible" variants={fadeInUp}>
          <Cards />
        </motion.div>
        <motion.div className='mt-10 w-full pb-52 pt-8' initial="hidden" animate="visible" variants={fadeInUp}>
          <FeatureGrid />
        </motion.div>
        <motion.div className='w-full mt-16' initial="hidden" animate="visible" variants={fadeInUp}>
          <Footer />
        </motion.div>
      </div>
    </>
  );
}
