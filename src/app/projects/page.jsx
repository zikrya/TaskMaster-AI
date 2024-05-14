'use client'
import React from 'react'
import { useState } from 'react';

const Projects = () => {
    const [input, setInput] = useState('');
    const [description, setDescription] = useState('');

    async function handleSubmit(e) {
        e.preventDefault(); // Prevent the default form submission behavior
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
        <div>
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
    );
}

export default Projects
