'use client';
import { useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import ShareProject from './ShareProject';

const ProjectSettings = ({ projectId }) => {
    const { userId: currentUserId } = useAuth();
    const [project, setProject] = useState(null);
    const [sharedUsers, setSharedUsers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [view, setView] = useState('projectSettings'); // State to manage the current view

    useEffect(() => {
        const fetchProjectDetails = async () => {
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
                setProject(data.project);
                setSharedUsers(data.allUsers);
                setIsOwner(data.project.user.clerkId === currentUserId);
                setName(data.project.name);
                setDescription(data.project.description);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId, currentUserId]);

    const handleRemoveUser = async (userId) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/share/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to remove user');

            setSharedUsers(sharedUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error removing user:', error);
            alert('Failed to remove user');
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/projects/${projectId}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) throw new Error('Failed to update project');

            const updatedProject = await response.json();
            setProject(updatedProject);
            alert('Project updated successfully');
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project');
        }
    };

    return (
        <div className="flex">
            <div className="w-1/4 p-6 bg-gray-100">
                <button
                    className={`block w-full py-2 px-4 mb-2 rounded ${view === 'projectSettings' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setView('projectSettings')}
                >
                    Project Settings
                </button>
                <button
                    className={`block w-full py-2 px-4 rounded ${view === 'manageAccess' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setView('manageAccess')}
                >
                    Manage Access
                </button>
            </div>
            <div className="w-3/4 p-6">
                {view === 'projectSettings' && (
                    <div className="bg-white">
                        <h2 className="text-2xl font-semibold mb-4">Project Settings</h2>
                        {isOwner && (
                            <form onSubmit={handleUpdateProject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Update
                                </button>
                            </form>
                        )}
                    </div>
                )}
                {view === 'manageAccess' && (
                    <div className="bg-white">
                        <h2 className="text-2xl font-semibold mb-4">Manage Access</h2>
                        <ShareProject projectId={projectId} />
                        <div className="mt-4 space-y-4 border">
                            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
                                <span className="font-medium text-gray-900">{sharedUsers.length} member{sharedUsers.length > 1 ? 's' : ''}</span>
                                <div className="flex space-x-1">
                                </div>
                            </div>
                            <ul>
                                {sharedUsers.map(user => (
                                    <li key={user.id} className="flex items-center justify-between p-4 bg-gray-25 rounded-md mt-2">
                                        <div className="flex items-center">
                                            <img src={user.avatar} alt="User Avatar" className="h-8 w-8 rounded-full ml-4" />
                                            <span className="ml-4 font-medium text-gray-900">{user.username || user.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="font-medium text-gray-500">
                                                {user.role === 'Owner' ? 'Owner' : 'Collaborator'}
                                            </span>
                                            {isOwner && user.role !== 'Owner' && (
                                                <button
                                                    onClick={() => handleRemoveUser(user.id)}
                                                    className="text-gray-800 hover:text-red-500 py-2 px-4 hover:border border-gray-300 rounded"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectSettings;



