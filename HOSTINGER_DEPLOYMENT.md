# Hostinger Deployment Guide for Solange Hair Braiding

This guide walks you through deploying the Solange salon website to Hostinger shared hosting.

## Prerequisites

- Hostinger account with active hosting
- Domain name registered and pointed to Hostinger
- FTP/SFTP access enabled
- Local copy of the project built

## Step 1: Build the Project

```bash
# Install dependencies (if not already done)
npm install

# Create production build (generates static files in 'out/' directory)
npm run build

# The 'out/' folder now contains all static files ready for upload
```

## Step 2: Connect via FTP/SFTP

### Option A: Using FileZilla (Recommended)

1. **Download FileZilla**: https://filezilla-project.org

2. **Get FTP Credentials**:
   - Log into Hostinger dashboard
   - Go to Files → FTP Accounts
   - View your credentials or create new FTP user

3. **Connect in FileZilla**:
   - Host: `ftp.yourdomain.com` or IP from Hostinger
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (or 22 for SFTP)

4. **Upload Files**:
   ```
   Remote: /public_html/  (usually the web root)
   Local: solange/out/    (your build output)
   
   Drag and drop all files from 'out/' to public_html
   ```

### Option B: Using Hostinger File Manager

1. Log into Hostinger cPanel
2. Go to File Manager
3. Navigate to `public_html/`
4. Click "Upload" and select all files from `out/` directory
5. Wait for upload to complete

## Step 3: Clean Up (Optional)

If you're replacing an existing website:

```bash
# Delete old files in public_html/ before uploading new ones
# Or rename old folder as backup
```

## Step 4: Configure Domain

1. **Update DNS Records** (if needed):
   - Hostinger → Domains → Manage
   - Ensure domain points to hosting

2. **SSL Certificate**:
   - Hostinger provides free SSL
   - Auto-enabled for new domains
   - Check that HTTPS is working

3. **Test Domain**:
   - Wait up to 24 hours for DNS propagation
   - Visit `https://yourdomain.com`

## Step 5: Environment Variables

Since this is static hosting, API keys are loaded from `.env.local` **during build time only**.

### Important: Build locally with production values!

Before deploying:

1. **Update `.env.local` with production values**:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxxxx
   NEXT_PUBLIC_TAWK_ID=xxxxx
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Rebuild**:
   ```bash
   npm run build
   ```

3. **Upload new `out/` folder to Hostinger**

## Step 6: Test the Site

✅ **Checklist**:

- [ ] Homepage loads with hero video
- [ ] Navigation menu works
- [ ] All pages accessible
- [ ] Booking form loads
- [ ] Payment buttons appear
- [ ] Tawk chat widget shows
- [ ] Mobile responsive (test on phone)
- [ ] HTTPS working (lock icon in address bar)
- [ ] Images and videos load

## Step 7: Set Up External Services

### Tawk.to Chat

1. Go to [tawk.to](https://tawk.to)
2. Create account and get Property ID
3. Update `NEXT_PUBLIC_TAWK_ID` in next deploy

### Stripe

1. Create [Stripe](https://stripe.com) account
2. Get live keys (not test keys for production)
3. Update `.env.local` before rebuilding

### PayPal

1. Developer account at [developer.paypal.com](https://developer.paypal.com)
2. Get live Client ID
3. Configure in environment

### Video Hosting

Recommended services for hosting hero video:

- **Cloudinary** (free tier available)
  - Upload video
  - Get public URL
  - Use in admin dashboard

- **AWS S3 + CloudFront**
  - More control and scalability
  - Slightly more complex setup

- **YouTube/Vimeo**
  - Simple embedding
  - Good for promotional videos

## Common Issues & Solutions

### 404 Errors on Navigation

**Problem**: Clicking links gives 404 error
**Solution**: 
- Ensure ALL files from `out/` were uploaded
- Check that `.next` and static folders are present
- May need to create `.htaccess` for routing (see below)

### .htaccess for Static Routes

If getting 404 on sub-pages, create `.htaccess` in `/public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Video Not Playing

- Check video URL is accessible
- Verify CORS headers are set (for CDN videos)
- Test with smaller video first
- Check browser console for errors

### Payment Not Loading

- Verify Stripe/PayPal keys in environment
- Check keys are "live" not "test"
- Ensure payment forms have HTTPS

### Chat Widget Not Showing

- Confirm Tawk ID in environment
- Check Tawk dashboard is active
- Clear browser cache
- Verify JavaScript is enabled

## Performance Optimization

### Images

Use TinyPNG or similar to optimize:

```bash
# MacOS/Linux command line
cd public/images
for file in *.png; do
  # Optimize with ImageMagick
  convert "$file" -quality 85 "$file"
done
```

### Caching

Add to `.htaccess`:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/html "access plus 1 week"
</IfModule>
```

### Compression

Hostinger usually has Gzip enabled by default.

## Updating the Site

When you make changes:

1. Edit files locally
2. Run `npm run build`
3. Upload new `out/` files to Hostinger
4. Clear browser cache (Ctrl+Shift+Del)

## Monitoring

### Google Search Console

1. Verify domain ownership
2. Submit sitemap: `yourdomain.com/sitemap.xml`
3. Monitor indexing status

### Google Analytics

Add tracking ID to `.env.local`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Uptime Monitoring

Services like Uptime Robot monitor your site:
- https://uptimerobot.com
- Alerts if site goes down

## Backup & Security

### Regular Backups

- Hostinger provides backup tools
- Download full backup monthly
- Keep previous versions locally

### Security Info

- Keep Next.js updated: `npm update`
- Don't commit `.env.local` to git
- Use HTTPS only
- Regular security audits

## SSL Certificate Troubleshooting

If SSL not auto-enabled:

1. Hostinger cPanel → Domains
2. Click domain
3. Force HTTPS: ON
4. Auto Renew: ON

## Support

If issues arise:

1. Check Hostinger status page
2. Contact Hostinger support via cPanel
3. Check Next.js documentation
4. Check browser console for errors (F12)

## Next Steps

After deployment:

- [ ] Add custom domain email
- [ ] Set up automated backups
- [ ] Configure analytics
- [ ] Test all payment methods
- [ ] Monitor uptime
- [ ] Gather feedback from first customers

---

**Estimated Time**: 20-30 minutes

**Deployment Frequency**: Update whenever you make changes (simple FTP upload)

**Maintenance**: Monitor logs, update services, fresh content
