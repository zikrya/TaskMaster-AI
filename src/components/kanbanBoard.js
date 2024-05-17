// src/components/KanbanBoard.js
import React from 'react';

const KanbanBoard = ({ columns }) => {
    console.log("Columns in Kanban Board:", columns); // Log to see how columns are structured

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


