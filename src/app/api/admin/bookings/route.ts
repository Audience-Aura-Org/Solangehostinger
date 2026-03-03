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
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search')?.trim() || '';
        const limit = 10;
        const skip = (page - 1) * limit;

        const query: any = {};
        if (status && status !== 'all') {
            if (status === 'upcoming') {
                // Bookings for today or future
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                query.date = { $gte: today };
                query.status = 'confirmed';
            } else {
                query.status = status;
            }
        }

        // server-side search across important fields
        if (search) {
            const re = new RegExp(search, 'i');
            query.$or = [
                { clientName: re },
                { clientEmail: re },
                { confirmationNumber: re }
            ];
        }

        const total = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            bookings,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
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
