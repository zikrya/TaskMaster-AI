import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineViewSidebar, MdDashboard, MdAutorenew, MdEditSquare } from 'react-icons/md';
import { RiRobot2Line } from "react-icons/ri";

const features = [
  {
    id: 1,
    image: '/pic3.png',
    title: 'Boards',
    description: 'Maximize efficiency with advanced tools designed to jumpstart your projects. Inspired by the systems used by top engineers from leading tech companies, these boards provide powerful functionality to streamline your workflow and elevate your project management capabilities.',
    navTitle: 'Boards',
    icon: <MdOutlineViewSidebar />
  },
  {
    id: 2,
    image: '/pic4.png',
    title: 'Views',
    description: 'Learn about your projects from a variety of angles, concentrating on the most crucial subjects that are usually brought up in big tech coding interviews. These all-inclusive perspectives support your organization and guarantee that you\'re ready for any obstacle.',
    navTitle: 'Views',
    icon: <MdDashboard />
  },
  {
    id: 3,
    image: '/pic2.jpg',
    title: 'AI Tickets',
    description: 'Your learning and development process is accelerated by an intelligent algorithm that tailors project management challenges to your skill level and holds you accountable.',
    navTitle: 'AI Tickets',
    icon: <RiRobot2Line />
  },
  {
    id: 4,
    image: '/pic1.jpg',
    title: 'Custom Tickets',
    description: 'Alongside the tasks generated by AI, create your own to advance and level up. With the help of our project management tools and your own creativity, this feature enables you to improve your abilities and develop significant career capital.',
    navTitle: 'Custom Tickets',
    icon: <MdEditSquare />
  },
];

const FeatureGrid = () => {
  const [activeBoardId, setActiveBoardId] = useState(features[0].id); // Start with the first feature by default

  useEffect(() => {
      const interval = setInterval(() => {
          setActiveBoardId(prevId => {
              const currentIndex = features.findIndex(feature => feature.id === prevId);
              const nextIndex = (currentIndex + 1) % features.length;
              return features[nextIndex].id;
          });
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

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
          <div className='flex flex-col justify-center gap-3 h-94 max-w-xl'>
            <div className='flex items-center gap-2'>
              <div className="text-[#7a79ea] flex items-center" style={{ fontSize: '2rem' }}>{activeFeature.icon}</div>
              <h2 className="font-bold text-2xl mb-2 text-[#7a79ea] text-left">{activeFeature.title}</h2>
            </div>
            <p className="mb-4 text-left text-lg leading-relaxed">{activeFeature.description}</p>
          </div>
        </motion.div>
      );
  };

  return (
    <div id="feature-grid" className="w-full h-screen flex flex-col">
      <header className="py-5 px-8 border-b bg-white w-full sm:w-10/12 lg:w-7/12 mx-auto rounded-lg" style={{ boxShadow: '0 4px 10px rgba(122, 121, 234, 0.5)' }}>
        <nav className="flex justify-center">
          <div className="flex flex-wrap justify-center space-x-4 w-full max-w-screen-md mx-auto">
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
