'use client';
import { useState } from 'react';
import SearchBar from '../../components/SearchBar';

const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (query) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?q=${query}`);
            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            setResults(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Search Users</h1>
            <SearchBar onSearch={handleSearch} />
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

export default SearchPage;
