'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const KanbanBoard = ({ columns, projectId, fetchProjectAndResponses }) => {
    const router = useRouter();

    const handleTaskClick = (task) => {
        const url = task.type === 'generated'
            ? `/project/${projectId}/ticket/${task.id}`
            : `/project/${projectId}/ticket/custom-ticket/${task.id}`;
        router.push(url);
    };

    return (
        <div className="flex space-x-4 p-4 overflow-x-auto h-full">
            {columns.map((column, index) => (
                <div key={index} className="w-1/3 bg-gray-200 p-4 rounded-md shadow-md flex flex-col min-h-[1000px]">
                    <h2 className="text-lg font-bold mb-4 text-center">{column.name}</h2>
                    <div className="flex-1 space-y-4 overflow-y-auto">
                        {column.tasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                                onClick={() => handleTaskClick(task)}
                            >
                                <p className="text-gray-800">{task.title}</p>
                            </div>
                        ))}
                        {column.tasks.length === 0 && (
                            <div className="bg-white p-4 rounded-md shadow">
                                <p className="text-gray-400 italic">No tasks</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;