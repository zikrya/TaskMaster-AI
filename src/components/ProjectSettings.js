'use client';
import { useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import ShareProject from './ShareProject';

const ProjectSettings = ({ projectId, fetchProjectAndResponses }) => {
    const { userId: currentUserId } = useAuth();
    const [project, setProject] = useState(null);
    const [sharedUsers, setSharedUsers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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

            const data = await response.json();
            alert(data.message);

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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold">Project Settings</h2>
                {isOwner && (
                    <form onSubmit={handleUpdateProject} className="mb-4">
                        <div className="mb-2">
                            <label className="block font-medium">Project Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="p-2 border rounded w-full"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="p-2 border rounded w-full"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition">
                            Update
                        </button>
                    </form>
                )}
                <h2 className="text-lg font-semibold">Shared Users</h2>
                <ul className="list-disc pl-6">
                    {sharedUsers.map(user => (
                        <li key={user.id} className="flex items-center justify-between">
                            <span>{user.username || user.email} - {user.role}</span>
                            {isOwner && user.role !== 'Owner' && (
                                <button
                                    onClick={() => handleRemoveUser(user.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Remove
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <ShareProject projectId={projectId} />
        </div>
    );
};

export default ProjectSettings;
