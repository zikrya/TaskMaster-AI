'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import PusherSubscriber from '../../../../../../components/PusherSubscriber';

const CustomTicketPage = ({ params }) => {
    const { projectId, ticketId } = params;
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [users, setUsers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchTicket = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/projects/${projectId}/ticket/custom-ticket/${ticketId}`);
                if (!response.ok) throw new Error('Failed to fetch ticket');

                const data = await response.json();
                setTicket(data);
                setStatus(data.status || '');
                setAssigneeId(data.assigneeId || '');

                const commentsResponse = await fetch(`/api/projects/${projectId}/ticket/custom-ticket/${ticketId}/comments`);
                if (!commentsResponse.ok) throw new Error('Failed to fetch comments');

                const commentsData = await commentsResponse.json();
                setComments(commentsData);

                // Fetch users for assignment dropdown
                const usersResponse = await fetch(`/api/projects/${projectId}/users`);
                if (!usersResponse.ok) throw new Error('Failed to fetch users');

                const usersData = await usersResponse.json();

                // Remove duplicate users
                const uniqueUsers = Array.from(new Set(usersData.map(user => user.id)))
                                         .map(id => usersData.find(user => user.id === id));

                setUsers(uniqueUsers);
            } catch (error) {
                console.error('Error fetching ticket or comments:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicket();
    }, [projectId, ticketId]);

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) return;

        try {
            const response = await fetch(`/api/projects/${projectId}/ticket/custom-ticket/${ticketId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment })
            });

            if (!response.ok) {
                const { message } = await response.json();
                alert(`Failed to create comment: ${message}`);
                return;
            }

            const newCommentData = await response.json();
            setComments([...comments, newCommentData]);
            setNewComment('');
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const response = await fetch(`/api/projects/${projectId}/ticket/custom-ticket/${ticketId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                console.error(`Failed to update status: ${message}`);
                alert(`Failed to update status: ${message}`);
                return;
            }

            setStatus(newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleAssigneeChange = async (e) => {
        const newAssigneeId = e.target.value;
        try {
            const response = await fetch(`/api/projects/${projectId}/ticket/custom-ticket/${ticketId}/assign`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assigneeId: newAssigneeId }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                console.error(`Failed to update assignee: ${message}`);
                alert(`Failed to update assignee: ${message}`);
                return;
            }

            setAssigneeId(newAssigneeId);
        } catch (error) {
            console.error('Error updating assignee:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleTicketUpdate = (updatedTicket) => {
        setTicket(updatedTicket);
        setAssigneeId(updatedTicket.assigneeId || '');
        setStatus(updatedTicket.status || '');
    };

    const handleStatusUpdate = (data) => {
        if (data.ticketId === ticketId) {
            setStatus(data.status);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!ticket) return <div>Ticket not found</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <PusherSubscriber projectId={projectId} ticketId={ticketId} onTicketUpdate={handleTicketUpdate} onStatusUpdate={handleStatusUpdate} />
            <div className="max-w-6xl mx-auto bg-white p-10 rounded-md shadow-md flex flex-col lg:flex-row min-h-screen">
                <div className="flex-1 pr-0 lg:pr-8 mb-8 lg:mb-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">{ticket.title}</h1>
                        <p className="text-gray-600">Ticket #{ticketId}</p>
                    </div>

                    <div className="mb-8">
                        <ReactMarkdown className="text-gray-800">{ticket.description || 'No description available'}</ReactMarkdown>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Comments</h2>
                        <ul className="space-y-4">
                            {comments.map((comment) => (
                                <li key={comment.id} className="bg-gray-100 p-4 rounded-md">
                                    <strong>{comment.user ? comment.user.username : 'Unknown User'}</strong>
                                    <p>{comment.content}</p>
                                </li>
                            ))}
                        </ul>

                        <form onSubmit={handleCommentSubmit} className="mt-4">
                            <textarea
                                value={newComment}
                                onChange={handleNewCommentChange}
                                placeholder="Add a comment"
                                required
                                className="w-full p-2 border rounded mb-4"
                            />
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                                Submit Comment
                            </button>
                        </form>
                    </div>
                </div>

                <div className="w-full lg:w-1/4">
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Status</h2>
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Assignee</h2>
                        <select
                            value={assigneeId}
                            onChange={handleAssigneeChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Unassigned</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username || user.email}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Projects</h2>
                        <p>TaskMaster-AI</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomTicketPage;
