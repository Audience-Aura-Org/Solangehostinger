import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Stripe from 'stripe';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

function getStripeClient() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    return new Stripe(key, { apiVersion: '2025-01-27-preview' as any });
}

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

export async function POST(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const { id } = await params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (!booking.stripeSessionId) {
            return NextResponse.json({ error: 'No Stripe session found for this booking' }, { status: 400 });
        }

        // Retrieve the session to find the payment intent
        const stripe = getStripeClient();
        const session = await stripe.checkout.sessions.retrieve(booking.stripeSessionId as string);
        if (!session.payment_intent) {
            return NextResponse.json({ error: 'No payment intent found' }, { status: 400 });
        }

        // Perform the refund
        const refund = await stripe.refunds.create({
            payment_intent: session.payment_intent as string,
        });

        // Update booking status
        booking.paymentStatus = 'refunded';
        booking.status = 'cancelled';
        await booking.save();

        return NextResponse.json({ message: 'Refund successful', refund });
    } catch (error: any) {
        console.error('Refund error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
