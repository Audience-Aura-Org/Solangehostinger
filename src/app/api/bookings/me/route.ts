import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDatabase();
        // Return bookings where userId matches OR where email matches (in case it wasn't linked yet)
        const bookings = await Booking.find({
            $or: [
                { userId: user.userId },
                { clientEmail: user.email }
            ]
        }).sort({ date: -1 });

        return NextResponse.json({ bookings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
