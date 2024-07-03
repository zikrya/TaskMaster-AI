import React from 'react'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Cards = () => {
  return (
    <div className='flex flex-wrap justify-center'>
      <motion.div className="bg-[#6c6bf8] p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4 opacity-50 overflow-hidden" variants={fadeInUp}>
        <h1 className="text-2xl font-semibold mb-4 text-white">AI-Powered Project Kickstart</h1>
        <p className="text-lg leading-relaxed text-white overflow-hidden text-ellipsis">Automate user stories, tasks, and project plans tailored for software engineering.</p>
      </motion.div>
      <motion.div className="bg-[#a5a4ff] p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4 opacity-50 overflow-hidden" variants={fadeInUp}>
        <h1 className="text-2xl font-semibold mb-4 text-white">AI-Enhanced Ticket</h1>
        <p className="text-lg leading-relaxed text-white overflow-hidden text-ellipsis">Automatically generate detailed ticket descriptions to guide you through each step, ensuring clarity and efficiency in every task.</p>
      </motion.div>
      <motion.div className="bg-[#6c6bf8] p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4 opacity-50 overflow-hidden" variants={fadeInUp}>
        <h1 className="text-2xl font-semibold mb-4 text-white">Custom Ticket Creation</h1>
        <p className="text-lg leading-relaxed text-white overflow-hidden text-ellipsis">Create personalized tickets tailored to your project&apos;s specific needs, allowing you to streamline workflows and enhance project management efficiency.</p>
      </motion.div>
      <motion.div className="bg-[#a5a4ff] p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4 opacity-50 overflow-hidden flex items-center justify-center" variants={fadeInUp}>
  <h1 className="text-2xl font-semibold text-center text-white">More features coming soon!</h1>
</motion.div>
    </div>
  )
}

export default Cards
