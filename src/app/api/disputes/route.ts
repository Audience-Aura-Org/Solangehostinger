import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import Booking from '@/models/Booking';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: Request) {
    const user = await getAuthUser();
    // Disputes can be filed by guests too if they have a confirmation code/email, 
    // but for now let's prioritize logged in users as requested.

    try {
        const { bookingId, subject, reason } = await req.json();

        await connectToDatabase();

        const booking = await Booking.findById(bookingId);
        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

        // If user is logged in, ensure they own the booking
        if (user && booking.clientEmail !== user.email && booking.userId?.toString() !== user.userId) {
            return NextResponse.json({ error: 'Unauthorized to dispute this booking' }, { status: 403 });
        }

        const dispute = await Dispute.create({
            bookingId,
            userId: user?.userId,
            clientEmail: user?.email || booking.clientEmail,
            subject,
            reason,
            status: 'pending'
        });

        return NextResponse.json({ success: true, dispute }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDatabase();
        const disputes = await Dispute.find({
            $or: [
                { userId: user.userId },
                { clientEmail: user.email }
            ]
        }).sort({ createdAt: -1 });

        return NextResponse.json({ disputes });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
