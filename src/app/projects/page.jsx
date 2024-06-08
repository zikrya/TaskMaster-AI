'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/modal';
import Link from 'next/link';
import { IconPinnedFilled } from '@tabler/icons-react';

const Projects = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [prompt, setPrompt] = useState('');
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleProjectNameChange = (e) => setProjectName(e.target.value);
    const handleProjectDescriptionChange = (e) => setProjectDescription(e.target.value);
    const handlePromptChange = (e) => setPrompt(e.target.value);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!projectName || !projectDescription || !prompt) {
            alert('All fields are required.');
            return;
        }

        try {
            const projectResponse = await fetch('/api/projects/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: projectName, description: projectDescription })
            });

            if (!projectResponse.ok) {
                const { message } = await projectResponse.json();
                alert(`Failed to create project: ${message}`);
                return;
            }

            const projectData = await projectResponse.json();

            const chatResponse = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: prompt, projectId: projectData.id })
            });

            if (!chatResponse.ok) {
                const { message } = await chatResponse.json();
                alert(`Failed to generate chat response: ${message}`);
                return;
            }

            const chatData = await chatResponse.json();

            closeModal();
            router.push(`/project/${projectData.id}`);
        } catch (error) {
            console.error('Error handling the form submission:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    }

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/projects/user');
                if (!response.ok) throw new Error('Failed to fetch projects');

                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Projects</h1>
            <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Create New Project
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={projectName}
                        onChange={handleProjectNameChange}
                        placeholder="Project Name"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        value={projectDescription}
                        onChange={handleProjectDescriptionChange}
                        placeholder="Project Description"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Project Idea"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        Create and Describe
                    </button>
                </form>
            </Modal>

            <h2 className="text-xl font-semibold mt-8 mb-4">Your Projects</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <li key={project.id} className="flex justify-center">
                        <div className="flex items-center box-border h-32 w-64 p-4 bg-white shadow-md rounded relative">
                            <div className="absolute inset-y-0 left-0 w-4 bg-purple-300 rounded-sm"></div>
                            <img src="./clipboard.png" className="mr-4 mb-8" />
                            <Link href={`/project/${project.id}`}>
                                <div>
                                    <p className="text-base font-semibold text-blue-600">{project.name}</p>
                                    <p className="text-sm font-light text-blue-400">{project.description}</p>
                                </div>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Projects;
