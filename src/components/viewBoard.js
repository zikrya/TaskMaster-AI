import React from 'react';
import { useRouter } from 'next/navigation';

const ViewBoard = ({ project, fetchProjectAndResponses }) => {
    const router = useRouter();

    const handleTaskClick = (taskId) => {
        const url = `/project/${project.id}/ticket/${taskId}?fetchProjectAndResponses=${fetchProjectAndResponses.toString()}`;
        router.push(url);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{project.name} - View Board</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                {/* Display project details here */}
                <p>{project.description}</p>
                <ul className="mt-4">
                    {project.chatResponses.map(response => (
                        <li
                            key={response.id}
                            className="bg-white p-2 mb-2 rounded-md shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
                            onClick={() => handleTaskClick(response.id)}
                        >
                            <p><strong>{response.status}:</strong> {response.response}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ViewBoard;

