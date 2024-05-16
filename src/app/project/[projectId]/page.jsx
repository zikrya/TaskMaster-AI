'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import KanbanBoard from '../../../components/KanbanBoard';

const ProjectPage = ({ params }) => {
  const router = useRouter();
  const { projectId } = params;
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`);
      console.log('API Response:', response);

      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      console.log('API Data:', data);
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Loading...</div></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold text-red-500">Error: {error}</div></div>;
  if (!project) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Project not found</div></div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <p className="text-lg text-gray-700">{project.description}</p>
      </div>
      <div className="bg-white shadow-md rounded-md p-6">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default ProjectPage;
