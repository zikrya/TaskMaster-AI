'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import PusherSubscriber from '../../../../../../components/PusherSubscriber';
import ReactLoading from 'react-loading';
import CustomDropdown from '../../../../../../components/CustomDropdown';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
    const [isCommentFocused, setIsCommentFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(true); // State for toggling dropdown
    const router = useRouter();

    useEffect(() => {
        const fetchTicketDetails = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [ticketResponse, usersResponse] = await Promise.all([
                    fetch(`/api/projects/${projectId}/ticket/custom-ticket/${ticketId}`),
                    fetch(`/api/projects/${projectId}/users`),
                ]);

                if (!ticketResponse.ok) throw new Error('Failed to fetch ticket');
                if (!usersResponse.ok) throw new Error('Failed to fetch users');

                const ticketData = await ticketResponse.json();
                const usersData = await usersResponse.json();

                const uniqueUsers = Array.from(new Set(usersData.map(user => user.id)))
                    .map(id => usersData.find(user => user.id === id));

                setTicket(ticketData);
                setUsers(uniqueUsers);
                setStatus(ticketData.status || '');
                setAssigneeId(ticketData.assigneeId || '');

                // Fetch comments separately to display ticket details sooner
                const commentsResponse = await fetch(`/api/projects/${projectId}/ticket/custom-ticket/${ticketId}/comments`);
                if (!commentsResponse.ok) throw new Error('Failed to fetch comments');

                const commentsData = await commentsResponse.json();
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicketDetails();
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
            setIsCommentFocused(false);
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleStatusChange = async (newStatus) => {
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

    const handleAssigneeChange = async (newAssignee) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/ticket/custom-ticket/${ticketId}/assign`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assigneeId: newAssignee.value }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                console.error(`Failed to update assignee: ${message}`);
                alert(`Failed to update assignee: ${message}`);
                return;
            }

            setAssigneeId(newAssignee.value);
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if (isLoading && !ticket?.description) return (
        <div className="flex justify-center items-center min-h-screen">
            <ReactLoading type="spin" color="#7a79ea" height={64} width={64} />
        </div>
    );
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
                    <div className="border-t border-gray-300 mb-5"></div>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Comments</h2>
                        <form onSubmit={handleCommentSubmit} className="mt-4 mb-4">
                            {!isCommentFocused ? (
                                <textarea
                                    value={newComment}
                                    onChange={handleNewCommentChange}
                                    placeholder="Add a comment..."
                                    required
                                    className="w-full p-2 border rounded mb-4"
                                    onFocus={() => setIsCommentFocused(true)}
                                    style={{ minHeight: '40px' }}
                                />
                            ) : (
                                <>
                                    <textarea
                                        value={newComment}
                                        onChange={handleNewCommentChange}
                                        placeholder="Type @ to mention and notify someone."
                                        required
                                        className="w-full p-2 border rounded mb-4"
                                        style={{ minHeight: '80px' }}
                                    />
                                    <div className="flex justify-end">
                                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded hover:bg-gray-200 transition"
                                            onClick={() => setIsCommentFocused(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                        <ul className="space-y-1 bg-gray-50 p-4">
                            {comments.map((comment) => (
                                <li key={comment.id} className=" p-3 rounded-md">
                                    <strong>{comment.user ? comment.user.username : 'Unknown User'}</strong>
                                    <p>{comment.content}</p>
                                    <div className="border-t border-gray-300"></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-full lg:w-1/4 border h-full lg:h-1/4 rounded-sm">
                    <div className='flex items-center justify-between p-1.5 cursor-pointer' onClick={toggleDropdown}>
                        <p className='font-semibold text-lg'>Description</p>
                        {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    <div className="border-t border-gray-300 mb-2"></div>
                    {isDropdownOpen && (
                        <>
                            <div className="mb-3">
                                <h2 className="text-lg font-semibold mb-2 ml-4">Status</h2>
                                <div className="relative inline-block w-full">
                                    <CustomDropdown
                                        options={['To Do', 'In Progress', 'Done']}
                                        selected={status}
                                        onChange={handleStatusChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-2 ml-4">Assignee</h2>
                                <div className="relative inline-block w-full">
                                    <CustomDropdown
                                        options={[{ label: 'Unassigned', value: '' }, ...users.map(user => ({ label: user.username || user.email, value: user.id }))]}
                                        selected={users.find(user => user.id === assigneeId)?.username || 'Unassigned'}
                                        onChange={handleAssigneeChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomTicketPage;
