'use client';
import { useEffect } from 'react';
import Pusher from 'pusher-js';

const PusherSubscriber = ({ projectId, ticketId, onTicketUpdate, onTicketAssigned }) => {
    useEffect(() => {
        const pusher = new Pusher('1c63295fb2f1cc8e8963', {
            cluster: 'us2'
        });

        const channel = pusher.subscribe('project-channel');
        const handleTicketAssigned = (data) => {
            if (data.projectId === projectId) {
                if (ticketId && data.ticketId === ticketId) {
                    // If ticketId is provided and matches, call onTicketUpdate
                    onTicketUpdate(data.ticket);
                } else if (!ticketId && onTicketAssigned) {
                    // If ticketId is not provided, call onTicketAssigned for project-level updates
                    onTicketAssigned(data);
                }
            }
        };

        channel.bind('ticket-assigned', handleTicketAssigned);
        channel.bind('custom-ticket-assigned', handleTicketAssigned);

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [projectId, ticketId, onTicketUpdate, onTicketAssigned]);

    return null;
};

export default PusherSubscriber;
