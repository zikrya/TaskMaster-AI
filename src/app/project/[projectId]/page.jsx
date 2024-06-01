'use client';
import { useState, useEffect, useCallback } from 'react';
import KanbanBoard from '../../../components/kanbanBoard';
import { FetchProjectProvider } from '../../../components/FetchProjectContext';

const ProjectPage = ({ params }) => {
    const { projectId } = params;
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);

    const fetchProjectAndResponses = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (!response.ok) throw new Error('Failed to fetch project');

            const data = await response.json();
            console.log('Fetched project data:', data);
            setProject(data);

            if (data.chatResponses && Array.isArray(data.chatResponses)) {
                const toDoTasks = data.chatResponses.filter(resp => resp.status === "To Do").map(resp => ({
                    id: resp.id,
                    title: resp.response,
                    status: resp.status,
                }));

                const inProgressTasks = data.chatResponses.filter(resp => resp.status === "In Progress").map(resp => ({
                    id: resp.id,
                    title: resp.response,
                    status: resp.status,
                }));

                const doneTasks = data.chatResponses.filter(resp => resp.status === "Done").map(resp => ({
                    id: resp.id,
                    title: resp.response,
                    status: resp.status,
                }));

                console.log('To Do tasks:', toDoTasks); // Debugging log
                console.log('In Progress tasks:', inProgressTasks); // Debugging log
                console.log('Done tasks:', doneTasks); // Debugging log

                setColumns([
                    { name: 'To Do', tasks: toDoTasks },
                    { name: 'In Progress', tasks: inProgressTasks },
                    { name: 'Done', tasks: doneTasks },
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
    }, [projectId]);

    useEffect(() => {
        fetchProjectAndResponses();
    }, [fetchProjectAndResponses]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <FetchProjectProvider value={fetchProjectAndResponses}>
        <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <KanbanBoard
                columns={columns}
                projectId={projectId}
                fetchProjectAndResponses={fetchProjectAndResponses} // Pass the function as a prop
            />
        </div>
    </FetchProjectProvider>
    );
};

export default ProjectPage;


