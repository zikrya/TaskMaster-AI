'use client';
import { useEffect } from 'react';
import Pusher from 'pusher-js';

const PusherSubscriber = ({ projectId, onTicketAssigned }) => {
    useEffect(() => {
        const pusher = new Pusher('1c63295fb2f1cc8e8963', {
            cluster: 'us2'
        });

        const channel = pusher.subscribe('project-channel');
        channel.bind('ticket-assigned', (data) => {
            if (data.projectId === projectId) {
                onTicketAssigned(data);
            }
        });

        channel.bind('custom-ticket-assigned', (data) => {
            if (data.projectId === projectId) {
                onTicketAssigned(data);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [projectId, onTicketAssigned]);

    return null;
};

export default PusherSubscriber;
