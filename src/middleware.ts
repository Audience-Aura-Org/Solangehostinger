import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all /admin routes except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = request.cookies.get('admin_token')?.value;

        // If no JWT token is found, redirect back to the custom login page
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // In a fully robust scenario, we would verify the JWT signature here.
        // For Next.js edge runtime (which standard jsonwebtoken doesn't support well without jose), 
        // simply checking cookie presence acts as a basic gate before the server-side API fetches re-verify.
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
