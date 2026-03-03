import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Public route — no admin auth needed. Used by the booking page.
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Build the booking document, defaulting optional fields
        const Booking = (await import('@/models/Booking')).default;
        // Normalize addons: allow array of strings or objects
        let addons = [];
        if (Array.isArray(body.addons)) {
            addons = body.addons.map((a: any) => {
                if (!a) return null;
                if (typeof a === 'string') return { id: '', name: a, price: 0 };
                return { id: a.id || a._id || '', name: a.name || a.title || '', price: Number(a.price || 0) };
            }).filter(Boolean);
        } else if (typeof body.addons === 'string' && body.addons.trim()) {
            addons = body.addons.split(',').map((s: string) => ({ id: '', name: s.trim(), price: 0 }));
        }

        const hairColor = typeof body.hairColor === 'string' && body.hairColor.trim() ? body.hairColor.trim() : '';

        const booking = await Booking.create({
            clientName: body.clientName,
            clientEmail: body.clientEmail,
            clientPhone: body.clientPhone,
            service: body.service,
            serviceId: body.serviceId || body.service,
            date: new Date(body.date),
            time: body.time,
            stylist: body.stylist || 'Assigned at salon',
            duration: body.duration || 0,
            price: body.price || 0,
            addons,
            notes: body.notes || '',
            hairColor,
            status: 'confirmed',
            paymentStatus: 'pending',
            paymentMethod: 'pending',
        });

        // Send confirmation email (await so we can record notification status)
        const { sendEmail, getBookingConfirmationHtml, getBookingConfirmationText } = await import('@/lib/email');
        const Notification = (await import('@/models/Notification')).default;

        // calculate envelope from address for debug
        const envelopeFrom = process.env.FROM_EMAIL || process.env.SMTP_USER || 'info@solangesignaturehair.hair';

        // Email to Client (create notification record for delivery status)
        try {
            await sendEmail({
                to: booking.clientEmail,
                subject: 'Reservation Secured — Solange',
                html: getBookingConfirmationHtml(booking),
                text: getBookingConfirmationText(booking),
            });

            await Notification.create({
                bookingId: booking._id,
                clientName: booking.clientName,
                type: 'booking_confirmation',
                status: 'sent',
                message: `Confirmation email sent to ${booking.clientEmail}`
            });
        } catch (err: any) {
            console.error('Failed to send confirmation email to client', err);
            await Notification.create({
                bookingId: booking._id,
                clientName: booking.clientName,
                type: 'booking_confirmation',
                status: 'failed',
                message: `Failed to send confirmation to ${booking.clientEmail}: ${err?.message || String(err)}`
            });
        }

        // Email to Admin (also record a notification entry)
        // prefer explicit ADMIN_FALLBACK_EMAIL so admin notifications are delivered even if SMTP_USER changes
        const adminEmail = process.env.ADMIN_FALLBACK_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || 'solangesignaturehair@gmail.com';
        const adminLink = 'https://solangesignaturehair.hair/admin/bookings';

        try {
            const { getAdminBookingNotificationHtml, getAdminBookingNotificationText } = await import('@/lib/email');
            await sendEmail({
                to: adminEmail,
                subject: `New Booking Notification: ${booking.clientName}`,
                text: getAdminBookingNotificationText(booking, adminLink),
                fromName: 'Maison Digital Portal',
                fromAddress: envelopeFrom,
                html: getAdminBookingNotificationHtml(booking, adminLink),
            });

            await Notification.create({
                bookingId: booking._id,
                clientName: booking.clientName,
                type: 'booking_confirmation',
                status: 'sent',
                message: `Admin notified at ${adminEmail}`
            });
        } catch (err: any) {
            console.error('Failed to send notification email to admin', err);
            await Notification.create({
                bookingId: booking._id,
                clientName: booking.clientName,
                type: 'booking_confirmation',
                status: 'failed',
                message: `Failed to notify admin at ${adminEmail}: ${err?.message || String(err)}`
            });
        }


        return NextResponse.json(
            { booking, confirmationNumber: booking.confirmationNumber, debug: { envelopeFrom } },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
