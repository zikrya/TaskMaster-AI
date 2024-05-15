'use client'
import { useState } from 'react';

export default function Modal({ children, isOpen, onClose }) {
    if (!isOpen) return null;

    const [input, setInput] = useState('');
    const [description, setDescription] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: input }) // Send user input as JSON
            });
            const data = await response.json();
            setDescription(data.message); // Update the description with the API response
        } catch (error) {
            console.error('Failed to fetch the description:', error);
            setDescription('Error fetching description.');
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={onClose}>Close</button>
                {children}
                <h1>Find Out How a Programming Language Works</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter a programming language"
                />
                <button type="submit">Describe</button>
            </form>
            <p><strong>Description:</strong> {description}</p>
            </div>
            <style jsx>{`
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1001;
                }
            `}</style>
        </div>
    );
}
