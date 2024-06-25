import React from 'react'

const Cards = () => {
  return (
    <div className='flex flex-wrap justify-center'>
      <div className="bg-gradient-to-r from-purple-100 to-gray-200 p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-400">AI-Powered Project Kickstart</h1>
        <p className="text-lg leading-relaxed text-gray-700">Automate the creation of user stories, tasks, and project plans tailored to software engineering needs.</p>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-gray-200 p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-400">Advanced Customization</h1>
        <p className="text-lg leading-relaxed text-gray-700">Extensive customization options for workflows, dashboards, and reports to fit specific project needs and preferences, allowing software engineers to tailor the platform to their unique requirements.</p>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-gray-200 p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-400">Branch Out Your Portfolio</h1>
        <p className="text-lg leading-relaxed text-gray-700">Elevate your project management capabilities and distinguish yourself in the competitive landscape. Reach new heights in project creation, streamline your workflow, and expand your portfolio with innovative tools designed to help you succeed.</p>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-gray-200 p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-400">Real-Time Progress Tracking</h1>
        <p className="text-lg leading-relaxed text-gray-700">Leverage Scrum/Kanban boards updated in real-time, with automated notifications and daily summaries to keep teams aligned and informed.</p>
      </div>
    </div>
  )
}

export default Cards
