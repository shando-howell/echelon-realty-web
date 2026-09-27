import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Grab the JWT token from the browser cookies
    const token = request.cookies.get('token')?.value;

    console.log("AGENT ID FROM PROXY:", token);

    // Logic for protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        // If there is no token, boot them back to the login page
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // If they have a token or are visiting a public page, let them through
    return NextResponse.next();
}

// Performance optimization: routes that trigger this middleware
export const config = {
    matcher: [
        // Match all request paths that starts with /agents
        '/dashboard/:path*',
    ],
};