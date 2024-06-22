'use client';
import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="flex justify-center mt-4">
            <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by Keyword or by field"
                    className="pl-10 pr-3 py-1 border rounded-md w-full"
                />
            </div>
        </div>
    );
};

export default SearchBar;
