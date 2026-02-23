# Solange Hair Braiding - Premium Static Salon Website

A luxury static Next.js website with liquid glass design for a premium hair braiding salon. Built for fast performance and easy deployment on shared hosting.

## 🎨 Features

### Design & UI
- **Liquid Glass Aesthetic**: Glassmorphism design with frosted glass components, blurred backgrounds, and soft gradients
- **Mobile-First Design**: Optimized primary focus on mobile devices
- **Premium Animations**: Smooth transitions and micro-interactions
- **Responsive Layout**: Perfectly optimized for all screen sizes

### Core Features
- **Homepage with Hero Video Section**: Admin-managed video with fallback image
- **Service Showcase**: Detailed service pages with pricing and duration
- **Online Booking System**: Multi-step booking flow with stylist selection
- **Payment Integration**: Stripe, PayPal, and Mobile Money support
- **Customer Messaging**: Tawk.to live chat integration
- **Admin Dashboard**: Manage bookings, videos, services, and settings

### Pages Included
- `Home` - Hero video section with services overview
- `Services` - Detailed service descriptions and care instructions
- `About` - Team introduction and business story
- `Contact` - Contact form and business information
- `Booking` - Multi-step appointment booking
- `Admin` - Dashboard for managing salon operations
- `Confirmation` - Booking confirmation page
- `Privacy & Terms` - Legal pages

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser
- Text editor (VS Code recommended)

### Installation

```bash
# Clone the repository
cd solange

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### Development

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Build for Production

```bash
# Build and export static site
npm run build

# This generates an `out/` directory with static files
```

## 📋 Configuration

### Environment Variables

Create `.env.local` based on `.env.local.example`:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_ID
PAYPAL_CLIENT_SECRET=YOUR_SECRET

# Tawk.to
NEXT_PUBLIC_TAWK_ID=YOUR_ID

# Video URLs
NEXT_PUBLIC_HERO_VIDEO_URL=/videos/hero.mp4
```

## 💬 Setting Up Tawk.to

1. Go to [tawk.to](https://tawk.to) and create account
2. Get your Property ID
3. Update `NEXT_PUBLIC_TAWK_ID` in `.env.local`
4. Chat widget automatically appears on all pages

## 💳 Payment Setup

### Stripe
1. Create [Stripe](https://stripe.com) account
2. Get Publishable Key and Secret Key
3. Update environment variables
4. Test with card: `4242 4242 4242 4242`

### PayPal
1. Create [PayPal Developer](https://developer.paypal.com) account
2. Get Client ID and Secret
3. Update environment variables

### Mobile Money
1. Register with MTN or Orange Mobile Money
2. Get API credentials
3. Integrate via respective APIs

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── services/page.tsx   # Services page
│   ├── about/page.tsx      # About page
│   ├── contact/page.tsx    # Contact page
│   ├── booking/page.tsx    # Booking page
│   ├── admin/page.tsx      # Admin dashboard
│   └── confirmation/page.tsx # Confirmation
├── components/
│   ├── ui/
│   │   ├── Navigation.tsx   # Header navigation
│   │   ├── Footer.tsx       # Footer
│   │   ├── Button.tsx       # Button component
│   │   ├── GlassCard.tsx    # Glass card component
│   │   └── HeroSection.tsx  # Hero section
│   └── sections/
│       ├── HeroVideo.tsx    # Video hero section
│       ├── ServicesSection.tsx
│       ├── TestimonialsSection.tsx
│       └── CTASection.tsx
├── styles/
│   └── globals.css         # Global CSS
├── public/
│   ├── videos/             # Video files
│   └── images/             # Image assets
next.config.ts             # Next.js config
tailwind.config.ts         # Tailwind config
tsconfig.json              # TypeScript config
```

## 🌐 Deployment

### Hostinger Shared Hosting

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload to Hostinger**:
   - Connect via FTP/SFTP
   - Upload contents of `out/` directory to public_html
   - No server-side processing needed

3. **Configure Domain**:
   - Point domain to Hostinger in DNS settings
   - Enable HTTPS (free SSL included)

### Other Hosting Options

- **Vercel** (recommended for Next.js)
- **Netlify** (static hosting)
- **AWS S3 + CloudFront**
- **GitHub Pages** (simple static)

## 🔧 Customization

### Colors & Branding

Edit `src/app/globals.css` to customize:
- Primary color: `--primary: #E8D5C4`
- Accent color: `--accent: #8B6F47`
- Glass effects: `--glass-bg`, `--glass-shadow`

### Typography

Fonts are loaded from Google Fonts:
- Display: Playfair Display
- Body: Outfit

Update in `src/app/layout.tsx`

### Services & Pricing

Edit:
- Homepage: `src/components/sections/ServicesSection.tsx`
- Services page: `src/app/services/page.tsx`
- Booking: `src/app/booking/page.tsx`

### Admin Dashboard

Access at `/admin` (in production, add authentication):
- Manage bookings
- Update hero video
- Edit services
- Configure settings

## 📊 Analytics & Tracking

Integrate Google Analytics:
1. Create GA4 property
2. Add ID to `.env.local`
3. Uncomment GA script in `layout.tsx`

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env.local`
2. **HTTPS**: Always use HTTPS in production
3. **API Keys**: Rotate keys regularly
4. **Admin Access**: Add authentication in production
5. **Payment Security**: Use official payment plugins only

## 📱 Mobile Optimization

- Responsive design (mobile-first)
- Optimized images and videos
- Touch-friendly buttons (44px minimum)
- Reduced data usage for video
- Fast loading (< 3 seconds)

## 🎥 Adding Custom Hero Video

1. **Upload video**:
   - Use service like Cloudinary or AWS S3
   - Get public URL
   - Recommended: MP4 format, <10MB

2. **Update Admin Dashboard**:
   - Go to `/admin`
   - Enter video URL in Hero Video section
   - Update fallback image
   - Save changes

3. **Video appears** on next page load

## 💡 Tips

- Use CDN for videos and images
- Optimize images with TinyPNG
- Test on real mobile devices
- Monitor performance with Lighthouse
- Keep content fresh and updated

## 🛠 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next && npm run build
```

### Environment Variable Issues
```bash
# Ensure .env.local is in root directory
# Check variable names match exactly
# Restart development server
```

### Video Not Loading
- Check video URL is accessible
- Verify file format (MP4/WebM)
- Check file size < 50MB
- Fallback image should be available

## 📞 Support

For help or questions:
- Email: hello@solange.salon
- Website: solange-salon.com
- GitHub: [solange-salon](https://github.com/yourusername/solange)

## 📄 License

MIT License - Feel free to use and modify

## 🎯 Roadmap

- [ ] Backend database integration
- [ ] Email notification system
- [ ] Customer account portal
- [ ] Advanced admin dashboard
- [ ] Inventory management
- [ ] Staff scheduling
- [ ] Review system
- [ ] Loyalty program

---

Built with ❤️ for Solange Hair Braiding
