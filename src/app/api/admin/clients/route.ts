import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    try {
        jwt.verify(token, process.env.ADMIN_SECRET || 'fallback_secret');
        return true;
    } catch {
        return false;
    }
}

export async function GET() {
    if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        await connectToDatabase();

        // 1. Get all registered clients
        const registeredClients = await User.find({ role: 'client' }, { password: 0 }).lean();

        // 2. Get unique clients from bookings who are NOT registered
        const Booking = (await import('@/models/Booking')).default;
        const guestEmails = await Booking.distinct('clientEmail', { userId: { $exists: false } });

        const guestClients = [];
        for (const email of guestEmails) {
            // Find the most recent booking for this guest to get their name
            const latestBooking = await Booking.findOne({ clientEmail: email }).sort({ createdAt: -1 });
            if (latestBooking) {
                guestClients.push({
                    _id: `guest-${latestBooking._id}`,
                    name: latestBooking.clientName,
                    email: latestBooking.clientEmail,
                    phone: latestBooking.clientPhone,
                    role: 'guest',
                    createdAt: latestBooking.createdAt
                });
            }
        }

        const combined = [...registeredClients, ...guestClients].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({ clients: combined });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        await connectToDatabase();
        const { id } = await request.json();
        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Client deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
