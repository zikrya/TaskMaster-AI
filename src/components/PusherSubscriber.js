'use client';
import { useEffect } from 'react';
import Pusher from 'pusher-js';

const PusherSubscriber = ({ projectId, ticketId, onTicketUpdate, onTicketAssigned, onStatusUpdate }) => {
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

        const handleStatusUpdate = (data) => {
            if (data.projectId === projectId) {
                if (ticketId && data.ticketId === ticketId) {
                    // If ticketId is provided and matches, call onTicketUpdate
                    onTicketUpdate(data.ticket);
                } else if (!ticketId && onStatusUpdate) {
                    // If ticketId is not provided, call onStatusUpdate for project-level updates
                    onStatusUpdate(data);
                }
            }
        };

        channel.bind('ticket-assigned', handleTicketAssigned);
        channel.bind('custom-ticket-assigned', handleTicketAssigned);
        channel.bind('ticket-status-updated', handleStatusUpdate);
        channel.bind('custom-ticket-status-updated', handleStatusUpdate);

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [projectId, ticketId, onTicketUpdate, onTicketAssigned, onStatusUpdate]);

    return null;
};

export default PusherSubscriber;
