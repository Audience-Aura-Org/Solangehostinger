# MongoDB + Vercel API + Hostinger Frontend Deployment

## Architecture Overview

Your Solange Hair Braiding site uses a **two-part deployment strategy**:

```
┌─────────────────────────────────────────┐
│      HOSTINGER (Frontend Static Site)   │
│  - All pages, CSS, JavaScript, images   │
│  - No server/backend needed             │
│  - Cost: $2.99-6.99/month               │
└────────────────────┬────────────────────┘
                     │ HTTPS Calls
                     ▼
┌─────────────────────────────────────────┐
│   VERCEL API (Backend + MongoDB)        │
│  - REST API endpoints for bookings      │
│  - Connected to MongoDB Atlas           │
│  - Serverless functions (auto-scale)    │
│  - Cost: FREE (5GB/month)               │
└────────────────────┬────────────────────┘
                     │ Queries
                     ▼
┌─────────────────────────────────────────┐
│      MONGODB ATLAS (Database)           │
│  - Store bookings & admin settings      │
│  - 512MB free tier                      │
│  - Cost: FREE                           │
└─────────────────────────────────────────┘
```

---

## Part 1: Deploy Frontend to Hostinger (10 minutes)

### What Gets Uploaded to Hostinger
Everything in the `.next` folder (after running `npm run build`)

### Steps

**1. Build the site locally:**
```bash
npm run build
```

**2. Upload via FTP or File Manager:**

**Option A: Using Hostinger File Manager (Easiest)**
- Log in to Hostinger cPanel
- Go to **File Manager**
- Navigate to **public_html**
- Delete all existing files (except .htaccess if present)
- Upload all contents from the `.next` folder to public_html

**Option B: Using FTP Client (FileZilla)**
1. Download [FileZilla](https://filezilla-project.org/)
2. Connect with these settings:
   - Host: `ftp://your-domain.com`
   - Username: Your Hostinger FTP user
   - Password: Your Hostinger FTP password
   - Port: 21

3. Navigate to `/public_html` folder
4. Delete existing files
5. Drag-and-drop contents of `.next` folder into public_html
6. Wait for upload to complete

**3. Verify the site uploads:**
- Visit https://your-domain.com in browser
- All pages should load
- No backend needed yet (buttons won't save data yet)

---

## Part 2: Deploy API to Vercel (15 minutes)

### Prerequisites
- GitHub account (free)
- Vercel account (free, linked to GitHub)

### Steps

**1. Create GitHub Repository**
```bash
cd "c:\Users\Zero\Desktop\Solange"
git init
git add .
git commit -m "Initial commit: Solange Hair Braiding with MongoDB integration"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/solange.git
git push -u origin main
```

**2. Create Vercel Project**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"
5. Leave configuration as default
6. Click "Deploy"

Vercel will generate a URL like: `https://solange-hair.vercel.app`

**3. Add Environment Variables to Vercel**

In your Vercel project dashboard:
1. Click "Settings" → "Environment Variables"
2. Add these two variables:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://solangesignaturehair_db_user:3dXLlQAj0qNn0QRx@solange.0ub8jdb.mongodb.net/solange_bookings?retryWrites=true&w=majority` |
| `ADMIN_SECRET` | `generate-a-random-25-character-string-here` |

**Example for ADMIN_SECRET:**
```
aK9mL2pQ4wX7zN1bC5vF8gE3jH6uI9oK2rT4sA7wZ0x
```
(Use a random password generator like [lastpass.com/generator](https://www.lastpass.com/features/password-generator))

4. Click "Save"
5. Vercel will redeploy automatically

**4. Test API Endpoints**

After Vercel deployment, test these URLs in your browser:

```
# Fetch admin settings (public, no auth needed)
https://YOUR-VERCEL-DOMAIN.vercel.app/api/admin

# Create a test booking (should return JSON with booking details)
# Use Postman or this curl command:
curl -X POST https://YOUR-VERCEL-DOMAIN.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test User",
    "clientEmail": "test@example.com",
    "clientPhone": "555-1234",
    "service": "Box Braids",
    "serviceId": "box-braids",
    "date": "2026-03-15",
    "time": "14:00",
    "stylist": "Solange Adeyemi",
    "duration": 240,
    "price": 200
  }'
```

---

## Part 3: Connect Frontend to API (5 minutes)

### Update .env.local

Update your local `.env.local` with the actual Vercel API URL:

```env
NEXT_PUBLIC_API_URL=https://YOUR-VERCEL-PROJECT.vercel.app
MONGODB_URI=mongodb+srv://solangesignaturehair_db_user:3dXLlQAj0qNn0QRx@solange.0ub8jdb.mongodb.net/solange_bookings?retryWrites=true&w=majority
ADMIN_SECRET=your-admin-secret-key
```

### Update Booking Page (src/app/booking/page.tsx)

Example of how to submit bookings to the API:

```typescript
const submitBooking = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          service: bookingState.service.name,
          serviceId: bookingState.service.id,
          date: bookingState.date,
          time: bookingState.time,
          stylist: bookingState.stylist.name,
          duration: bookingState.service.duration,
          price: bookingState.service.price,
          paymentMethod: bookingState.paymentMethod
        })
      }
    );

    if (!response.ok) throw new Error('Booking failed');
    
    const booking = await response.json();
    // Redirect to confirmation with booking ID
    window.location.href = `/confirmation?status=success&bookingId=${booking._id}`;
  } catch (error) {
    console.error('Error:', error);
    window.location.href = '/confirmation?status=failure';
  }
};
```

---

## Part 4: Admin Dashboard Integration

### Fetch Bookings (Admin Only)

```typescript
const fetchBookings = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`
        }
      }
    );

    if (!response.ok) throw new Error('Unauthorized');
    
    const bookings = await response.json();
    setBookings(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};
```

### Update Settings

```typescript
const updateSettings = async (newSettings: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`
        },
        body: JSON.stringify(newSettings)
      }
    );

    if (!response.ok) throw new Error('Update failed');
    
    const updatedSettings = await response.json();
    console.log('Settings updated:', updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
  }
};
```

---

## Directory Structure

```
solange/
├── .next/                          # ← Upload this to Hostinger
│   ├── standalone/                 # Static files
│   ├── static/                     # CSS, JS bundles
│   └── ...
├── api-routes/                     # ← Deploy to Vercel
│   ├── bookings/
│   │   ├── route.ts               # POST, GET /api/bookings
│   │   └── [id]/route.ts          # GET, PUT /api/bookings/[id]
│   └── admin/
│       └── route.ts               # GET, PUT /api/admin
├── src/
│   ├── app/                        # Pages (all static)
│   ├── components/                 # React components
│   ├── lib/
│   │   └── mongodb.ts             # Database connection
│   └── models/                     # Mongoose schemas
├── .env.local                      # Environment variables
├── package.json                    # Dependencies
└── next.config.ts                  # Next.js config
```

---

## Environment Variables Reference

### Local Development (.env.local)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://solangesignaturehair_db_user:3dXLlQAj0qNn0QRx@solange.0ub8jdb.mongodb.net/solange_bookings?retryWrites=true&w=majority
ADMIN_SECRET=your-random-secret-key-min-20-chars
```

### Hostinger (No env vars needed - static only)

### Vercel (Dashboard → Settings → Environment Variables)
```
MONGODB_URI = mongodb+srv://solangesignaturehair_db_user:3dXLlQAj0qNn0QRx@solange.0ub8jdb.mongodb.net/solange_bookings?retryWrites=true&w=majority
ADMIN_SECRET = your-random-secret-key-min-20-chars
```

---

## Troubleshooting

### Bookings not saving?
1. Check Vercel deployment status: `https://vercel.com/dashboard`
2. Check API endpoint returns data: `https://YOUR-VERCEL.app/api/admin`
3. Verify ADMIN_SECRET matches in Vercel env vars
4. Check MongoDB connection string is correct

### Front-end shows 404s?
1. Make sure `.next` contents (not the folder itself) are uploaded to public_html
2. Check file permissions (should be 644 for files, 755 for folders)
3. Clear Hostinger cache if available
4. Wait a few minutes for DNS propagation

### API returns 401 Unauthorized?
1. Check `ADMIN_SECRET` environment variable in Vercel
2. Ensure Authorization header format: `Bearer YOUR_SECRET`
3. Verify the secret matches in both applications

### MongoDB connection fails?
1. Check connection string in Vercel env vars
2. Verify MongoDB Atlas firewall allows access (should be 0.0.0.0/0 for testing)
3. Check database name in URL: `.../solange_bookings?...`

---

## Cost Analysis

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| **Hostinger** | Shared Hosting | $2.99-6.99/mo | Frontend only, no code execution |
| **Vercel** | Free Tier | $0 | 5GB/month, auto-scaling |
| **MongoDB Atlas** | Free Tier | $0 | 512MB storage, dev-only |
| **Domain Name** | .com | ~$10/yr | At any registrar |
| **SSL (HTTPS)** | Hostinger | FREE | Included with hosting |
| **Total Annual Cost** | | **$40-90/yr** | Cheapest production setup |

---

## Deployment Checklist

- [ ] Build site locally: `npm run build`
- [ ] Upload `.next` contents to Hostinger public_html
- [ ] Test homepage: https://your-domain.com
- [ ] Push code to GitHub
- [ ] Create Vercel project from GitHub
- [ ] Add env vars to Vercel dashboard
- [ ] Wait for Vercel deployment
- [ ] Test API: https://YOUR-VERCEL.app/api/admin
- [ ] Update API URLs in code (optional for now)
- [ ] Test booking form (may show 404 until API connected)
- [ ] Celebrate! 🎉

---

## Next Steps

1. **Now**: Frontend is live on Hostinger
2. **Next**: Deploy API to Vercel (requires GitHub)
3. **Then**: Update booking page to call Vercel API
4. **Finally**: Set up payment methods (Stripe/PayPal)

---

## Support Resources

- [Hostinger FTP Upload Guide](https://support.hostinger.com/en/articles/4624050)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [MongoDB Connection Help](https://docs.mongodb.com/manual/reference/connection-string/)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)

