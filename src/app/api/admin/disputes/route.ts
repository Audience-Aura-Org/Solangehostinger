import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import { isAdmin } from '@/lib/auth';

export async function GET() {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDatabase();
        // Populate booking details
        const disputes = await Dispute.find()
            .populate('bookingId')
            .sort({ createdAt: -1 });

        return NextResponse.json({ disputes });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDatabase();
        const { id, status, adminNotes } = await request.json();

        const dispute = await Dispute.findByIdAndUpdate(
            id,
            { status, adminNotes },
            { new: true }
        );

        return NextResponse.json({ dispute });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
