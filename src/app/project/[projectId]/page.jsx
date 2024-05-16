'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
    </div>
  );
};

export default ProjectPage;