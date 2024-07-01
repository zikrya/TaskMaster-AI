import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineViewSidebar, MdDashboard, MdAutorenew, MdEditSquare } from 'react-icons/md';
import { RiRobot2Line } from "react-icons/ri";


const features = [
  {
    id: 1,
    image: '/pic3.png',
    title: 'Boards',
    description: 'Trained on the best engineers in big tech to practice coding 24/7.',
    navTitle: 'Boards',
    icon: <MdOutlineViewSidebar />
  },
  {
    id: 2,
    image: '/pic4.png',
    title: 'Views',
    description: 'Most important topics that are asked during coding interviews in big tech.',
    navTitle: 'Views',
    icon: <MdDashboard />
  },
  {
    id: 3,
    image: '/pic2.png',
    title: 'AI Tickets',
    description: 'Algorithm that tailors problems to you & holds you accountable to learn faster.',
    navTitle: 'AI Tickets',
    icon: <RiRobot2Line />
  },
  {
    id: 4,
    image: '/pic1.png',
    title: 'Custom Tickets',
    description: 'Progress and level up by practicing data structures to get higher "career capital".',
    navTitle: 'Custom Tickets',
    icon: <MdEditSquare />
  },
];

const FeatureGrid = () => {
    const [activeBoardId, setActiveBoardId] = useState(features[0].id); // Start with the first feature by default

    const renderBoardContent = () => {
        const activeFeature = features.find(feature => feature.id === activeBoardId);
        return (
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="p-5 rounded w-full flex flex-col md:flex-row gap-20 items-center justify-center h-full"
          >
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-[#7a79ea] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-[#6c6bf8] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#9370db] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <Image
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  width={500}
                  height={500}
                  className="rounded-lg border-4 border-white shadow-lg"
                />
              </div>
            </div>
            <div className='flex flex-col justify-center gap-3 h-94'>
              <div className='flex items-center gap-2'>
                <div className="text-[#7a79ea] flex items-center" style={{ fontSize: '2rem' }}>{activeFeature.icon}</div>
                <h2 className="font-bold text-2xl mb-2 text-[#7a79ea] text-left">{activeFeature.title}</h2>
              </div>
              <p className="mb-4 text-left">{activeFeature.description}</p>
            </div>
          </motion.div>
        );
      };

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="py-5 px-8 border-b bg-white w-7/12 mx-auto rounded-lg" style={{ boxShadow: '0 4px 10px #7a79ea' }}>
        <nav className="flex justify-center">
          <div className="flex space-x-4 max-w-screen-md mx-auto">
            {features.map(feature => (
              <button
                key={feature.id}
                onClick={() => setActiveBoardId(feature.id)}
                className={`px-4 py-2 flex flex-col items-center rounded-t-lg ${activeBoardId === feature.id ? 'bg-white text-blue-600 border-b-2 border-blue-600' : ' text-gray-600'}`}
              >
                <div className="mb-1">
                  {feature.icon}
                </div>
                {feature.navTitle}
              </button>
            ))}
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <AnimatePresence mode='wait'>
          {renderBoardContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default FeatureGrid;
