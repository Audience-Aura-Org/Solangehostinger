import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendEmail, getReminderHtml, getReminderText } from '@/lib/email';

export async function GET(request: Request) {
    // Basic security check (could be a secret token in header)
    const { searchParams } = new URL(request.url);
    const cronToken = searchParams.get('token');
    if (process.env.CRON_TOKEN && cronToken !== process.env.CRON_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const now = new Date();
        const bookings = await Booking.find({
            status: 'confirmed',
            $or: [{ reminder2hSent: false }, { reminder30mSent: false }]
        });

        const results = {
            processed: 0,
            remindersSent: 0,
            errors: [] as string[]
        };

        for (const booking of bookings) {
            results.processed++;

            // Combine date and time string to get actual appointment date
            const apptDate = new Date(booking.date);
            const timeStr = booking.time; // e.g. "2:00 PM"
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            apptDate.setHours(hours, minutes, 0, 0);

            const diffMs = apptDate.getTime() - now.getTime();
            const diffMin = diffMs / (1000 * 60);

            // 2 Hour Reminder (send if between 1.5h and 2.5h)
            if (diffMin > 0 && diffMin <= 125 && diffMin > 115 && !booking.reminder2hSent) {
                const Notification = (await import('@/models/Notification')).default;
                try {
                    await sendEmail({
                        to: booking.clientEmail,
                        subject: 'Upcoming Session Reminder — Solange',
                        html: getReminderHtml(booking, '2 hours'),
                        text: getReminderText(booking, '2 hours'),
                    });

                    booking.reminder2hSent = true;
                    await booking.save();

                    await Notification.create({
                        bookingId: booking._id,
                        clientName: booking.clientName,
                        type: 'reminder_2h',
                        status: 'sent',
                        message: `2-hour reminder sent to ${booking.clientEmail}`
                    });

                    results.remindersSent++;
                } catch (err: any) {
                    await Notification.create({
                        bookingId: booking._id,
                        clientName: booking.clientName,
                        type: 'reminder_2h',
                        status: 'failed',
                        message: `Failed to send 2-hour reminder to ${booking.clientEmail}: ${err?.message || String(err)}`
                    });
                    results.errors.push(`Failed reminder_2h for ${booking._id}: ${err?.message || String(err)}`);
                }
            }

            // 30 Min Reminder (send if between 20m and 40m)
            if (diffMin > 0 && diffMin <= 40 && diffMin > 20 && !booking.reminder30mSent) {
                const Notification = (await import('@/models/Notification')).default;
                try {
                    await sendEmail({
                        to: booking.clientEmail,
                        subject: 'Your Session Starts Soon — Solange',
                        html: getReminderHtml(booking, '30 minutes'),
                        text: getReminderText(booking, '30 minutes'),
                    });

                    booking.reminder30mSent = true;
                    await booking.save();

                    await Notification.create({
                        bookingId: booking._id,
                        clientName: booking.clientName,
                        type: 'reminder_30m',
                        status: 'sent',
                        message: `30-minute reminder sent to ${booking.clientEmail}`
                    });

                    results.remindersSent++;
                } catch (err: any) {
                    await Notification.create({
                        bookingId: booking._id,
                        clientName: booking.clientName,
                        type: 'reminder_30m',
                        status: 'failed',
                        message: `Failed to send 30-minute reminder to ${booking.clientEmail}: ${err?.message || String(err)}`
                    });
                    results.errors.push(`Failed reminder_30m for ${booking._id}: ${err?.message || String(err)}`);
                }
            }
        }

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
