'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import KanbanBoard from '../../../components/kanbanBoard';
import ViewBoard from '../../../components/viewBoard';
import { FetchProjectProvider } from '../../../components/FetchProjectContext';
import ShareProject from '../../../components/ShareProject';
import CreateTicketForm from '../../../components/CreateTicketForm';
import SearchBar from '../../../components/SearchBar';

const ProjectPage = ({ params }) => {
    const { projectId } = params;
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);
    const [view, setView] = useState('kanban');
    const [searchQuery, setSearchQuery] = useState('');
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

            const toDoTasks = [
                ...data.chatResponses.filter(resp => resp.status === "To Do").map(resp => ({
                    id: resp.id,
                    title: resp.response,
                    status: resp.status,
                    type: 'generated'
                })),
                ...data.customTickets.filter(ticket => ticket.status === "To Do").map(ticket => ({
                    id: ticket.id,
                    title: ticket.title,
                    status: ticket.status,
                    type: 'custom'
                })),
            ];

            const inProgressTasks = [
                ...data.chatResponses.filter(resp => resp.status === "In Progress").map(resp => ({
                    id: resp.id,
                    title: resp.response,
                    status: resp.status,
                    type: 'generated'
                })),
                ...data.customTickets.filter(ticket => ticket.status === "In Progress").map(ticket => ({
                    id: ticket.id,
                    title: ticket.title,
                    status: ticket.status,
                    type: 'custom'
                })),
            ];

            const doneTasks = [
                ...data.chatResponses.filter(resp => resp.status === "Done").map(resp => ({
                    id: resp.id,
                    title: resp.response,
                    status: resp.status,
                    type: 'generated'
                })),
                ...data.customTickets.filter(ticket => ticket.status === "Done").map(ticket => ({
                    id: ticket.id,
                    title: ticket.title,
                    status: ticket.status,
                    type: 'custom'
                })),
            ];

            setColumns([
                { name: 'To Do', tasks: toDoTasks },
                { name: 'In Progress', tasks: inProgressTasks },
                { name: 'Done', tasks: doneTasks },
            ]);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, router]);

    useEffect(() => {
        fetchProjectAndResponses();
    }, [fetchProjectAndResponses]);

    const filterTasks = (tasks) => {
        return tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const filteredColumns = columns.map(column => ({
        ...column,
        tasks: filterTasks(column.tasks)
    }));

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <FetchProjectProvider value={fetchProjectAndResponses}>
            <div className="min-h-screen flex flex-col">
                <div className="bg-gray-200 w-full">
                    <div className="pt-4 relative">
                        <h1 className="text-3xl font-bold mb-3 px-4">{project.name}</h1>
                        <div className="absolute top-4 right-4">
                            <CreateTicketForm projectId={projectId} userId={project.userId} fetchProjectAndResponses={fetchProjectAndResponses} />
                        </div>
                        <div className="flex items-end px-4 mt-4">
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
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                </div>
                <div className="flex-grow">
                    {view === 'kanban' ? (
                        <KanbanBoard
                            columns={filteredColumns}
                            projectId={projectId}
                            fetchProjectAndResponses={fetchProjectAndResponses}
                        />
                    ) : (
                        <ViewBoard project={project} columns={filteredColumns} fetchProjectAndResponses={fetchProjectAndResponses} />
                    )}
                </div>
                <ShareProject projectId={projectId} />
            </div>
        </FetchProjectProvider>
    );
};

export default ProjectPage;
