import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Enter username or email"
                className="p-2 border rounded-l"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
