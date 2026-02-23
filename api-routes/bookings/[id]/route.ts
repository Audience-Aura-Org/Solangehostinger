import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    // Check admin auth
    const authHeader = request.headers.get('authorization');
    const ADMIN_API_SECRET = process.env.ADMIN_SECRET || process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    if (!authHeader || authHeader !== `Bearer ${ADMIN_API_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const booking = await Booking.findByIdAndUpdate(id, body, { new: true });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
