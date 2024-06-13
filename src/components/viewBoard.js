'use client'
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
            <header className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold">Project Board</h1>
                {/* Add any header actions or buttons here */}
            </header>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="py-2 px-4 border-r border-gray-300 text-left">Title</th>
                        <th className="py-2 px-4 border-r border-gray-300 text-left">Assignees</th>
                        <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {project.chatResponses.map((response, index) => (
                        <tr
                            key={response.id}
                            className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300"
                            onClick={() => handleTaskClick(response.id)}
                        >
                            <td className="py-2 px-4 border-r border-gray-300">{`${index + 1}. ${response.response}`}</td>
                            <td className="py-2 px-4 border-r border-gray-300">{response.assignee}</td>
                            <td className="py-2 px-4">{response.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewBoard;
