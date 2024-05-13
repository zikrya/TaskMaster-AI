import { NextResponse } from 'next/server';
import { validateToken } from '@/lib/authUtils';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];

    if (protectedRoutes.includes(pathname)) {
        const token = request.cookies.get('sb:token');
        const user = await validateToken(token);

        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}