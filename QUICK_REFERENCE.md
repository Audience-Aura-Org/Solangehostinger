# Solange Hair Braiding - Quick Reference Card

## 🎯 Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (generates static files)
npm run build

# Export static site (same as build)
npm run export

# Run linter
npm run lint
```

## 📁 Important Directories

| Path | Purpose |
|------|---------|
| `src/app/` | Page files (homepage, booking, etc.) |
| `src/components/` | Reusable React components |
| `src/app/globals.css` | Global styles and variables |
| `public/` | Static files (video, images) |
| `.env.local` | Environment variables (local) |

## 🌐 Key URLs (Development)

```
http://localhost:3000              Homepage
http://localhost:3000/services     Services page
http://localhost:3000/about        About page
http://localhost:3000/contact      Contact form
http://localhost:3000/booking      Booking system
http://localhost:3000/admin        Admin dashboard
http://localhost:3000/confirmation Booking confirmation
```

## 🔑 Environment Variables Quick Setup

```bash
# 1. Copy template
cp .env.local.example .env.local

# 2. Edit .env.local and add:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
NEXT_PUBLIC_TAWK_ID=...

# 3. Save file
```

## 🎨 Customization Quick Links

| What | Where | How |
|-----|-------|-----|
| Colors | `src/app/globals.css` | Edit CSS variables |
| Fonts | `src/app/layout.tsx` | Change Google Fonts |
| Services | `src/components/sections/ServicesSection.tsx` | Edit array |
| Pricing | `src/app/booking/page.tsx` | Search for "price" |
| Team | `src/app/about/page.tsx` | Edit team array |

## 💳 Payment Test Cards

### Stripe (Testing)
```
4242 4242 4242 4242  - Visa (success)
5555 5555 5555 4444  - Mastercard (success)
3782 822463 10005   - Amex (success)
4000 0000 0000 0002 - Visa (decline)
```
Any future date, any CVC

### PayPal (Testing)
Use sandbox account credentials from PayPal Developer Dashboard

## 📊 Project Structure (Simple View)

```
solange/
├── src/
│   ├── app/              ← All pages
│   ├── components/       ← UI parts
│   └── app/globals.css   ← Styles
├── public/               ← Videos, images
├── .env.local            ← Secrets
├── package.json          ← Dependencies
└── README.md             ← Full docs
```

## 🚀 Deployment Steps

### Hostinger (Recommended)
```bash
npm run build           # Create static files
# Upload 'out/' folder to server via FTP
# Test website works
```

### Vercel (Easiest)
```bash
npm install -g vercel
vercel                  # Follow prompts
```

### Netlify
```bash
# Connect GitHub → Netlify
# Auto-deploys on push
```

## 🔐 Before Going Live

- [ ] Update all API keys to LIVE versions
- [ ] Update `NEXT_PUBLIC_SITE_URL` to your domain
- [ ] Test all payment methods
- [ ] Verify HTTPS working
- [ ] Test booking flow end-to-end
- [ ] Update contact information
- [ ] Create admin account with password
- [ ] Set up email notifications
- [ ] Configure domain DNS
- [ ] Create backups

## 📱 Testing Your Site

```bash
# Mobile testing
npm run dev

# Open on phone: http://yourcomputerip:3000

# Desktop testing
# http://localhost:3000

# Use Chrome DevTools (F12) for device emulation
```

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Module not found" | Run `npm install` |
| Build fails | Try `rm -r .next && npm run build` |
| Port 3000 in use | Use `npm run dev -- -p 3001` |
| Styles not loading | Clear browser cache (Ctrl+Shift+Del) |
| Payment buttons missing | Check `.env.local` variables |
| Chat widget missing | Verify Tawk ID is correct |

## 📞 Service Support Links

| Service | Link |
|---------|------|
| Stripe | https://stripe.com/support |
| PayPal | https://developer.paypal.com |
| Tawk.to | https://tawk.to/faq |
| Cloudinary | https://cloudinary.com/support |
| Hostinger | https://support.hostinger.com |
| Next.js | https://nextjs.org/docs |

## 💡 Pro Tips

1. **Video Too Large?**
   - Use Cloudinary (auto-compresses)
   - Keep under 50MB
   - Use MP4 format

2. **Slow Performance?**
   - Optimize images with TinyPNG
   - Enable browser caching
   - Use CDN for assets

3. **Not Getting Bookings?**
   - Clear CTA buttons
   - Easy-to-read pricing
   - Mobile-optimized flow
   - Testimonials visible

4. **Payment Issues?**
   - Test with test keys first
   - Switch to live keys for production
   - Verify domain in payment provider
   - Check browser console for errors

## 📖 Full Documentation

For detailed info, see:
- **README.md** - Complete project guide
- **DEPLOYMENT.md** - How to deploy
- **SERVICE_INTEGRATION.md** - API setup
- **HOSTINGER_DEPLOYMENT.md** - Hostinger only
- **PROJECT_SUMMARY.md** - Project overview

## 🎬 File Edit Quick Guide

### Edit Homepage
`src/app/page.tsx`

### Edit Services
`src/components/sections/ServicesSection.tsx`

### Edit Colors/Fonts
`src/app/globals.css`
`tailwind.config.ts`

### Edit Team
`src/app/about/page.tsx`

### Edit Prices
`src/app/booking/page.tsx` (search "price")

### Edit Contact Info
`src/components/ui/Footer.tsx`

## 🚦 Build Success Indicators

✅ Build completes without errors
✅ All pages load without 404s
✅ Styles load correctly
✅ Hero video displays
✅ Booking form works
✅ Payment buttons appear
✅ Chat widget visible
✅ Mobile responsive

## 📊 Key Metrics

Track these for success:

```
- Monthly visitors (Google Analytics)
- Booking conversion rate (bookings ÷ visitors)
- Average session duration (2+ min is good)
- Mobile vs desktop traffic (60-70% mobile)
- Payment success rate (should be > 90%)
```

## 🎯 Your Next Steps

1. **Run locally**: `npm install && npm run dev`
2. **Configure services**: Update `.env.local`
3. **Test everything**: Booking, payments, chat
4. **Deploy**: Choose Hostinger or Vercel
5. **Monitor**: Enable analytics and uptime
6. **Promote**: Share on social media

---

## 📞 Need Help?

1. **See full docs**: README.md
2. **Deployment help**: DEPLOYMENT.md
3. **Service setup**: SERVICE_INTEGRATION.md
4. **Hostinger only**: HOSTINGER_DEPLOYMENT.md

**Everything is production-ready. You've got this! 🚀**
