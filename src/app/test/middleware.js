import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function middleware(request) {
    const token = request.cookies.get('sb:token');  // Make sure the token name matches what Supabase uses
    const { user, error } = await supabase.auth.api.getUser(token);

    if (!user || error) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
