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
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
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
          style={{ height: '60vh' }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className='flex h-full px-6'>
            <div className='w-full md:w-1/2 lg:w-1/3 self-center'>
              <h1 className='text-blue-900 text-4xl font-semibold leading-snug mb-4'>The New Age Project Manager</h1>
              <p className='text-black text-xl leading-relaxed mb-6'>DevLiftoff is committed to building the best platform available for understanding development workflows and project management.</p>
              <div className='mt-6 flex justify-center md:justify-start'>
                <Link href="/sign-up" className="w-64 md:w-48 text-white bg-[#4d4cd0] hover:bg-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</Link>
              </div>
            </div>
            <div className='w-full md:w-1/2 lg:w-2/3 flex justify-center items-center'>
              <Image src="/DevLiftoff.png" alt="DevLiftoff Logo" width={500} height={500} className="object-contain rounded-3xl" />
            </div>
          </div>
        </motion.div>
        <motion.div className='mt-4' initial="hidden" animate="visible" variants={fadeInUp}>
          <Cards />
        </motion.div>
        <motion.div className='mt-12' initial="hidden" animate="visible" variants={fadeInUp}>
          <FeatureGrid />
        </motion.div>
        <motion.div className='w-full' initial="hidden" animate="visible" variants={fadeInUp}>
          <Footer />
        </motion.div>
      </div>
    </>
  );
}
