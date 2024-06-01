import React from 'react';
import { useRouter } from 'next/navigation';

const KanbanBoard = ({ columns, projectId, fetchProjectAndResponses }) => {
    const router = useRouter();

    console.log('KanbanBoard columns:', columns); // Debugging log


    const handleTaskClick = (taskId) => {
        router.push({
            pathname: `/project/${projectId}/ticket/${taskId}`,
            query: { fetchProjectAndResponses: fetchProjectAndResponses.toString() } // Pass function as string
        });
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
                                onClick={() => handleTaskClick(task.id)}
                            >
                                {task.title}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
