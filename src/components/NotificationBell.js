'use client';
import React, { useEffect, useState, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const modalRef = useRef(null);

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

    const handleNotificationClick = async (notification) => {
        setIsOpen(false);
        try {
            await fetch(`/api/notification/${notification.id}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            router.push(notification.url);
            setNotifications(notifications.map(n =>
                n.id === notification.id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
                <div ref={modalRef} className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                    <div className="p-4">
                        <h2 className="text-lg font-bold">Notifications</h2>
                        {notifications.length === 0 ? (
                            <p className="text-gray-500">No new notifications</p>
                        ) : (
                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification.id}
                                        className={`p-2 rounded-md cursor-pointer ${notification.read ? 'bg-gray-100' : 'bg-yellow-100'}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
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
