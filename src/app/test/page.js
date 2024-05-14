'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

const Test = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/login');
        } else {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div>
            <h1>Test Page</h1>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default Test;
