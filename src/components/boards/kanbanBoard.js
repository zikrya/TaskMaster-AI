'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const KanbanBoard = ({ columns, projectId, fetchProjectAndResponses }) => {
    const router = useRouter();
    const [optimisticColumns, setOptimisticColumns] = useState(columns);

    const handleTaskClick = (task) => {
        const url = task.type === 'generated'
            ? `/project/${projectId}/ticket/${task.id}`
            : `/project/${projectId}/ticket/custom-ticket/${task.id}`;
        router.push(url);
    };

    const moveTask = async (task, newStatus) => {
        const newColumns = optimisticColumns.map((column) => {
            if (column.name === newStatus) {
                return { ...column, tasks: [...column.tasks, { ...task, status: newStatus }] };
            }
            return { ...column, tasks: column.tasks.filter((t) => t.id !== task.id) };
        });
        setOptimisticColumns(newColumns);

        const url = task.type === 'generated'
            ? `/api/projects/${projectId}/ticket/${task.id}/status`
            : `/api/projects/${projectId}/ticket/custom-ticket/${task.id}/status`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            fetchProjectAndResponses(); // Sync with server data
        } catch (error) {
            console.error('Error updating task status:', error);
            // Revert optimistic update
            setOptimisticColumns(columns);
            fetchProjectAndResponses(); // Sync with server data
        }
    };

    const Task = ({ task }) => {
        const [, drag] = useDrag(() => ({
            type: 'TASK',
            item: { ...task },
        }));

        return (
            <div
                ref={drag}
                className="bg-white p-4 rounded-md shadow transition-transform duration-200 cursor-pointer transform hover:scale-105"
                onClick={() => handleTaskClick(task)}
            >
                <p className="text-gray-800">{task.title}</p>
            </div>
        );
    };

    const Column = ({ column }) => {
        const [, drop] = useDrop({
            accept: 'TASK',
            drop: (item) => moveTask(item, column.name),
        });

        return (
            <div ref={drop} className="w-1/3 bg-gray-200 p-4 rounded-md shadow-md flex flex-col min-h-[1000px]">
                <h2 className="text-lg font-bold mb-4 text-center">{column.name}</h2>
                <div className="flex-1 space-y-4 overflow-y-auto">
                    {column.tasks.map((task) => (
                        <Task key={task.id} task={task} />
                    ))}
                    {column.tasks.length === 0 && (
                        <p className="text-gray-400 italic">No tasks</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex space-x-4 p-4 overflow-x-auto h-full">
                {optimisticColumns.map((column, index) => (
                    <Column key={index} column={column} />
                ))}
            </div>
        </DndProvider>
    );
};

export default KanbanBoard;
