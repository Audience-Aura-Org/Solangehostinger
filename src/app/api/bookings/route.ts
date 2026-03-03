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
            await sendEmail({
                to: adminEmail,
                subject: `New Booking Arcive: ${booking.clientName} - ${booking.confirmationNumber}`,
                text: `New booking from ${booking.clientName} (${booking.clientEmail}) - ${booking.confirmationNumber}\nService: ${booking.service} - ${new Date(booking.date).toLocaleDateString()} ${booking.time}\nManage: ${adminLink}`,
                fromName: 'Maison Digital Portal',
                fromAddress: envelopeFrom,
                html: `
                    <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #C5A059; padding: 40px; background: #fff;">
                        <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
                            <h1 style="color: #C5A059; letter-spacing: 0.2em; margin: 0;">SOLANGE</h1>
                            <p style="font-size: 10px; color: #8A8070; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 5px;">Maison de Beauté — Notification</p>
                        </div>

                        <h2 style="font-weight: normal; font-size: 20px; border-left: 3px solid #C5A059; padding-left: 15px; margin-bottom: 25px;">New Reservation Received</h2>
                        
                        <div style="background: #fdfbf7; padding: 25px; border: 1px solid #eee; margin-bottom: 30px;">
                            <table width="100%" style="font-size: 13px; border-collapse: collapse;">
                                <tr><td style="padding: 8px 0; color: #8A8070; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em;">Reference</td><td style="padding: 8px 0; font-family: monospace; font-weight: bold; color: #C5A059;">#${booking.confirmationNumber}</td></tr>
                                <tr><td style="padding: 8px 0; color: #8A8070; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em;">Client</td><td style="padding: 8px 0; font-weight: bold;">${booking.clientName}</td></tr>
                                <tr><td style="padding: 8px 0; color: #8A8070; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em;">Contact</td><td style="padding: 8px 0;">${booking.clientEmail} <br/> ${booking.clientPhone}</td></tr>
                                <tr><td style="padding: 8px 0; color: #8A8070; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em;">Service</td><td style="padding: 8px 0; font-weight: bold;">${booking.service}</td></tr>
                                <tr><td style="padding: 8px 0; color: #8A8070; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em;">Schedule</td><td style="padding: 8px 0;">${new Date(booking.date).toLocaleDateString()} at ${booking.time}</td></tr>
                                <tr><td style="padding: 8px 0; color: #8A8070; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em;">Investment</td><td style="padding: 8px 0; font-weight: bold;">$${booking.price}</td></tr>
                                <tr><td style="padding: 8px 0; color: #8A8070; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em;">Hair Color</td><td style="padding: 8px 0; color: #C5A059; font-style: italic;">${booking.hairColor || 'No selection'}</td></tr>
                            </table>
                        </div>

                        <div style="text-align: center;">
                            <a href="${adminLink}" style="display: inline-block; background: #C5A059; color: #fff; text-decoration: none; padding: 15px 40px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold;">Manage Reservations</a>
                        </div>
                        
                        <p style="text-align: center; color: #999; font-size: 10px; margin-top: 40px;">This notification was generated by the Solange Maison Portal.</p>
                    </div>
                `,
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
