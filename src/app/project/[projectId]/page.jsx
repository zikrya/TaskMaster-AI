'use client';
import { useState, useEffect } from 'react';
import KanbanBoard from '../../../components/KanbanBoard';

const ProjectPage = ({ params }) => {
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
                console.log('Fetched project data:', data);
                setProject(data);

                if (data.chatResponses && Array.isArray(data.chatResponses)) {
                    const chatTasks = data.chatResponses.map(resp => ({
                        id: resp.id,
                        title: resp.response // Assuming the response is the title
                    }));
                    console.log('Formatted chat tasks:', chatTasks);
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
            <KanbanBoard columns={columns} projectId={projectId} />
        </div>
    );
};

export default ProjectPage;
