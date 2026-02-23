# Deployment Documentation for Solange Hair Braiding

Complete guide to deploying the static Next.js salon website to various platforms.

## Quick Start

Build the project for production:
```bash
npm run build
```

This generates an `out/` directory with all static files.

## Supported Hosting Platforms

### 1. **Hostinger Shared Hosting** ⭐ (Recommended for this project)

- **Setup Time**: ~20 minutes
- **Cost**: $2-6/month
- **Best for**: Single salon website
- **Documentation**: See [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)

**Steps**:
1. Build: `npm run build`
2. Upload `out/` via FTP to `/public_html`
3. Configure domain DNS
4. Test HTTPS

### 2. **Vercel** (Easiest for Next.js)

- **Setup Time**: ~5 minutes
- **Cost**: Free tier available, $20/month pro
- **Best for**: Rapid deployment with automatic builds
- **Docs**: https://vercel.com/docs

**Steps**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 3. **Netlify** (Great for static sites)

- **Setup Time**: ~10 minutes
- **Cost**: Free tier, $19/month pro
- **Best for**: Git-based deployments
- **Docs**: https://docs.netlify.com

**Steps**:
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Deploy automatically

### 4. **AWS S3 + CloudFront**

- **Setup Time**: ~30 minutes
- **Cost**: ~$5-20/month depending on traffic
- **Best for**: Scalability, multiple regions
- **Docs**: https://aws.amazon.com/s3/

**Steps**:
1. Create S3 bucket
2. Upload `out/` contents
3. Set up CloudFront distribution
4. Point domain via Route53

### 5. **GitHub Pages** (Free but limited)

- **Setup Time**: ~15 minutes
- **Cost**: Free
- **Best for**: Portfolio/demo
- **Limitation**: No server functions needed (perfect for static!)

**Steps**:
1. Push to GitHub
2. Enable Pages in settings
3. Deploy from `main` branch

### 6. **Traditional VPS/Dedicated Server**

- **Setup Time**: ~60 minutes
- **Cost**: $5-100+/month
- **Best for**: Full control needed
- **Docs**: Provider specific

**Setup**:
```bash
# SSH into server
ssh user@server.ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and build
git clone <repo>
cd solange
npm install
npm run build

# Use Nginx or Apache to serve 'out/' directory
```

## Environment Variables by Platform

### Hostinger
- Edit `.env.local` locally
- Rebuild before uploading
- Variables embedded in HTML at build time

### Vercel
- Add in Project Settings → Environment Variables
- Auto-deploys on variable changes
- No rebuild needed

### Netlify
- Add in Site Settings → Build & Deploy → Environment
- Trigger rebuild after adding
- Git-based workflow

### AWS
- Use AWS Secrets Manager
- Reference in build script
- Rebuild before deployment

## Video Hosting for Hero Section

### Option 1: Cloudinary (Recommended)
```bash
# Sign up: https://cloudinary.com
# Upload video, get public URL
# Use in admin dashboard
NEXT_PUBLIC_HERO_VIDEO_URL=https://res.cloudinary.com/.../video.mp4
```

### Option 2: AWS S3
```
NEXT_PUBLIC_HERO_VIDEO_URL=https://s3.amazonaws.com/your-bucket/hero.mp4
```

### Option 3: Local (Hostinger)
```
NEXT_PUBLIC_HERO_VIDEO_URL=/videos/hero.mp4
# Upload video to public/videos/ before deployment
```

## Deployment Checklist

- [ ] Update `.env.local` with production values
- [ ] Test locally: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Test build output: `npm start` or manually check `out/`
- [ ] Verify all environment variables loaded
- [ ] Upload to hosting
- [ ] Test HTTPS/SSL
- [ ] Verify all pages load
- [ ] Test booking flow (use test payment cards)
- [ ] Test Tawk chat widget
- [ ] Mobile responsive test
- [ ] Performance check (Lighthouse)
- [ ] SEO check (meta tags, sitemap)

## Performance Monitoring

### Google PageSpeed Insights
1. Go to: https://pagespeed.web.dev
2. Enter your domain
3. Check scores:
   - Performance: 80+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

### Lighthouse (Chrome DevTools)
1. Right-click → Inspect → Lighthouse
2. Run audit
3. Fix issues reported

### Uptime Monitoring
- https://uptimerobot.com
- https://statuspage.io
- Hostinger/Vercel built-in monitoring

## Rollback Strategy

### For Hostinger
1. Keep backup of previous `out/` folder
2. If issues, re-upload previous version
3. Update domain DNS if needed

### For Vercel/Netlify
1. Previous deployments auto-saved
2. One-click rollback in dashboard
3. Can revert to any previous commit

## Cost Comparison

| Platform | Monthly Cost | Scalability | Setup Time |
|----------|-------------|-------------|-----------|
| **Hostinger** | $2-6 | Medium | 20 min |
| **Vercel** | Free-20 | High | 5 min |
| **Netlify** | Free-19 | High | 10 min |
| **AWS** | 5-100+ | Very High | 30 min |
| **GitHub Pages** | Free | Low | 15 min |

## Domain Configuration

### Hostinger (Included)
- Register domain through Hostinger
- Auto-configured
- DNS managed in cPanel

### External Domain
1. Update DNS A records:
   - Point to hosting provider's IP
   - Or CNAME to provider's domain
2. May take 24-48 hours to propagate
3. Set up HTTPS (usually automatic)

## Security Checklist

- [ ] HTTPS enabled (green lock icon)
- [ ] Security headers configured
- [ ] No sensitive data in build
- [ ] Payment info uses official providers
- [ ] Environment variables in `.env.local` (not git)
- [ ] Admin dashboard protected (add auth in production)
- [ ] Regular backups enabled
- [ ] Security monitoring enabled

## Continuous Deployment (Advanced)

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to Hostinger
        uses: SamKirkland/FTP-Deploy-Action@v4.0.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASS }}
          local-dir: ./out/
```

## Troubleshooting

### Build fails locally
```bash
# Clear cache and rebuild
rm -rf .next out node_modules
npm install
npm run build
```

### Variables not working
- Check `.env.local` exists
- Verify variable names match (case-sensitive)
- Restart dev server
- Rebuild before deploying

### Site 404 errors
- Ensure 404.html in `out/` (Next.js creates it)
- Check `.htaccess` for rewrites
- Verify all files uploaded
- Clear browser cache

### Slow performance
- Optimize images (TinyPNG)
- Use CDN for large files (Cloudinary for video)
- Enable Gzip compression
- Minimize JavaScript
- Use lazy loading

## Support Resources

- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/support
- **Netlify**: https://docs.netlify.com
- **Hostinger**: https://support.hostinger.com
- **AWS**: https://aws.amazon.com/support/

## Recommended Setup for Solange

**Best Balance of Cost + Simplicity + Performance**:

1. **Hostinger** (Primary)
   - Shared hosting at $2-6/month
   - Easy FTP deployment
   - Included domain + SSL

2. **Cloudinary** (Videos)
   - Free tier: 25GB storage
   - Auto-optimization
   - Fast CDN delivery

3. **Stripe** (Payments)
   - Cross-payment processing
   - Secure checkout
   - Monthly reporting

4. **Tawk.to** (Support)
   - Free chat widget
   - Customer conversations
   - Analytics included

5. **Uptime Robot** (Monitoring)
   - Free monitoring
   - Alerts if site down
   - Monthly reports

**Total Cost**: ~$5-10/month for a professional salon website

---

For specific platform deployment:
- Hostinger: [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)
- Others: See links above

Choose based on your comfort level and budget!
