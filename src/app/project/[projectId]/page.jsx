// src/pages/project/[projectId]/page.jsx
'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import KanbanBoard from '../../../components/KanbanBoard';

const ProjectPage = ({ params }) => {
    const router = useRouter();
    const { projectId } = params;
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
      const fetchProjectAndResponses = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/projects/${projectId}`);
          if (!response.ok) throw new Error('Failed to fetch project');

          const data = await response.json();
          setProject(data);

          // Adjust to remove the request prefix and split on newline if the responses are formatted that way
          if (data.chatResponses && Array.isArray(data.chatResponses)) {
            const chatTasks = data.chatResponses.flatMap(resp =>
              resp.response.split('\n').map(task => task.trim().split('. ')[1])  // split and remove the number prefix
            );
            setColumns([
              { name: 'To Do', tasks: chatTasks },
              { name: 'In Progress', tasks: [] },
              { name: 'Done', tasks: [] },
            ]);
          } else {
            setColumns([
              { name: 'To Do', tasks: [] },
              { name: 'In Progress', tasks: [] },
              { name: 'Done', tasks: [] },
            ]);
          }
        } catch (error) {
          console.error('Error fetching project:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProjectAndResponses();
    }, [projectId]);

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
