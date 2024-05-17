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
    const [columns, setColumns] = useState([]);

    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch the project details
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project');

        const data = await response.json();
        setProject(data);

        // Simulate fetching frameworks (replace with actual API call)
        const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Ember'];  // Example frameworks
        setColumns([
          { name: 'To Do', tasks: frameworks },
          { name: 'In Progress', tasks: [] },
          { name: 'Done', tasks: [] },
        ]);
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
        <KanbanBoard columns={columns} />
      </div>
    );
  };

  export default ProjectPage;