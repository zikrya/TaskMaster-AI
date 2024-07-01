'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/modal';
import Link from 'next/link';
import Image from 'next/image';
import ImageClerk from '../../components/ImageClerk';
import ReactLoading from 'react-loading';

const Projects = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [prompt, setPrompt] = useState('');
    const [ownedProjects, setOwnedProjects] = useState([]);
    const [sharedProjects, setSharedProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading bar
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

        setIsSubmitting(true); // Show loading bar

        try {
            const projectResponse = await fetch('/api/projects/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: projectName, description: projectDescription })
            });

            if (!projectResponse.ok) {
                const { message } = await projectResponse.json();
                alert(`Failed to create project: ${message}`);
                setIsSubmitting(false); // Hide loading bar
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
                setIsSubmitting(false); // Hide loading bar
                return;
            }

            const chatData = await chatResponse.json();

            closeModal();
            router.push(`/project/${projectData.id}`);
        } catch (error) {
            console.error('Error handling the form submission:', error);
            alert('An unexpected error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false); // Hide loading bar
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
                setOwnedProjects(data.ownedProjects);
                setSharedProjects(data.sharedProjects);
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Work</h1>
                <button onClick={openModal} className="bg-white text-gray-400 px-4 py-2 rounded hover:bg-gray-100 transition">
                    New Project
                </button>
            </div>
            <div className="border-t border-gray-300"></div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2 className="text-xl font-semibold mb-4 text-[#7a79ea]">New Project</h2>
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
                    <button type="submit" className="bg-[#7a79ea] text-white px-4 py-2 rounded hover:bg-indigo-200 transition" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ReactLoading type="spin" color="#ffffff" height={24} width={24} className="mx-auto" />
                        ) : (
                            'Generate Project'
                        )}
                    </button>
                </form>
            </Modal>

            <h2 className="text-xl font-semibold mt-8 mb-4">My Projects</h2>
            <div className="flex overflow-x-scroll space-x-4 p-2">
                {ownedProjects.map((project) => (
                    <div key={project.id} className="flex-none w-64">
                        <div className="flex items-center box-border h-32 w-full p-4 bg-white shadow-md rounded relative">
                            <div className="absolute inset-y-0 left-0 w-4 bg-[#7a79ea] rounded-sm"></div>
                            <Image src="/clipboard.png" lt="Icon" width={24} height={24} className="absolute left-[4px] top-[1px]" />
                            <Link href={`/project/${project.id}`}>
                                <div className="ml-8">
                                    <p className="text-base font-semibold text-[#7a79ea]">{project.name}</p>
                                    <p className="text-sm font-light text-[#4d4cd0]">{project.description}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="text-xl font-semibold mt-8 mb-4">Shared Projects</h2>
            <div className="flex overflow-x-scroll space-x-4 p-2">
                {sharedProjects.map((project) => (
                    <div key={project.id} className="flex-none w-64">
                        <div className="flex items-center box-border h-32 w-full p-4 bg-white shadow-md rounded relative">
                            <div className="absolute inset-y-0 left-0 w-4 bg-[#7a79ea] rounded-sm"></div>
                            <Image src="/clipboard.png" lt="Icon" width={24} height={24} className="absolute left-[4px] top-[1px]" />
                            <Link href={`/project/${project.id}`}>
                                <div className="ml-8">
                                    <p className="text-base font-semibold text-blue-600">{project.name}</p>
                                    <p className="text-sm font-light text-blue-400">{project.description}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
