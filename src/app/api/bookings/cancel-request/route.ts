import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Notification from '@/models/Notification';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        await connectToDatabase();
        const { bookingId } = await request.json();

        const booking = await Booking.findOne({ _id: bookingId, userId: decoded.id });
        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

        // Create notification for admin
        await Notification.create({
            bookingId: booking._id,
            clientName: booking.clientName,
            type: 'cancellation_request',
            status: 'pending',
            message: `User ${booking.clientName} requested cancellation for booking ${booking.confirmationNumber}`
        });

        return NextResponse.json({ message: 'Request submitted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
