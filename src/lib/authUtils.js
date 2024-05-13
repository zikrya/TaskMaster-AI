import { supabase } from './supabaseClient';

export async function validateToken(token) {
    const { data: session, error } = await supabase.auth.api.getUser(token);

    if (error) {
        console.error('Error validating token:', error.message);
        return null;
    }

    return session ? session.user : null;
}