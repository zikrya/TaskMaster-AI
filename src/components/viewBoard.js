'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PusherSubscriber from './PusherSubscriber';
import CustomDropdown from './CustomDropdown';

const ViewBoard = ({ project, fetchProjectAndResponses }) => {
    const router = useRouter();
    const [statuses, setStatuses] = useState({});
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/projects/${project.id}/users`);
                const data = await response.json();
                const uniqueUsers = Array.from(new Set(data.map(user => user.id)))
                    .map(id => data.find(user => user.id === id));
                setUsers(uniqueUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        const initialTasks = [
            ...project.chatResponses.map(response => ({ ...response, type: 'generated' })),
            ...project.customTickets.map(ticket => ({ ...ticket, type: 'custom' }))
        ];
        setTasks(initialTasks);
    }, [project.id]);

    const handleTaskClick = (task) => {
        const url = task.type === 'generated'
            ? `/project/${project.id}/ticket/${task.id}`
            : `/project/${project.id}/ticket/custom-ticket/${task.id}`;
        router.push(url);
    };

    const handleStatusChange = async (newStatus, task) => {
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
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleAssigneeChange = async (newAssignee, task) => {
        const url = task.type === 'generated'
            ? `/api/projects/${project.id}/ticket/${task.id}/assign`
            : `/api/projects/${project.id}/ticket/custom-ticket/${task.id}/assign`;

        try {
            const response = await fetch(url, {
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

            setTasks(prevTasks => {
                const updatedTasks = prevTasks.map(t =>
                    t.id === task.id ? { ...t, assigneeId: newAssignee.value } : t
                );
                return updatedTasks;
            });
        } catch (error) {
            console.error('Error updating assignee:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleTicketAssigned = (data) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task =>
                task.id === parseInt(data.ticketId) ? { ...task, assigneeId: data.assigneeId } : task
            );
            return updatedTasks;
        });
    };

    const handleStatusUpdated = (data) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task =>
                task.id === parseInt(data.ticketId) ? { ...task, status: data.status } : task
            );
            return updatedTasks;
        });
    };

    return (
        <div className="p-4">
            <PusherSubscriber
                projectId={project.id}
                onTicketAssigned={handleTicketAssigned}
                onStatusUpdate={handleStatusUpdated}
            />
            <table className="min-w-full bg-white">
                <thead className='rounded-lg'>
                    <tr className="">
                        <th className="py-2 px-4 text-left border bg-gray-200 text-gray-500">Title</th>
                        <th className="py-2 px-4 text-left border bg-gray-200 text-gray-500">Assignees</th>
                        <th className="py-2 px-4 text-left border bg-gray-200 text-gray-500">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {[...tasks].map((task, index) => (
                        <tr
                            key={task.id}
                            className="cursor-pointer transition-colors duration-200"
                        >
                            <td className="py-2 px-4 text-[#7A79EA] hover:text-gray-500" onClick={() => handleTaskClick(task)}>
                                {`${index + 1}. ${task.response || task.title}`}
                            </td>
                            <td className="py-2 px-4">
                                <CustomDropdown
                                    options={[{ label: 'Unassigned', value: '' }, ...users.map(user => ({ label: user.username || user.email, value: user.id }))]}
                                    selected={users.find(user => user.id === task.assigneeId)?.username || 'Unassigned'}
                                    onChange={(selected) => handleAssigneeChange(selected, task)}
                                />
                            </td>
                            <td className="py-2 px-4">
                                <div>
                                    <CustomDropdown
                                        options={['To Do', 'In Progress', 'Done']}
                                        selected={statuses[task.id] || task.status}
                                        onChange={(newStatus) => handleStatusChange(newStatus, task)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewBoard;
