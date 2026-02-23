import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    const { clientName, clientEmail, clientPhone, service, serviceId, date, time, stylist, duration, price, paymentMethod } = body;

    if (!clientName || !clientEmail || !clientPhone || !service || !date || !time || !stylist) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await Booking.create({
      clientName,
      clientEmail,
      clientPhone,
      service,
      serviceId,
      date: new Date(date),
      time,
      stylist,
      duration: duration || 240,
      price: price || 200,
      paymentMethod: paymentMethod || 'pending',
      paymentStatus: 'pending',
      status: 'confirmed',
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check admin auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await Booking.find({}).sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
