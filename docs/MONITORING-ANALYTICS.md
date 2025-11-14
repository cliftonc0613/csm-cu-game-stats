# Monitoring and Analytics Setup Guide

This guide provides instructions for setting up monitoring and analytics for the Clemson Sports Statistics Website. This is optional for v1 but recommended for production.

## Table of Contents

- [Overview](#overview)
- [Analytics Options](#analytics-options)
- [Performance Monitoring](#performance-monitoring)
- [Error Monitoring](#error-monitoring)
- [Uptime Monitoring](#uptime-monitoring)
- [Implementation Guide](#implementation-guide)
- [Privacy Considerations](#privacy-considerations)

---

## Overview

Monitoring and analytics help you understand:
- **How users interact** with your site
- **Which content is popular**
- **Performance issues** affecting users
- **Errors** that need fixing
- **Site availability** and uptime

### Recommended Stack (Privacy-Friendly)

For a university/public site, we recommend privacy-focused tools:

1. **Analytics**: Plausible or Simple Analytics (GDPR compliant, no cookies)
2. **Performance**: Vercel Analytics or Netlify Analytics
3. **Error Monitoring**: Sentry (free tier available)
4. **Uptime**: UptimeRobot (free tier available)

---

## Analytics Options

### Option 1: Plausible Analytics (Recommended)

**Pros:**
- Privacy-friendly (GDPR, CCPA compliant)
- No cookies required
- Lightweight (< 1 KB script)
- Simple, clean dashboard
- Open source

**Cons:**
- Paid service ($9/month for 10k pageviews)

**Setup:**

1. **Sign up at [plausible.io](https://plausible.io)**

2. **Add your domain:** `stats.clemson.edu`

3. **Add script to your site:**

Create `app/components/analytics/PlausibleAnalytics.tsx`:

```typescript
'use client';

export function PlausibleAnalytics() {
  // Only load in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <script
      defer
      data-domain="stats.clemson.edu"
      src="https://plausible.io/js/script.js"
    />
  );
}
```

4. **Add to root layout:**

```typescript
// app/layout.tsx
import { PlausibleAnalytics } from '@/components/analytics/PlausibleAnalytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <PlausibleAnalytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

5. **Set environment variable:**

```bash
# .env.local
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

**What you'll see:**
- Page views
- Unique visitors
- Top pages
- Referral sources
- Device types
- Countries

---

### Option 2: Simple Analytics

**Similar to Plausible:**
- Privacy-friendly
- GDPR compliant
- No cookies
- Lightweight

**Setup:**

1. Sign up at [simpleanalytics.com](https://simpleanalytics.com)
2. Add script:

```typescript
<script async src="https://scripts.simpleanalyticscdn.com/latest.js" />
```

---

### Option 3: Google Analytics 4

**Pros:**
- Free
- Comprehensive data
- Industry standard

**Cons:**
- Requires cookie consent banner
- Privacy concerns
- More complex setup
- Larger script (45 KB+)

**Setup:**

1. **Create GA4 property** at [analytics.google.com](https://analytics.google.com)

2. **Get Measurement ID** (looks like `G-XXXXXXXXXX`)

3. **Install `@next/third-parties`:**

```bash
npm install @next/third-parties
```

4. **Add to root layout:**

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

5. **Add environment variable:**

```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Note:** You'll need to add a cookie consent banner for GDPR compliance.

---

### Option 4: Netlify Analytics

**Pros:**
- Built into Netlify
- No scripts to add (server-side)
- No performance impact
- Privacy-friendly

**Cons:**
- Paid ($9/month)
- Less detailed than other options
- Netlify-only

**Setup:**

1. Go to your Netlify site dashboard
2. Navigate to **Analytics** tab
3. Click **Enable Analytics**
4. Billing info required

**What you'll see:**
- Pageviews
- Unique visitors
- Top pages
- Referrers
- Not found (404) pages

---

## Performance Monitoring

### Web Vitals Tracking

Track Core Web Vitals in your application:

**Install web-vitals:**

```bash
npm install web-vitals
```

**Create tracking component:**

```typescript
// app/components/analytics/WebVitals.tsx
'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    // Only in production
    if (process.env.NODE_ENV !== 'production') return;

    function sendToAnalytics(metric: any) {
      // Send to your analytics service
      console.log(metric);

      // Example: Send to Plausible
      if (window.plausible) {
        window.plausible('Web Vitals', {
          props: {
            metric: metric.name,
            value: metric.value,
            rating: metric.rating,
          },
        });
      }

      // Example: Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_rating: metric.rating,
        });
      }
    }

    // Track all Core Web Vitals
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}
```

**Add to layout:**

```typescript
// app/layout.tsx
import { WebVitals } from '@/components/analytics/WebVitals';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <WebVitals />
      </body>
    </html>
  );
}
```

**Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## Error Monitoring

### Sentry (Recommended)

Track JavaScript errors and exceptions in production.

**Setup:**

1. **Sign up at [sentry.io](https://sentry.io)** (free tier: 5k events/month)

2. **Install Sentry:**

```bash
npm install @sentry/nextjs
```

3. **Initialize Sentry:**

```bash
npx @sentry/wizard@latest -i nextjs
```

This creates:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

4. **Configure environment variables:**

```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
SENTRY_AUTH_TOKEN=your-auth-token
```

5. **Update Netlify environment variables:**
- Add `NEXT_PUBLIC_SENTRY_DSN`
- Add `SENTRY_AUTH_TOKEN`

**What you'll track:**
- JavaScript errors
- Unhandled exceptions
- API errors
- Performance issues
- User context

**Example error boundary:**

```typescript
// app/error.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## Uptime Monitoring

### UptimeRobot (Free)

Monitor site availability and get alerts when the site goes down.

**Setup:**

1. **Sign up at [uptimerobot.com](https://uptimerobot.com)** (free)

2. **Add a new monitor:**
   - Monitor Type: HTTP(s)
   - Friendly Name: Clemson Stats
   - URL: https://stats.clemson.edu
   - Monitoring Interval: 5 minutes

3. **Set up alerts:**
   - Email notifications
   - SMS (paid)
   - Slack/Discord webhooks (free)

4. **Create status page (optional):**
   - Public status page URL
   - Shows uptime statistics
   - Incident history

**What you'll get:**
- 99.9% uptime monitoring
- Email alerts when site is down
- Uptime statistics
- Response time tracking

---

### Alternative: Netlify Status

Netlify provides built-in status monitoring:
- Visit: https://www.netlifystatus.com/
- Subscribe to updates
- Check service status

---

## Implementation Guide

### Step 1: Choose Your Stack

**Minimal (Free):**
- Netlify Analytics built-in logs (view in dashboard)
- UptimeRobot (free tier)
- Browser DevTools for debugging

**Recommended (Best Balance):**
- Plausible Analytics ($9/month)
- Sentry free tier
- UptimeRobot free tier

**Enterprise (Comprehensive):**
- Google Analytics 4 (free)
- Sentry paid tier
- UptimeRobot paid tier
- Custom dashboard

### Step 2: Implementation Checklist

- [ ] Choose analytics provider
- [ ] Sign up and get API keys
- [ ] Install dependencies
- [ ] Add tracking scripts
- [ ] Set environment variables
- [ ] Test in development
- [ ] Deploy to production
- [ ] Verify tracking works
- [ ] Set up alerts

### Step 3: Testing

**Test analytics:**
1. Visit your site in production
2. Navigate to a few pages
3. Check analytics dashboard (wait 5-10 minutes)
4. Verify pageviews are recorded

**Test error monitoring:**
1. Trigger a test error:
```typescript
throw new Error('Test error for Sentry');
```
2. Check Sentry dashboard
3. Verify error appears

**Test uptime monitoring:**
1. Wait for first ping (5 minutes)
2. Check UptimeRobot dashboard
3. Verify site status is "Up"

---

## Privacy Considerations

### GDPR Compliance

If using privacy-friendly analytics (Plausible, Simple Analytics):
- ✅ No cookie consent banner required
- ✅ No PII collected
- ✅ GDPR compliant by default

If using Google Analytics:
- ❌ Cookie consent banner required
- ❌ Must anonymize IPs
- ❌ Must update privacy policy

### Cookie Consent Banner

If you choose Google Analytics, add a consent banner:

**Install cookie consent library:**

```bash
npm install react-cookie-consent
```

**Add consent banner:**

```typescript
// app/components/CookieConsent.tsx
'use client';

import CookieConsent from 'react-cookie-consent';

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={() => {
        // Initialize Google Analytics
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  );
}
```

### Privacy Policy

Update your privacy policy to include:
- What data is collected
- How it's used
- How long it's stored
- User rights (access, deletion)
- Third-party services used

**Example privacy policy section:**

```markdown
## Analytics

We use [Plausible Analytics] to understand how visitors use our site.
Plausible is privacy-friendly and does not use cookies or collect
personal information. Data collected includes:
- Page views
- Referral sources
- Device types
- Geographic regions (country level only)

No personally identifiable information is collected or stored.
```

---

## Dashboard Setup

### Plausible Dashboard

After setup, you'll see:

**Overview:**
- Total pageviews
- Unique visitors
- Bounce rate
- Visit duration

**Top Pages:**
- Most visited game pages
- Popular statistics
- Comparison page usage

**Sources:**
- Direct traffic
- Social media referrals
- Search engines
- Other websites

**Locations:**
- Countries
- US states (if applicable)

**Devices:**
- Desktop vs mobile split
- Browser types
- Operating systems

### Custom Events

Track specific interactions:

```typescript
// Track CSV exports
window.plausible('CSV Export', {
  props: {
    game: '2024-09-07-appalachian-state',
    format: 'full',
  },
});

// Track game comparisons
window.plausible('Game Comparison', {
  props: {
    games: '2',
  },
});

// Track search usage
window.plausible('Search', {
  props: {
    query: 'opponent name',
  },
});
```

---

## Recommended Metrics to Track

### Content Metrics
- Most viewed game pages
- Popular opponents
- Season trends
- Content engagement time

### User Behavior
- Search queries
- Filter usage
- Comparison feature usage
- CSV export frequency

### Performance Metrics
- Page load times
- Core Web Vitals
- API response times
- Error rates

### Business Metrics
- Total visitors
- Return visitor rate
- Peak traffic times
- Geographic distribution

---

## Cost Estimate

**Minimal Setup (Free):**
- Netlify logs: $0
- UptimeRobot: $0
- **Total: $0/month**

**Recommended Setup:**
- Plausible Analytics: $9/month
- Sentry (free tier): $0
- UptimeRobot: $0
- **Total: $9/month**

**Enterprise Setup:**
- Google Analytics 4: $0
- Sentry Pro: $26/month
- UptimeRobot Pro: $7/month
- **Total: $33/month**

---

## Future Enhancements

### v1.1 Features
- [ ] Basic analytics implementation
- [ ] Error monitoring setup
- [ ] Uptime monitoring

### v2.0 Features
- [ ] Custom analytics dashboard
- [ ] Real-time visitor counter
- [ ] A/B testing for features
- [ ] User session recording
- [ ] Heatmaps (Hotjar/Clarity)

---

## Support

For implementation help:

1. Check provider documentation
2. Review this guide
3. Test in development first
4. Contact Clemson IT if needed
5. Reach out to development team

---

## Resources

### Analytics
- [Plausible Documentation](https://plausible.io/docs)
- [Simple Analytics Docs](https://docs.simpleanalytics.com/)
- [Google Analytics 4 Docs](https://support.google.com/analytics)

### Performance
- [web-vitals Library](https://github.com/GoogleChrome/web-vitals)
- [Core Web Vitals Guide](https://web.dev/vitals/)

### Error Monitoring
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

### Uptime
- [UptimeRobot Documentation](https://uptimerobot.com/api/)

---

**Last Updated:** Task 9.11
**Status:** Ready for implementation when needed
