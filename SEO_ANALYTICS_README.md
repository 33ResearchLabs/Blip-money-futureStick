# SEO & Google Analytics Setup Guide

This document explains the SEO and Google Analytics implementation in your Blip Money application.

## Files Added

### 1. SEO Files

- **`public/sitemap.xml`** - XML sitemap for search engines
- **`public/robots.txt`** - Instructions for web crawlers
- **`public/manifest.json`** - PWA manifest file
- **`index.html`** - Updated with comprehensive SEO meta tags

### 2. Components

- **`src/components/GoogleAnalytics.tsx`** - Google Analytics integration component
- **`src/components/SEO.tsx`** - Dynamic SEO meta tags component

### 3. Utilities

- **`src/lib/analytics.ts`** - Helper functions for event tracking

### 4. Configuration

- **`.env`** - Environment variables for Google Analytics

## Google Analytics Setup

### Step 1: Get Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property (if you haven't already)
3. Set up a GA4 data stream for your website
4. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### Step 2: Configure Your Application

1. Open `.env` file in the root directory
2. Replace `G-XXXXXXXXXX` with your actual Measurement ID:
   ```
   VITE_GA_MEASUREMENT_ID=G-YOUR-ACTUAL-ID
   ```

### Step 3: Verify Installation

1. Start your development server: `npm run dev`
2. Open your browser's developer tools
3. Go to Network tab and filter for "google-analytics"
4. Navigate your site - you should see GA requests

## Using Google Analytics

### Automatic Tracking

The app automatically tracks:
- Page views on every route change
- Initial page load

### Manual Event Tracking

Import the analytics helpers in your components:

```typescript
import { analytics } from '@/lib/analytics';

// Track button clicks
analytics.trackButtonClick('Sign Up Button');

// Track form submissions
analytics.trackFormSubmit('Contact Form');

// Track custom events
analytics.trackEngagement('video_play', 60);

// Track transactions
analytics.trackTransaction('TXN123', 99.99, 'USD');
```

### Custom Events

```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent({
  action: 'download',
  category: 'PDF',
  label: 'Product Brochure',
  value: 1,
});
```

## Using the SEO Component

The `SEO` component allows you to customize meta tags for each page:

```typescript
import SEO from '@/components/SEO';

function AboutPage() {
  return (
    <>
      <SEO
        title="About Us - Blip Money"
        description="Learn about Blip Money's mission to revolutionize payments"
        keywords="about blip money, payment solutions, fintech company"
        url="https://blip.money/about"
      />
      <div>Your page content...</div>
    </>
  );
}
```

### SEO Component Props

- `title` - Page title (default: from index.html)
- `description` - Meta description
- `keywords` - Meta keywords
- `image` - Open Graph image URL
- `url` - Canonical URL
- `type` - Open Graph type (website, article, etc.)

## SEO Best Practices Implemented

### 1. Meta Tags
- ✅ Title tags optimized for search engines
- ✅ Meta descriptions (150-160 characters)
- ✅ Meta keywords
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Canonical URLs

### 2. Technical SEO
- ✅ Sitemap.xml for search engine indexing
- ✅ Robots.txt for crawler instructions
- ✅ Semantic HTML structure
- ✅ Mobile-responsive design
- ✅ Fast loading times (Vite optimization)

### 3. Sitemap Management

Update `public/sitemap.xml` when adding new pages:

```xml
<url>
  <loc>https://blip.money/your-new-page</loc>
  <lastmod>2025-01-26</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

### 4. Robots.txt

The `robots.txt` file controls crawler access. To block specific pages:

```
User-agent: *
Disallow: /admin/
Disallow: /api/
```

## PWA Features

The `manifest.json` enables Progressive Web App features:
- Add to home screen on mobile devices
- Standalone app experience
- Custom app icons
- Splash screen configuration

## Testing Your SEO

### 1. Google Search Console
- Add your site to [Google Search Console](https://search.google.com/search-console/)
- Submit your sitemap: `https://blip.money/sitemap.xml`
- Monitor indexing and search performance

### 2. Testing Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (built into Chrome DevTools)

### 3. Local Testing
```bash
npm run build
npm run preview
```

## Performance Monitoring

Google Analytics tracks:
- Page load times
- User engagement metrics
- Conversion tracking
- Custom events
- E-commerce transactions

## Troubleshooting

### Google Analytics Not Working

1. Check that `VITE_GA_MEASUREMENT_ID` is set correctly in `.env`
2. Verify the ID format: `G-XXXXXXXXXX` (not `UA-XXXXXXXXXX`)
3. Check browser console for errors
4. Ensure ad blockers are disabled during testing
5. Wait 24-48 hours for data to appear in GA dashboard

### SEO Issues

1. Validate your sitemap: `https://www.xml-sitemaps.com/validate-xml-sitemap.html`
2. Test robots.txt: `https://yoursite.com/robots.txt`
3. Check meta tags in browser DevTools > Elements > `<head>`
4. Use Lighthouse audit in Chrome DevTools

## Security Notes

- Never commit sensitive API keys to version control
- The `.env` file is gitignored by default
- Google Analytics Measurement IDs are public-facing and safe to use client-side

## Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org](https://schema.org/) for structured data
- [Open Graph Protocol](https://ogp.me/)

## Next Steps

1. ✅ Set up Google Analytics property
2. ✅ Add your Measurement ID to `.env`
3. ✅ Test analytics in development
4. ✅ Submit sitemap to Google Search Console
5. ✅ Verify social sharing with Facebook/Twitter debuggers
6. ✅ Run Lighthouse audit
7. ✅ Monitor analytics dashboard

---

**Need Help?** Check the official documentation or open an issue in the repository.
