'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/modal';

const Projects = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [prompt, setPrompt] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleProjectNameChange = (e) => setProjectName(e.target.value);
    const handleProjectDescriptionChange = (e) => setProjectDescription(e.target.value);
    const handlePromptChange = (e) => setPrompt(e.target.value);

    async function handleSubmit(e) {
        e.preventDefault();
        // Ensure all fields are filled
        if (!projectName || !projectDescription || !prompt) {
            alert('All fields are required.');
            return;
        }

        try {
            // First create the project
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

            // Then send the prompt to the chat API with the new project ID
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

            // Navigate to the new project page
            closeModal();
            router.push(`/project/${projectData.id}`);
        } catch (error) {
            console.error('Error handling the form submission:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    }


    return (
        <div>
            <h1>Projects</h1>
            <button onClick={openModal}>Create New Project</button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={projectName}
                        onChange={handleProjectNameChange}
                        placeholder="Project Name"
                        required
                    />
                    <textarea
                        value={projectDescription}
                        onChange={handleProjectDescriptionChange}
                        placeholder="Project Description"
                        required
                    />
                    <input
                        type="text"
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Enter a programming language"
                        required
                    />
                    <button type="submit">Create and Describe</button>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
