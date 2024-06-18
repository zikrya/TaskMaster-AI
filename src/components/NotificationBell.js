'use client';
import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notification');
                const data = await response.json();
                setNotifications(data);
                console.log('Fetched notifications:', data); // Log fetched notifications
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="relative">
            <button
                className="relative focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <BellIcon className="h-6 w-6 text-white" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                    <div className="p-4">
                        <h2 className="text-lg font-bold">Notifications</h2>
                        {notifications.length === 0 ? (
                            <p className="text-gray-500">No new notifications</p>
                        ) : (
                            <ul className="space-y-2">
                                {notifications.map((notification) => (
                                    <li key={notification.id} className="p-2 bg-gray-100 rounded-md">
                                        {notification.message}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
