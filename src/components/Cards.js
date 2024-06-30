import React from 'react'

const Cards = () => {
  return (
    <div className='flex flex-wrap justify-center'>
      <div className="bg-[#6c6bf8] p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4 opacity-50">
        <h1 className="text-2xl font-semibold mb-4 text-white">AI-Powered Project Kickstart</h1>
        <p className="text-lg leading-relaxed text-white">Automate the creation of user stories, tasks, and project plans tailored to software engineering needs.</p>
      </div>
      <div className="bg-[#a5a4ff] p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4 opacity-50">
        <h1 className="text-2xl font-semibold mb-4 text-white">Advanced Customization</h1>
        <p className="text-lg leading-relaxed text-white">Extensive customization options for workflows, dashboards, and reports to fit specific project needs and preferences, allowing software engineers to tailor the platform to their unique requirements.</p>
      </div>
      <div className="bg-[#6c6bf8] p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4 opacity-50">
        <h1 className="text-2xl font-semibold mb-4 text-white">Branch Out Your Portfolio</h1>
        <p className="text-lg leading-relaxed text-white">Elevate your project management capabilities and distinguish yourself in the competitive landscape. Reach new heights in project creation, streamline your workflow, and expand your portfolio with innovative tools designed to help you succeed.</p>
      </div>
      <div className="bg-[#a5a4ff] p-8 rounded-md shadow-lg w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 h-96 m-4 opacity-50">
        <h1 className="text-2xl font-semibold mb-4 text-white">Real-Time Progress Tracking</h1>
        <p className="text-lg leading-relaxed text-white">Leverage Scrum/Kanban boards updated in real-time, with automated notifications and daily summaries to keep teams aligned and informed.</p>
      </div>
    </div>
  )
}

export default Cards
