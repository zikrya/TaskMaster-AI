import { useState } from 'react';
import useSearchUsers from '../hooks/useSearchUsers';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const { results, error, isLoading, searchUsers } = useSearchUsers();

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        searchUsers(query);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Search Users</h1>
            <form onSubmit={handleSubmit} className="flex items-center mb-4">
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
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <ul>
                {results.map((user) => (
                    <li key={user.id}>
                        <p>{user.username} - {user.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;

