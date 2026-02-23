const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST || 'smtp.titan.email';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

if (!smtpUser || !smtpPass) {
  console.error('Please set SMTP_USER and SMTP_PASS in your environment before running.');
  process.exit(1);
}

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.verify();
    console.log('SMTP connection verified');

    const info = await transporter.sendMail({
      from: `Test <${smtpUser}>`,
      to: smtpUser,
      subject: 'Test email from local dev',
      text: 'This is a test email sent from localhost to verify SMTP settings.',
    });

    console.log('Message sent:', info.messageId || info);
  } catch (err) {
    console.error('Error sending test email:', err);
    process.exit(1);
  }
})();
