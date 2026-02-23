import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripeClient() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    return new Stripe(key, { apiVersion: '2025-02-24.acacia' as any });
}

export async function POST(request: Request) {
    try {
        const { bookingId, price, clientEmail, serviceName } = await request.json();

        const stripe = getStripeClient();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: clientEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Solange Reservation - ${serviceName}`,
                            description: 'Secure your session at La Maison de Beauté',
                        },
                        unit_amount: price * 100, // Price in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking`,
            metadata: {
                bookingId,
            },
        });

        // Update booking with session ID
        const Booking = (await import('@/models/Booking')).default;
        await Booking.findByIdAndUpdate(bookingId, { stripeSessionId: session.id });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
