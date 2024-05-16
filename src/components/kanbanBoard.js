import React from 'react';

const KanbanBoard = () => {
  const columns = [
    {
      name: 'To Do',
      tasks: ['Task 1', 'Task 2', 'Task 3'],
    },
    {
      name: 'In Progress',
      tasks: ['Task 4', 'Task 5'],
    },
    {
      name: 'Done',
      tasks: ['Task 6'],
    },
  ];

  return (
    <div className="flex space-x-4 p-4">
      {columns.map((column, index) => (
        <div key={index} className="w-1/3 bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-bold mb-4">{column.name}</h2>
          <div className="space-y-2">
            {column.tasks.map((task, idx) => (
              <div key={idx} className="bg-white p-4 rounded-md shadow-md">
                {task}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
