# MongoDB + Hostinger + Vercel Setup Guide

## Overview
This guide explains how to deploy your Solange Hair Braiding website with:
- **Frontend**: Static site on Hostinger shared hosting
- **Backend API**: Serverless functions on Vercel (free tier)
- **Database**: MongoDB Atlas (free tier up to 512MB)

## Prerequisites
✅ MongoDB Atlas account with connection string (already provided)
✅ Vercel account (free)
✅ Hostinger hosting (already subscribed)

---

## Part 1: MongoDB Atlas Setup (Already Done ✅)

Your connection string is configured in `.env.local`:
```
mongodb+srv://solangesignaturehair_db_user:3dXLlQAj0qNn0QRx@solange.0ub8jdb.mongodb.net/solange_bookings?retryWrites=true&w=majority
```

**What's stored:**
- 📅 Booking appointments
- ⚙️ Admin settings (services, stylists, business hours)

---

## Part 2: Deploy Backend to Vercel (5 minutes)

### Step 1: Push code to GitHub
```bash
git init
git add .
git commit -m "Add MongoDB integration and API routes"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/solange.git
git push -u origin main
```

### Step 2: Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repo
4. Click "Import"

### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables, add:
```
MONGODB_URI = mongodb+srv://solangesignaturehair_db_user:3dXLlQAj0qNn0QRx@solange.0ub8jdb.mongodb.net/solange_bookings?retryWrites=true&w=majority
ADMIN_SECRET = your_random_secret_here_min_20_chars
```

### Step 4: Deploy
Click "Deploy" - Vercel will automatically build and deploy your API routes.

**Your API will be available at:**
```
https://YOUR-VERCEL-PROJECT.vercel.app/api/bookings
https://YOUR-VERCEL-PROJECT.vercel.app/api/admin
```

---

## Part 3: Deploy Frontend to Hostinger

### Step 1: Build Static Site
```bash
npm run build
```

This creates optimized static files in the `.next` directory.

### Step 2: Upload to Hostinger

Using **Hostinger File Manager** (cPanel):

1. Build the site: `npm run build`
2. In Hostinger cPanel:
   - Go to **File Manager**
   - Navigate to **public_html** folder
   - Delete existing files
   - Upload all files from `.next` folder to public_html
   
**OR using FTP:**
```
Host: your-domain.com
Username: your_hostinger_username
Password: your_hostinger_password
Port: 21

Upload directory: .next contents → /public_html
```

### Step 3: Test Frontend
Visit `https://your-salon-domain.com`

---

## Part 4: Connect Frontend to Backend API

### Update Booking Form (src/app/booking/page.tsx)

In the booking submission, change from local storage to API call:

```typescript
const handleSubmit = async () => {
  try {
    const response = await fetch('https://YOUR-VERCEL-PROJECT.vercel.app/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        service,
        serviceId,
        date: selectedDate,
        time: selectedTime,
        stylist: selectedStylist,
        duration: 240,
        price: 200,
        paymentMethod: selectedPayment
      })
    });

    const booking = await response.json();
    // Redirect to confirmation with booking ID
    window.location.href = `/confirmation?status=success&bookingId=${booking._id}`;
  } catch (error) {
    window.location.href = '/confirmation?status=failure';
  }
};
```

---

## Part 5: Admin Dashboard

Admin features that require authentication:

```typescript
// Fetch bookings (requires ADMIN_SECRET)
fetch('https://YOUR-VERCEL-PROJECT.vercel.app/api/bookings', {
  headers: { 'Authorization': 'Bearer ' + ADMIN_SECRET }
});

// Update settings
fetch('https://YOUR-VERCEL-PROJECT.vercel.app/api/admin', {
  method: 'PUT',
  headers: { 
    'Authorization': 'Bearer ' + ADMIN_SECRET,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    heroVideoUrl: 'new-url',
    services: [...],
    stylists: [...]
  })
});
```

---

## Architecture Diagram

```
┌─────────────────────────────────────┐
│     Hostinger Shared Hosting        │
│  (Frontend Static Files - Free)     │
│  ├─ HTML, CSS, JavaScript           │
│  ├─ Images & Media                  │
│  └─ 99.9% Uptime SLA               │
└────────────┬────────────────────────┘
             │ HTTPS Requests
             ▼
┌─────────────────────────────────────┐
│    Vercel Serverless Functions      │
│  (Backend API Routes - Free Tier)   │
│  ├─ POST /api/bookings              │
│  ├─ GET /api/bookings               │
│  ├─ PUT /api/bookings/[id]          │
│  └─ GET/PUT /api/admin              │
└────────────┬────────────────────────┘
             │ Database Queries
             ▼
┌─────────────────────────────────────┐
│     MongoDB Atlas (Cloud DB)        │
│  (Bookings & Settings - Free 512MB) │
│  ├─ Collections                     │
│  │  ├─ Bookings                     │
│  │  └─ AdminSettings                │
│  └─ Automatic Backups               │
└─────────────────────────────────────┘
```

---

## Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| **Hostinger** | Shared Hosting | $2.99-6.99/month |
| **Vercel** | Free Tier | $0 (5GB serverless functions) |
| **MongoDB Atlas** | Free Tier | $0 (512MB storage) |
| **Domain** | Your registrar | ~$10/year |
| **SSL Certificate** | Hostinger | Free (Let's Encrypt) |
| **Total** | | ~$40-80/year |

---

## Troubleshooting

### API Returns 401 Unauthorized
- Check `ADMIN_SECRET` is set correctly in Vercel environment variables
- Ensure Authorization header includes "Bearer " prefix

### Bookings not saving
- Check MongoDB connection string in Vercel env vars
- Verify Hostinger IP is whitelisted in MongoDB Atlas (IP: 0.0.0.0/0 for testing)
- Check Vercel build logs for errors

### Frontend not seeing API
- Verify Vercel domain is correct in fetch calls
- Check CORS (should work since Vercel handles it)
- Use browser DevTools to debug network requests

### Hostinger upload issues
- Use FTP client like FileZilla
- Make sure to upload contents of `.next`, not the folder itself
- Clear browser cache after uploading (Ctrl+Shift+Del)

---

## Environment Variables Needed

### Local Development (.env.local)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...@solange.0ub8jdb.mongodb.net/...
ADMIN_SECRET=your_secret_key
```

### Production - Vercel
```
MONGODB_URI=mongodb+srv://...@solange.0ub8jdb.mongodb.net/...
ADMIN_SECRET=your_secret_key
NEXT_PUBLIC_APP_URL=https://your-salon-domain.com
```

### Production - Hostinger
No env vars needed (static frontend only)

---

## Next Steps

1. ✅ MongoDB already configured
2. ⏳ Create GitHub repo and push code
3. ⏳ Deploy to Vercel
4. ⏳ Get Vercel API URL
5. ⏳ Update booking page with API URL
6. ⏳ Test API endpoints
7. ⏳ Build and upload to Hostinger
8. ⏳ Test complete flow on production

---

## Support Resources

- [Hostinger FTP Upload](https://support.hostinger.com/en/articles/4624050-how-to-upload-files-via-ftp)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [MongoDB Connection Troubleshooting](https://docs.mongodb.com/manual/reference/connection-string/)

