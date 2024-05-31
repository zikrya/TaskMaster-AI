import React from 'react';
import { useRouter } from 'next/navigation';

const KanbanBoard = ({ columns, projectId }) => {
    const router = useRouter();

    const handleTaskClick = (taskId) => {
        router.push(`/project/${projectId}/ticket/${taskId}`);
    };

    return (
        <div className="flex space-x-4 p-4">
            {columns.map((column, index) => (
                <div key={index} className="w-1/3 bg-gray-100 p-4 rounded-md">
                    <h2 className="text-lg font-bold mb-4">{column.name}</h2>
                    <div className="space-y-2">
                        {column.tasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-white p-4 rounded-md shadow-md cursor-pointer"
                                onClick={() => handleTaskClick(task.id)} // Using the correct task ID
                            >
                                {task.title} {/* Displaying the task title */}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
