'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const TicketPage = ({ params }) => {
    const router = useRouter();
    const { projectId, ticketId } = params;
    const [ticket, setTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/projects/${projectId}/ticket/${ticketId}`);
                if (!response.ok) throw new Error('Failed to fetch ticket');

                const data = await response.json();
                setTicket(data);
            } catch (error) {
                console.error('Error fetching ticket:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicket();
    }, [projectId, ticketId]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!ticket) return <div>Ticket not found</div>;

    return (
        <div>
            <h1>Ticket {ticketId}</h1>
            <p>{ticket.response}</p>
        </div>
    );
};

export default TicketPage;
