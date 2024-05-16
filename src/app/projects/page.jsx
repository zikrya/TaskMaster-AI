'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/modal';

const Projects = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const router = useRouter();

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleProjectNameChange = (e) => setProjectName(e.target.value);
    const handleProjectDescriptionChange = (e) => setProjectDescription(e.target.value);

    const handleSubmit = async () => {
        // Ensure both fields are filled
        if (!projectName || !projectDescription) {
          alert('Both project name and description are required.');
          return;
        }

        try {
          const response = await fetch('/api/projects/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: projectName, description: projectDescription }),
          });

          if (response.ok) {
            const data = await response.json();
            closeModal();
            router.push(`/project/${data.id}`);
          } else {
            const { message } = await response.json();
            alert(`Failed to create project: ${message}`);
          }
        } catch (error) {
          console.error('Error creating project:', error);
          alert('An unexpected error occurred. Please try again later.');
        }
      };
    return (
        <div>
            <h1>Projects</h1>
            <button onClick={openModal}>Create New Project</button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Create New Project</h2>
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
                <button onClick={handleSubmit}>Submit</button>
            </Modal>
        </div>
    );
};

export default Projects;
