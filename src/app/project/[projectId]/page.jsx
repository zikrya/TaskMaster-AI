'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import KanbanBoard from '../../../components/KanbanBoard';
import ViewBoard from '../../../components/ViewBoard';
import { FetchProjectProvider } from '../../../components/FetchProjectContext';
import ShareProject from '../../../components/ShareProject';

const ProjectPage = ({ params }) => {
    const { projectId } = params;
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);
    const [view, setView] = useState('kanban'); // New state for view type
    const router = useRouter();

    const fetchProjectAndResponses = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (response.status === 403) {
                router.push('/no-access'); // Redirect to 'no-access' page if forbidden
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch project');

            const data = await response.json();
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
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, router]);

    useEffect(() => {
        fetchProjectAndResponses();
    }, [fetchProjectAndResponses]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <FetchProjectProvider value={fetchProjectAndResponses}>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
                <div className="mb-4">
                    <button
                        onClick={() => setView('kanban')}
                        className={`mr-2 px-4 py-2 ${view === 'kanban' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
                    >
                        Kanban View
                    </button>
                    <button
                        onClick={() => setView('viewBoard')}
                        className={`px-4 py-2 ${view === 'viewBoard' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
                    >
                        View Board
                    </button>
                </div>
                {view === 'kanban' ? (
                    <KanbanBoard
                        columns={columns}
                        projectId={projectId}
                        fetchProjectAndResponses={fetchProjectAndResponses} // Pass the function as a prop
                    />
                ) : (
                    <ViewBoard project={project} fetchProjectAndResponses={fetchProjectAndResponses} />
                )}
                <ShareProject projectId={projectId} /> {/* Add this line to include the share functionality */}
            </div>
        </FetchProjectProvider>
    );
};

export default ProjectPage;
