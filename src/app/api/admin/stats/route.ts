import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
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
        const [totalBookings, confirmedBookings, completedBookings, cancelledBookings, pendingBookings, totalClients] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'confirmed' }),
            Booking.countDocuments({ status: 'completed' }),
            Booking.countDocuments({ status: 'cancelled' }),
            Booking.countDocuments({ status: 'confirmed' }),
            User.countDocuments({ role: 'client' }),
        ]);

        // Revenue: sum of completed bookings
        const revenueResult = await Booking.aggregate([
            { $match: { status: 'completed', paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$price' } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Recent bookings
        const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

        return NextResponse.json({
            stats: { totalBookings, confirmedBookings, completedBookings, cancelledBookings, pendingBookings, totalClients, totalRevenue },
            recentBookings,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
