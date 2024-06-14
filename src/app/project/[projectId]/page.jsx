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
    const [view, setView] = useState('kanban');
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketDescription, setNewTicketDescription] = useState('');
    const router = useRouter();

    const fetchProjectAndResponses = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (response.status === 403) {
                router.push('/no-access');
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch project');

            const data = await response.json();
            setProject(data);

            if (data.chatResponses && Array.isArray(data.chatResponses)) {
                const toDoTasks = data.chatResponses.filter(resp => resp.status === "To Do").map(resp => ({
                    id: resp.id,
                    title: resp.request, // Use request as title
                    description: resp.description || resp.response, // Use description if available, else use response
                    status: resp.status,
                }));

                const inProgressTasks = data.chatResponses.filter(resp => resp.status === "In Progress").map(resp => ({
                    id: resp.id,
                    title: resp.request, // Use request as title
                    description: resp.description || resp.response, // Use description if available, else use response
                    status: resp.status,
                }));

                const doneTasks = data.chatResponses.filter(resp => resp.status === "Done").map(resp => ({
                    id: resp.id,
                    title: resp.request, // Use request as title
                    description: resp.description || resp.response, // Use description if available, else use response
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

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        if (!newTicketTitle || !newTicketDescription) {
            alert('Both title and description are required.');
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}/ticket/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTicketTitle, description: newTicketDescription }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                alert(`Failed to create ticket: ${message}`);
                return;
            }

            const newTicket = await response.json();
            setNewTicketTitle('');
            setNewTicketDescription('');
            fetchProjectAndResponses(); // Refresh the board to include the new ticket
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <FetchProjectProvider value={fetchProjectAndResponses}>
            <div className="min-h-screen flex flex-col">
                <div className="bg-gray-200 w-full">
                    <div className="pt-4">
                        <h1 className="text-3xl font-bold mb-3 px-4">{project.name}</h1>
                        <div className="flex items-end px-4">
                            <button
                                onClick={() => setView('kanban')}
                                className={`mr-2 px-4 py-2 rounded-t-lg ${view === 'kanban' ? 'bg-white border-x border-t border-b-0 border-gray-300 text-black' : ' border-gray-300 text-gray-500'}`}
                                style={{ borderBottomColor: view === 'kanban' ? 'white' : '' }}
                            >
                                View 1
                            </button>
                            <button
                                onClick={() => setView('viewBoard')}
                                className={`mr-2 px-4 py-2 rounded-t-lg ${view === 'viewBoard' ? 'bg-white border-x border-t border-b-0 border-gray-300 text-black' : ' border-gray-300 text-gray-500'}`}
                                style={{ borderBottomColor: view === 'viewBoard' ? 'white' : '' }}
                            >
                                View 2
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-grow">
                    {view === 'kanban' ? (
                        <KanbanBoard
                            columns={columns}
                            projectId={projectId}
                            fetchProjectAndResponses={fetchProjectAndResponses}
                        />
                    ) : (
                        <ViewBoard project={project} fetchProjectAndResponses={fetchProjectAndResponses} />
                    )}
                </div>
                <ShareProject projectId={projectId} />
                <div className="p-8 bg-white rounded-md shadow-md mt-4">
                    <h2 className="text-2xl font-semibold mb-4">Create New Ticket</h2>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                        <input
                            type="text"
                            value={newTicketTitle}
                            onChange={(e) => setNewTicketTitle(e.target.value)}
                            placeholder="Ticket Title"
                            required
                            className="w-full p-2 border rounded"
                        />
                        <textarea
                            value={newTicketDescription}
                            onChange={(e) => setNewTicketDescription(e.target.value)}
                            placeholder="Ticket Description"
                            required
                            className="w-full p-2 border rounded"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            Create Ticket
                        </button>
                    </form>
                </div>
            </div>
        </FetchProjectProvider>
    );
};

export default ProjectPage;
