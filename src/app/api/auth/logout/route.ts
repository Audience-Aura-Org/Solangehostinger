import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set('admin_token', '', { expires: new Date(0), httpOnly: true, path: '/' });
    return response;
}
