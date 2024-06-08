import { useState } from 'react';

const useSearchUsers = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const searchUsers = async (query) => {
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

    return { results, error, isLoading, searchUsers };
};

export default useSearchUsers;
