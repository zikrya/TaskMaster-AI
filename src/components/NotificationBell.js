'use client';
import React, { useEffect, useState, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';
import { useAuth } from '@clerk/nextjs';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const modalRef = useRef(null);
    const { isSignedIn } = useAuth();

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notification');
            const data = await response.json();
            setNotifications(Array.isArray(data) ? data : []);
            console.log('Fetched notifications:', data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (isSignedIn) {
            fetchNotifications();
        }

        const pusher = new Pusher('1c63295fb2f1cc8e8963', {
            cluster: 'us2'
        });

        const channel = pusher.subscribe('notifications');
        channel.bind('new-notification', (data) => {
            setNotifications(prevNotifications => {
                const notificationsArray = Array.isArray(prevNotifications) ? prevNotifications : [];
                return [data, ...notificationsArray];
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [isSignedIn]);

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

    const unreadCount = notifications.filter(notification => !notification.read).length;

    return (
        <div className="relative flex items-center">
            <button
                className="relative focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <BellIcon className="h-6 w-6 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute bottom-4 left-3 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div ref={modalRef} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        {notifications.length === 0 ? (
                            <p className="text-gray-500">No new notifications</p>
                        ) : (
                            <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                                {notifications.map((notification, index) => (
                                    <li
                                        key={notification.id}
                                        className={`p-3 flex justify-between items-start cursor-pointer ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div>
                                            <span className="block text-sm font-medium text-gray-700">{index + 1}. {notification.message}</span>
                                            <span className={`block text-xs ${notification.read ? 'text-gray-500' : 'text-blue-500'}`}>
                                                {notification.read ? 'Read' : 'Unread'}
                                            </span>
                                        </div>
                                        {!notification.read && (
                                            <span className="ml-2 h-3 w-3 bg-blue-500 rounded-full"></span>
                                        )}
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

