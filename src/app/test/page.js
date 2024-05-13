'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const Test = () => {
    const router = useRouter();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                router.push('/login');
            }
        });

        console.log(authListener);

        return () => {
            if (authListener && authListener.subscription && authListener.subscription.unsubscribe) {
                authListener.subscription.unsubscribe();
            }
        };
    }, [router]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            router.push('/login');
        }
    };

    return (
        <div>
            <h1>Test Page</h1>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}

export default Test;
