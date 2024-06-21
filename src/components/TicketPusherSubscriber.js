'use client';
import { useEffect } from 'react';
import Pusher from 'pusher-js';

const PusherSubscriber = ({ projectId, ticketId, onTicketUpdate }) => {
    useEffect(() => {
        const pusher = new Pusher('1c63295fb2f1cc8e8963', {
            cluster: 'us2'
        });

        const channel = pusher.subscribe('project-channel');
        channel.bind('ticket-assigned', (data) => {
            if (data.projectId === projectId && data.ticketId === ticketId) {
                onTicketUpdate(data.ticket);
            }
        });

        channel.bind('custom-ticket-assigned', (data) => {
            if (data.projectId === projectId && data.ticketId === ticketId) {
                onTicketUpdate(data.ticket);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [projectId, ticketId, onTicketUpdate]);

    return null;
};

export default PusherSubscriber;
