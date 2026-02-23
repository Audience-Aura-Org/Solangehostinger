# Solange Hair Braiding - Service Integration Guide

Complete setup instructions for all external services and APIs.

## 📋 Table of Contents

1. [Tawk.to (Live Chat)](#tawkto-live-chat)
2. [Stripe (Credit Card Payments)](#stripe-credit-card-payments)
3. [PayPal (PayPal Payments)](#paypal-paypal-payments)
4. [Mobile Money Integration](#mobile-money-integration)
5. [Email Notifications](#email-notifications)
6. [Video Hosting (Cloudinary)](#video-hosting-cloudinary)
7. [Google Analytics](#google-analytics)
8. [Domain & SSL](#domain--ssl)

---

## Tawk.to (Live Chat)

### Purpose
Real-time customer chatting, support tickets, visitor tracking.

### Setup Steps

1. **Create Account**
   - Go to https://tawk.to
   - Click "Start free"
   - Sign up with email or Google

2. **Create Property**
   - Create new "Site"
   - Enter your domain: `solange-salon.com`
   - Accept terms

3. **Get Your ID**
   - Go to API & SETTINGS → Property
   - Copy your **Property ID** (looks like: `a1bc2de3f45678g9hijk`)

4. **Update Environment**
   ```env
   NEXT_PUBLIC_TAWK_ID=a1bc2de3f45678g9hijk
   ```

5. **Customize Appearance**
   - Dashboard → Appearance
   - Choose theme and colors to match glass design
   - Save changes

6. **Test**
   - Visit your site
   - Chat widget should appear bottom-right
   - Send test message
   - Reply from dashboard

### Pricing
- **Free**: Unlimited chat, basic features
- **Premium**: $70/month+ for advanced features

### Features
- Real-time messaging
- Visitor tracking
- Chat history
- Offline messages
- Mobile app
- Automated responses

---

## Stripe (Credit Card Payments)

### Purpose
Process credit/debit card payments globally.

### Setup Steps

1. **Create Account**
   - Go to https://stripe.com
   - Click "Create free account"
   - Email verification
   - Business details

2. **Get API Keys**
   - Dashboard → API Keys
   - You'll see:
     - **Publishable Key**: `pk_test_xxx` (test) or `pk_live_xxx` (live)
     - **Secret Key**: `sk_test_xxx` (test) or `sk_live_xxx` (live)

3. **Update Environment**
   ```env
   # For testing (during development)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
   STRIPE_SECRET_KEY=sk_test_9876543210fedcba

   # For production (after testing)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
   STRIPE_SECRET_KEY=sk_live_yyyyyyyyyyyyy
   ```

4. **Test Cards**
   Use these cards in test mode:
   ```
   4242 4242 4242 4242 - Visa (success)
   5555 5555 5555 4444 - Mastercard (success)
   3782 822463 10005  - Amex (success)
   4000 0000 0000 0002 - Visa (decline)
   ```
   Any future expiry date, any CVC

5. **Activate Products**
   - Create products in Stripe dashboard
   - Link prices to services
   - Test complete flow

6. **Setup Webhooks** (for notifications)
   - API → Webhooks
   - Add endpoint: `yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.failed`

### Pricing
- **Transaction Fee**: 2.9% + $0.30 per transaction
- No monthly fee
- PCI DSS Level 1 compliant

### Integration Points
- Booking confirmation page
- Payment method selection
- Checkout redirect
- Success/failure handling

---

## PayPal (PayPal Payments)

### Purpose
PayPal account payments, global reach.

### Setup Steps

1. **Create Business Account**
   - Go to https://developer.paypal.com
   - Sign up for business account
   - Verify email
   - Select Seller account

2. **Get API Credentials**
   - Dashboard → Apps & Credentials
   - Select "Sandbox" (testing) or "Live" (production)
   - Create app:
     - App Name: "Solange Salon"
     - App Type: "Merchant"
   - You'll get:
     - **Client ID**: `xxx123yyy456`
     - **Client Secret**: `zzz789aaa111`

3. **Update Environment**
   ```env
   # Sandbox (testing)
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx123yyy456_sandbox
   PAYPAL_CLIENT_SECRET=zzz789aaa111_sandbox

   # Live (production)
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx123yyy456_live
   PAYPAL_CLIENT_SECRET=zzz789aaa111_live
   ```

4. **Create Test Accounts**
   - Dashboard → Accounts
   - Create buyer and seller accounts
   - Test full payment flow

5. **Test Payments**
   - Use sandbox account credentials
   - Process test transactions
   - Verify in transaction history

6. **Activate for Live**
   - Switch from Sandbox to Live in dashboard
   - Update environment variables
   - Limited initial limits, request increase

### Pricing
- **Transaction Fee**: 2.9% + $0.30 (US)
- No monthly fee
- International rates vary

### Integration Points
- Payment form
- Checkout redirect
- Subscription management
- Refund processing

---

## Mobile Money Integration

### MTN Mobile Money (Nigeria, Ghana, Uganda, etc.)

1. **Register Business Account**
   - Visit https://mtn.com (your region)
   - Apply for MTN Mobile Money API
   - Submit business documents
   - Approval: 5-7 business days

2. **Get API Credentials**
   - API Key
   - Merchant ID
   - Service Provider ID (SPID)

3. **Environment Setup**
   ```env
   NEXT_PUBLIC_MOBILE_MONEY_PROVIDER=MTN
   NEXT_PUBLIC_MTN_MERCHANT_ID=YOUR_MERCHANT_ID
   NEXT_PUBLIC_MTN_SPID=YOUR_SERVICE_PROVIDER_ID
   MTN_API_KEY=YOUR_API_KEY
   MTN_API_SECRET=YOUR_API_SECRET
   ```

4. **Implementation**
   - Use MTN Momo API Node.js SDK
   - Handle phone number validation
   - Manage transaction status
   - Implement retry logic

### Orange Money (West Africa)

1. **Register Account**
   - Visit https://orangemoney.com (your region)
   - Business Registration
   - API credentials provided

2. **Environment Setup**
   ```env
   NEXT_PUBLIC_MOBILE_MONEY_PROVIDER=ORANGE
   NEXT_PUBLIC_ORANGE_MERCHANT_ID=YOUR_MERCHANT_ID
   ORANGE_API_KEY=YOUR_API_KEY
   ORANGE_API_SECRET=YOUR_API_SECRET
   ```

### Testing Mobile Money

```bash
# Test credentials provided by provider
# Use test phone numbers
# Verify in test dashboard
# Activate production mode when ready
```

### Pricing
- **Transaction Fee**: 1-3% typically
- **Settlement**: Daily or weekly
- **Minimum Payout**: Usually $10-50

---

## Email Notifications

### SendGrid (Recommended)

1. **Create Account**
   - Go to https://sendgrid.com
   - Sign up free account
   - Verify email

2. **Get API Key**
   - Settings → API Keys
   - Create new API Key
   - Name it: "Solange Salon"

3. **Environment Setup**
   ```env
   SENDGRID_API_KEY=SG.xxx123yyy456zzz789aaa
   SENDGRID_FROM_EMAIL=noreply@solange-salon.com
   ```

4. **Create Email Templates**
   - Booking confirmation
   - Payment receipt
   - Appointment reminder
   - Cancellation confirmation

5. **Setup Sender Authentication**
   - Verify sender domain: `noreply@solange-salon.com`
   - Add DKIM/SPF records (SendGrid guides you)
   - Complete verification (2-48 hours)

### Mailgun

1. **Create Account**
   - Go to https://mailgun.com
   - Sign up (5,000 free emails monthly)
   - Add domain verification

2. **Get API Credentials**
   - Domain info → API Key
   - Copy API Key and domain

3. **Environment Setup**
   ```env
   MAILGUN_API_KEY=key-xxx123yyy456zzz789aaa
   MAILGUN_DOMAIN=mail.solange-salon.com
   ```

### Gmail SMTP (Simple, Free)

1. **Enable Less Secure Apps**
   - Google Account → Security
   - Enable "Less secure app access"

2. **Environment Setup**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### Testing Email

```javascript
// Test sending email
const sendEmail = async (to, subject, html) => {
  // Use SendGrid / Mailgun / Nodemailer
  // Log success/failure
};
```

---

## Video Hosting (Cloudinary)

### Purpose
Host hero video with CDN optimization for mobile.

### Setup Steps

1. **Create Account**
   - Go to https://cloudinary.com
   - Sign up free (25GB storage)
   - Verify email

2. **Upload Video**
   - Dashboard → Media Library
   - Upload hero video (MP4)
   - Cloudinary auto-optimizes
   - Get public URL

3. **Get Cloud Name**
   - Dashboard → Account
   - Copy **Cloud Name** (e.g., `dxxxxx123`)

4. **Get API Key**
   - Settings → API Keys
   - Generate new API key

5. **Environment Setup**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxx123
   NEXT_PUBLIC_HERO_VIDEO_URL=https://res.cloudinary.com/dxxxxx123/video/upload/v1234567890/solange/hero.mp4
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

6. **Optimize Video**
   - Cloudinary auto-compresses
   - Generates multiple formats (MP4, WebP, HLS)
   - CDN delivery to 200+ edge locations

7. **Admin Upload**
   - Go to `/admin` → Hero Video
   - Paste Cloudinary video URL
   - Set fallback image
   - Save

### Pricing
- **Free**: 25GB storage, 2GB bandwidth monthly
- **Paid**: Starting $99/month for more storage

### Best Practices
- Keep videos < 50MB
- Use MP4 format
- 1920x1080 resolution
- 30fps video quality
- Optimize audio bitrate

---

## Google Analytics

### Purpose
Track user behavior, conversions, traffic sources.

### Setup Steps

1. **Create Account**
   - Go to https://analytics.google.com
   - Sign with Google account
   - Create property: "Solange Hair Braiding"
   - Select website as platform

2. **Get Measurement ID**
   - Admin → Data Streams
   - Select your website
   - Copy **Measurement ID** (G-XXXXXXXXXX)

3. **Update Environment**
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. **Uncomment GA Script**
   In `src/app/layout.tsx`, uncomment:
   ```typescript
   {/* Google Analytics */}
   <Script
     strategy="afterInteractive"
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
   />
   <Script
     id="google-analytics"
     strategy="afterInteractive"
     dangerouslySetInnerHTML={{
       __html: `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
       `,
     }}
   />
   ```

5. **Test Tag**
   - Real-time → Overview
   - Visit your site
   - Should show 1 active user
   - Verify tracking works

6. **Setup Goals**
   - Admin → Goals
   - Booking completed: Conversion
   - Contact form: Engagement
   - Video watched: Engagement

### Key Metrics to Track
- **Users**: Monthly/daily active users
- **Bounce Rate**: Should be < 50%
- **Avg. Session Duration**: Aim for 2+ minutes
- **Conversion Rate**: Bookings / Visitors
- **Traffic Sources**: Direct, organic, referral

---

## Domain & SSL

### Domain Registration (for custom domain)

1. **Register Domain**
   - Hostinger: Included in hosting
   - Namecheap: ~$10/year
   - GoDaddy: ~$15/year
   - Google Domains: ~$12/year

2. **Update DNS**
   - Point A record to hosting IP
   - Or CNAME to hosting provider
   - Propagation: 24-48 hours

3. **Verify Domain Ownership**
   - Add TXT record
   - Or verify via HTML file
   - Needed for SSL and email

### SSL Certificate (HTTPS)

1. **Automatic** (Recommended)
   - Hostinger: Free SSL included
   - Vercel: Auto-enabled
   - Netlify: Auto-enabled
   - AWS: Generate via ACM

2. **Manual**
   - Let's Encrypt: Free (certbot)
   - Cloudflare: Free with proxy
   - Comodo: Paid SSL

3. **Enable HTTPS**
   - Force HTTPS redirect
   - Update `NEXT_PUBLIC_SITE_URL=https://...`
   - Verify lock icon in browser

---

## Environment Variables Summary

Complete reference for all environment variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx_sandbox
PAYPAL_CLIENT_SECRET=yyy_sandbox

# Tawk.to
NEXT_PUBLIC_TAWK_ID=xxxxx

# Mobile Money
NEXT_PUBLIC_MOBILE_MONEY_PROVIDER=MTN
NEXT_PUBLIC_MTN_MERCHANT_ID=xxxxx
MTN_API_KEY=xxxxx

# Email
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Video Hosting
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxx
NEXT_PUBLIC_HERO_VIDEO_URL=https://...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXX

# Admin (optional)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure_password_here
```

---

## Testing Checklist

- [ ] Tawk chat widget appears
- [ ] Stripe payment modal opens
- [ ] PayPal redirect works
- [ ] Mobile Money form displays
- [ ] Email confirmations sent
- [ ] Hero video plays
- [ ] Google Analytics tracking
- [ ] All environment variables loaded
- [ ] HTTPS working with green lock
- [ ] Mobile responsive

---

## Troubleshooting

### Chat Widget Not Showing
- Check Tawk ID in environment
- Verify Tawk dashboard is active
- Clear browser cache
- Check browser console (F12)

### Payment Form Not Loading
- Verify Stripe key is "pk_test_" or "pk_live_"
- Check domain is added to Stripe
- Ensure HTTPS for live keys
- Check browser console for errors

### Email Not Sending
- Verify API key is valid
- Check sender domain verified
- Ensure sender email matches
- Check spam folder
- Review API logs

### Video Not Playing
- Verify Cloudinary URL is public
- Check video format (MP4)
- Test on desktop first, then mobile
- Check bandwidth limit not exceeded

---

## Support

For service-specific help:
- Tawk.to: https://tawk.to/faq
- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com/docs
- Cloudinary: https://cloudinary.com/documentation
- SendGrid: https://sendgrid.com/docs
- Google Analytics: https://support.google.com/analytics

---

**All services are optional but recommended for complete functionality.**

Start with Tawk.to (free) and Stripe (test mode), then add others as needed.
