'use client'
import React from 'react'
import { useState } from 'react';
import Modal from '../../components/modal';

const Projects = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    return (
        <div>
            <div>
            <button onClick={openModal}>Open Modal</button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
            </Modal>
        </div>
        </div>
    );
}

export default Projects
