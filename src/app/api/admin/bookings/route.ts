import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    try {
        const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_SECRET || process.env.NEXTAUTH_SECRET || 'fallback_secret';
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}

export async function GET(request: Request) {
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const query: Record<string, string> = {};
        if (status && status !== 'all') query.status = status;

        const bookings = await Booking.find(query).sort({ date: -1 }).limit(100);
        return NextResponse.json({ bookings });
    } catch (error: any) {
        console.error('[API] /api/admin/bookings GET error:', error);
        return NextResponse.json({ 
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const body = await request.json();
        const booking = await Booking.create(body);
        return NextResponse.json({ booking }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
