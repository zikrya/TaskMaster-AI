'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/modal';
import Link from 'next/link';
import { AiOutlineFundProjectionScreen, AiOutlineUserAdd } from "react-icons/ai";
import { HiUserAdd } from "react-icons/hi";
import ReactLoading from 'react-loading';

// Utility function to truncate text
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + '...';
};

const SkeletonCard = () => (
    <div className="flex-none w-64 animate-pulse">
        <div className="box-border h-48 w-full p-4 bg-gray-200 shadow-md rounded relative">
            <div className="h-6 bg-gray-300 mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-300 mb-2 w-5/6"></div>
            <div className="h-4 bg-gray-300 mb-2 w-4/5"></div>
        </div>
    </div>
);

const Projects = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [prompt, setPrompt] = useState('');
    const [ownedProjects, setOwnedProjects] = useState([]);
    const [sharedProjects, setSharedProjects] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading bar
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
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
            setError(null);
            setIsFetching(true);

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
                setIsFetching(false);
            }
        };

        fetchProjects();
    }, []);

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
                {isFetching && !error ? (
                    Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} />)
                ) : ownedProjects.length === 0 ? (
                    <div className="text-center w-full">You don't have any projects yet.</div>
                ) : (
                    ownedProjects.map((project) => (
                        <div key={project.id} className="flex-none w-64">
                            <div className="box-border h-48 w-full p-4 bg-gray-200 shadow-md rounded relative">
                                <Link href={`/project/${project.id}`}>
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-black text-xl">{project.name}</p>
                                        <AiOutlineFundProjectionScreen size={48} className="text-gray-500" />
                                    </div>
                                    <div className=" flex-grow">
                                        <p className="text-md font-light text-[#4d4cd0] overflow-hidden">{truncateText(project.description, 100)}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <h2 className="text-xl font-semibold mt-8 mb-4">Shared Projects</h2>
            <div className="flex overflow-x-scroll space-x-8 p-2 mt-5">
                {isFetching && !error ? (
                    Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} />)
                ) : sharedProjects.length === 0 ? (
                    <div className="text-center w-full text-xl text-[#4d4cd0]">You don't have any shared projects yet.</div>
                ) : (
                    sharedProjects.map((project) => (
                        <div key={project.id} className="flex-none w-64 relative">
                            <div className="box-border h-48 w-full p-4 bg-gray-200 shadow-md rounded relative">
                                <Link href={`/project/${project.id}`}>
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-black text-xl">{project.name}</p>
                                        <AiOutlineFundProjectionScreen size={48} className="text-gray-500" />
                                    </div>
                                    <div className=" flex-grow">
                                        <p className="text-md font-light text-[#4d4cd0] overflow-hidden">{truncateText(project.description, 100)}</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="absolute -top-2 -right-3 bg-[#4d4cd0] rounded-full p-1 shadow-lg">
                                <HiUserAdd size={24} className="text-black" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Projects;
