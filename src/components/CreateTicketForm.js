import { useState } from 'react';
import Modal from './modal';

const CreateTicketForm = ({ projectId, userId, fetchProjectAndResponses }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/projects/${projectId}/ticket/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          projectId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const newTicket = await response.json();
      setTitle('');
      setDescription('');
      fetchProjectAndResponses(); // Fetch updated project data
    } catch (error) {
      console.error('Failed to create ticket', error);
    }
  };

  return (
    <div>
      <button onClick={openModal} className="bg-white text-gray-400 px-4 py-2 rounded hover:bg-gray-100 transition">
        New Ticket
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
      <h2 className="text-xl font-semibold mb-4">New Ticket</h2>
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-[#7a79ea] text-white rounded-md hover:bg-blue-600"
      >
        Create Ticket
      </button>
    </form>
    </Modal>
    </div>
  );
};

export default CreateTicketForm;
