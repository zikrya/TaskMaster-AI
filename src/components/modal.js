'use client'
import { useState } from 'react';

export default function Modal({ children, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}
