import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || process.env.NEXT_PUBLIC_SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || process.env.NEXT_PUBLIC_SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.SMTP_USERNAME;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASSWORD;
const smtpSecure = (process.env.EMAIL_SECURE === 'true') || smtpPort === 465;

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});

// Centralized color tokens for email templates — makes theme updates easier
const EMAIL_COLORS = {
    text: '#080808',
    accent: '#C5A059',
    muted: '#8A8070',
    white: '#ffffff',
    border: '#eeeeee',
    highlight: '#fdfbf7',
    secondaryText: '#404040',
    smallText: '#5A5248',
    reminderBg: '#fff9f0',
};

export async function sendEmail({
    to,
    subject,
    html,
    text,
    fromName = 'Solange',
    fromAddress,
}: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    fromName?: string;
    fromAddress?: string;
}) {
    if (!smtpUser || !smtpPass) {
        throw new Error('SMTP credentials not set (SMTP_USER / SMTP_PASS)');
    }

    // allow caller to override the from address, otherwise use smtpUser
    const envelopeFrom = fromAddress || process.env.EMAIL_FROM || smtpUser;

    const mailOptions: any = {
        from: `"${fromName}" <${envelopeFrom}>`,
        to,
        subject,
        html,
    };

    if (text) mailOptions.text = text;

    // debug output so we can confirm which address is used when sending
    console.log(`Sending email from ${envelopeFrom} (name: ${fromName}) to ${to} subject: ${subject}`);

    // Let errors propagate so callers can handle and mark notifications as failed
    return transporter.sendMail(mailOptions);
}

// Shared header/footer for consistent branding in emails
function renderHeader() {
    return `
        <table role="presentation" width="100%" style="max-width:600px;margin:auto;border-collapse:collapse;font-family: serif;color:${EMAIL_COLORS.text}">
            <tr>
                <td style="padding:24px 0;text-align:center">
                    <h2 style="margin:0;color:${EMAIL_COLORS.accent};letter-spacing:0.2em">SOLANGE</h2>
                    <p style="margin:6px 0 0 0;font-size:11px;text-transform:uppercase;color:${EMAIL_COLORS.muted};letter-spacing:0.2em">La Maison de Beauté</p>
                </td>
            </tr>
            <tr><td><div style="height:8px"></div></td></tr>
        </table>
    `;
}

function renderFooter() {
    return `
        <table role="presentation" width="100%" style="max-width:600px;margin:auto;border-collapse:collapse;font-family: serif;color:${EMAIL_COLORS.text}">
            <tr><td style="padding:20px 0 6px 0;border-top:1px solid ${EMAIL_COLORS.border}"></td></tr>
            <tr>
                <td style="text-align:center;font-size:11px;color:${EMAIL_COLORS.muted};padding:6px 0">8150 LAKECREST DR, GREENBELT, MD 20770<br/>+1 301 454 9435 • info@solangesignaturehair.hair</td>
            </tr>
        </table>
    `;
}

export function getBookingConfirmationHtml(booking: any) {
    return `
                <!doctype html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                        body { background: ${EMAIL_COLORS.white}; margin: 0; padding: 0; }
                        .container { max-width:600px; margin:auto; font-family: serif; color:${EMAIL_COLORS.text}; padding:20px; }
                        .card { background:${EMAIL_COLORS.white}; border:1px solid ${EMAIL_COLORS.border}; padding:20px; }
                        .muted { color:${EMAIL_COLORS.muted}; font-size:11px; text-transform:uppercase; letter-spacing:0.15em; }
                        .accent { color:${EMAIL_COLORS.accent}; }
                        @media (max-width:480px){ .container{padding:12px} .card{padding:12px} }
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${renderHeader()}
                        <div class="card">
                            <h2 style="margin-top:0" class="accent">Reservation Secured.</h2>
                            <p>Dear ${booking.clientName},</p>
                            <p>Your appointment has been entered into our ledger. We look forward to welcoming you.</p>
                            <div style="background:${EMAIL_COLORS.highlight};padding:16px;border:1px solid ${EMAIL_COLORS.border};margin:18px 0">
                                <p class="muted" style="margin:0">SERVICE</p>
                                <p style="margin:6px 0 12px 0;font-size:16px">${booking.service}</p>
                                <p class="muted" style="margin:0">DATE &amp; TIME</p>
                                <p style="margin:6px 0 12px 0;font-size:16px">${new Date(booking.date).toLocaleDateString()} at ${booking.time}</p>
                                <p class="muted" style="margin:0">CONFIRMATION NO.</p>
                                <p style="margin:6px 0 12px 0;font-family:monospace;color:${EMAIL_COLORS.accent}">${booking.confirmationNumber}</p>
                                <p class="muted" style="margin:0">HAIR COLOR REQUEST</p>
                                <p style="margin:6px 0 0 0;color:${EMAIL_COLORS.secondaryText}">${booking.hairColor || 'Natural / No selection'}</p>
                            </div>
                            <p style="font-size:12px;color:${EMAIL_COLORS.smallText};line-height:1.6">By appointment only. $30 deposit required to secure session (charged). Any complaints must be reported within 3 days. Please arrive with hair pre-washed or booked for treatment.</p>
                        </div>
                        ${renderFooter()}
                    </div>
                </body>
                </html>
        `;
}

// generate HTML for admins when a new reservation arrives
export function getAdminBookingNotificationHtml(booking: any, adminLink: string) {
    return `
        <!doctype html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                body { background: ${EMAIL_COLORS.white}; margin:0; padding:0; }
                .container { max-width:600px; margin:auto; font-family: serif; color:${EMAIL_COLORS.text}; padding:20px; }
                .card { background:${EMAIL_COLORS.white}; border:1px solid ${EMAIL_COLORS.border}; padding:20px; }
                .muted { color:${EMAIL_COLORS.muted}; font-size:11px; text-transform:uppercase; letter-spacing:0.15em; }
                .accent { color:${EMAIL_COLORS.accent}; }
                .button { display:inline-block; background:${EMAIL_COLORS.accent}; color:#fff; text-decoration:none; padding:12px 30px; font-size:13px; text-transform:uppercase; letter-spacing:0.1em; font-weight:bold; border-radius:4px; }
                @media (max-width:480px){ .container{padding:12px} .card{padding:12px} }
            </style>
        </head>
        <body>
            <div class="container">
                ${renderHeader()}
                <div class="card">
                    <h2 style="margin-top:0" class="accent">New Reservation Received</h2>
                    <p>A new booking has been made by <strong>${booking.clientName}</strong>.</p>
                    <table width="100%" style="font-size:13px; border-collapse:collapse; margin-top:20px;">
                        <tr><td class="muted" style="padding:6px 0;">Client</td><td style="padding:6px 0; font-weight:bold;">${booking.clientName}</td></tr>
                        <tr><td class="muted" style="padding:6px 0;">Email</td><td style="padding:6px 0;">${booking.clientEmail}</td></tr>
                        <tr><td class="muted" style="padding:6px 0;">Phone</td><td style="padding:6px 0;">${booking.clientPhone || 'N/A'}</td></tr>
                        <tr><td class="muted" style="padding:6px 0;">Service</td><td style="padding:6px 0; font-weight:bold;">${booking.service}</td></tr>
                        <tr><td class="muted" style="padding:6px 0;">Extras</td><td style="padding:6px 0;">${booking.addons && booking.addons.length > 0 ? booking.addons.map((a: any) => a.name).join(', ') : 'None'}</td></tr>
                        <tr><td class="muted" style="padding:6px 0;">Date/Time</td><td style="padding:6px 0;">${new Date(booking.date).toLocaleDateString()} at ${booking.time}</td></tr>
                        <tr><td class="muted" style="padding:6px 0;">Hair Color Request</td><td style="padding:6px 0; color:${EMAIL_COLORS.accent}; font-style:italic;">${booking.hairColor || 'None'}</td></tr>
                        <tr><td class="muted" style="padding:6px 0;">Total Price</td><td style="padding:6px 0; font-weight: bold;">$${booking.price}</td></tr>
                        <tr><td class="muted" style="padding:6px 0;">Reference</td><td style="padding:6px 0; font-family:monospace; font-weight:bold; color:${EMAIL_COLORS.accent};">#${booking.confirmationNumber}</td></tr>
                    </table>
                    <div style="text-align:center; margin-top:30px;">
                        <a href="${adminLink}" class="button">Open Booking Dashboard</a>
                    </div>
                </div>
                ${renderFooter()}
            </div>
        </body>
        </html>
    `;
}

export function getBookingConfirmationText(booking: any) {
    return `Reservation Secured - SOLANGE\n\nClient: ${booking.clientName}\nService: ${booking.service}\nDate/Time: ${new Date(booking.date).toLocaleDateString()} at ${booking.time}\nConfirmation: ${booking.confirmationNumber}\n\nPlease arrive with hair pre-washed. $30 deposit required to secure session.`;
}

// plain‑text admin booking notification with a link
export function getAdminBookingNotificationText(booking: any, adminLink: string) {
    const extras = booking.addons && booking.addons.length > 0
        ? booking.addons.map((a: any) => a.name).join(', ')
        : 'None';
    return `New booking received\n\nClient: ${booking.clientName}\nEmail: ${booking.clientEmail}\nPhone: ${booking.clientPhone || 'N/A'}\nService: ${booking.service}\nExtras: ${extras}\nDate/Time: ${new Date(booking.date).toLocaleDateString()} at ${booking.time}\nHair Color Request: ${booking.hairColor || 'None'}\nTotal Price: $${booking.price}\nReference: ${booking.confirmationNumber}\n\nManage in dashboard: ${adminLink}`;
}

export function getReminderHtml(booking: any, timeRemaining: string) {
    return `
                <!doctype html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                        body{margin:0;padding:0;font-family:serif;color:${EMAIL_COLORS.text}}
                        .container{max-width:600px;margin:auto;padding:20px}
                        .card{background:${EMAIL_COLORS.white};border:1px solid ${EMAIL_COLORS.border};padding:18px}
                        .muted{color:${EMAIL_COLORS.muted};font-size:11px;text-transform:uppercase;letter-spacing:0.12em}
                        .accent{color:${EMAIL_COLORS.accent}}
                        @media (max-width:480px){.container{padding:12px}.card{padding:12px}}
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${renderHeader()}
                        <div class="card" style="text-align:center">
                            <h2 class="accent" style="margin-top:0">See you in ${timeRemaining}.</h2>
                            <p>Your session for <strong>${booking.service}</strong> is approaching.</p>
                            <p>We are preparing the salon for your arrival at <strong>${booking.time}</strong> today.</p>
                            <div style="background:${EMAIL_COLORS.reminderBg};padding:12px;margin-top:12px;border-radius:4px">If you need to reschedule, please contact us immediately.</div>
                        </div>
                        ${renderFooter()}
                    </div>
                </body>
                </html>
        `;
}

export function getReminderText(booking: any, timeRemaining: string) {
    return `Appointment Reminder - SOLANGE\n\nYour session for ${booking.service} is in ${timeRemaining}.\nTime: ${booking.time}\n\nIf you need to reschedule, please contact us.`;
}
