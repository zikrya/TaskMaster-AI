'use client';
import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="flex justify-center mt-4">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets..."
                className="p-1 border rounded-md w-full"
            />
        </div>
    );
};

export default SearchBar;