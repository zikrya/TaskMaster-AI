'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ViewBoard = ({ project, fetchProjectAndResponses }) => {
    const router = useRouter();
    const [statuses, setStatuses] = useState({});
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch the users for assignment dropdown
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/projects/${project.id}/users`);
                const data = await response.json();
                // Remove duplicate users
                const uniqueUsers = Array.from(new Set(data.map(user => user.id)))
                                        .map(id => data.find(user => user.id === id));
                setUsers(uniqueUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [project.id]);

    const handleTaskClick = (task) => {
        const url = task.type === 'generated'
            ? `/project/${project.id}/ticket/${task.id}`
            : `/project/${project.id}/ticket/custom-ticket/${task.id}`;
        router.push(url);
    };

    const handleStatusChange = async (e, task) => {
        const newStatus = e.target.value;
        const url = task.type === 'generated'
            ? `/api/projects/${project.id}/ticket/${task.id}/status`
            : `/api/projects/${project.id}/ticket/custom-ticket/${task.id}/status`;

        try {
            const response = await fetch(url, {
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

            setStatuses(prevStatuses => ({ ...prevStatuses, [task.id]: newStatus }));
            fetchProjectAndResponses(); // Refresh the data after status change
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleAssigneeChange = async (e, task) => {
        const assigneeId = e.target.value;
        const url = task.type === 'generated'
            ? `/api/projects/${project.id}/ticket/${task.id}/assign`
            : `/api/projects/${project.id}/ticket/custom-ticket/${task.id}/assign`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assigneeId }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                console.error(`Failed to update assignee: ${message}`);
                alert(`Failed to update assignee: ${message}`);
                return;
            }

            fetchProjectAndResponses(); // Refresh the data after assignee change
        } catch (error) {
            console.error('Error updating assignee:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="p-4">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="py-2 px-4 border-r border-gray-300 text-left">Title</th>
                        <th className="py-2 px-4 border-r border-gray-300 text-left">Assignees</th>
                        <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {[...project.chatResponses.map((response, index) => ({
                        ...response,
                        type: 'generated',
                    })), ...project.customTickets.map((ticket, index) => ({
                        ...ticket,
                        type: 'custom',
                    }))].map((task, index) => (
                        <tr
                            key={task.id}
                            className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300"
                        >
                            <td className="py-2 px-4 border-r border-gray-300" onClick={() => handleTaskClick(task)}>
                                {`${index + 1}. ${task.response || task.title}`}
                            </td>
                            <td className="py-2 px-4 border-r border-gray-300">
                                <select
                                    value={task.assigneeId || ''}
                                    onChange={(e) => handleAssigneeChange(e, task)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.username || user.email}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="py-2 px-4">
                                <select
                                    value={statuses[task.id] || task.status}
                                    onChange={(e) => handleStatusChange(e, task)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewBoard;
