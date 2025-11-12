# Environment Variables Guide

This document explains the environment variables used in the Clemson Sports Statistics Website and how to configure them for deployment.

## Overview

This application uses minimal environment variables for configuration. Most settings are handled through Next.js configuration files.

## Environment Variables

### Required for Production

#### `NEXT_PUBLIC_SITE_URL`

- **Purpose**: Base URL for the production website
- **Used for**: SEO metadata (Open Graph tags, Twitter Cards, canonical URLs)
- **Default**: `https://clemson-stats.netlify.app`
- **Example**: `https://stats.clemson.edu` or `https://yourdomain.com`
- **Note**: The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser

### Automatic Variables (No Configuration Needed)

#### `NODE_ENV`

- **Automatically set by Next.js**
- **Values**: `development` (during `npm run dev`) or `production` (during `npm run build`/`npm start`)
- **Used for**: Console log removal in production, error boundary behavior

### Optional Development Tools

#### `ANALYZE`

- **Purpose**: Enable bundle size analysis
- **Usage**: `ANALYZE=true npm run build`
- **Default**: `false`
- **Note**: Requires `@next/bundle-analyzer` package (see `docs/PERFORMANCE.md`)

## Local Development Setup

1. **Copy the example file**:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** (optional):
   ```bash
   # Only needed if testing with a different domain
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Restart the development server** if it's running:
   ```bash
   npm run dev
   ```

## Netlify Deployment Setup

### Method 1: Netlify UI

1. **Log in to Netlify** and navigate to your site
2. Go to **Site settings** > **Environment variables**
3. Click **Add a variable**
4. Set the following:
   - **Key**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: Your production domain (e.g., `https://stats.clemson.edu`)
   - **Scopes**: Select "All" or "Production" as needed
5. Click **Save**
6. **Trigger a new deploy** to apply the changes

### Method 2: netlify.toml (Recommended)

Add environment variables directly to `netlify.toml`:

```toml
[build.environment]
  NEXT_PUBLIC_SITE_URL = "https://stats.clemson.edu"
```

**⚠️ Security Note**: Only add non-sensitive variables to `netlify.toml` since it's committed to the repository. For sensitive keys (API keys, secrets), always use the Netlify UI.

### Method 3: Netlify CLI

```bash
netlify env:set NEXT_PUBLIC_SITE_URL "https://stats.clemson.edu"
```

## Deploy Context-Specific Variables

You can set different values for different deploy contexts:

```toml
# Production environment
[context.production.environment]
  NEXT_PUBLIC_SITE_URL = "https://stats.clemson.edu"

# Deploy previews (PR previews)
[context.deploy-preview.environment]
  NEXT_PUBLIC_SITE_URL = "https://deploy-preview--clemson-stats.netlify.app"

# Branch deploys
[context.branch-deploy.environment]
  NEXT_PUBLIC_SITE_URL = "https://branch--clemson-stats.netlify.app"
```

## Verifying Environment Variables

### During Build

Netlify will show environment variables in the build logs (values are masked for security):

```
Environment variables:
  NEXT_PUBLIC_SITE_URL: "https://stats.clemson.edu"
  NODE_ENV: "production"
```

### In the Application

You can verify the site URL is set correctly by:

1. **Viewing page source** on any game detail page
2. **Looking for Open Graph tags**:
   ```html
   <meta property="og:url" content="https://stats.clemson.edu/games/..." />
   ```

3. **Checking browser console** (development only):
   ```javascript
   console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
   ```

## Troubleshooting

### Variable not updating after change

1. **Clear Netlify cache**:
   - Go to Site settings > Build & deploy > Build settings
   - Click "Clear cache and retry deploy"

2. **Ensure variable scope is correct**:
   - Check that the variable applies to your deploy context (production, preview, etc.)

3. **Verify build logs**:
   - Check that the variable appears in the "Environment variables" section of the build log

### SEO tags showing wrong domain

1. **Check environment variable** in Netlify UI
2. **Verify build completed** after setting the variable
3. **Clear browser cache** and test in incognito mode
4. **Check page source** to see the actual rendered meta tags

### Default URL appearing instead of custom domain

This is expected behavior when `NEXT_PUBLIC_SITE_URL` is not set. The application defaults to `https://clemson-stats.netlify.app`. To fix:

1. Set `NEXT_PUBLIC_SITE_URL` in Netlify
2. Redeploy the site
3. Verify in page source

## Security Best Practices

1. **Never commit `.env.local`** to version control (already in `.gitignore`)
2. **Never put API keys or secrets** in `netlify.toml` (visible in repository)
3. **Use Netlify UI for sensitive variables** (encrypted and hidden in logs)
4. **Use `NEXT_PUBLIC_` prefix only** for variables that are safe to expose to the browser
5. **Rotate keys regularly** if you add authentication or API integrations in the future

## Future Considerations

As the application grows, you may need additional environment variables for:

- **Analytics**: Google Analytics ID, Plausible domain
- **CMS Integration**: API keys for content management systems
- **Authentication**: Auth0, Clerk, or NextAuth configuration
- **API Endpoints**: Third-party sports data APIs
- **CDN**: Custom image CDN configuration

Update this document when adding new environment variables.

## Related Documentation

- [Netlify Environment Variables Documentation](https://docs.netlify.com/environment-variables/overview/)
- [Next.js Environment Variables Documentation](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Performance Guide](./PERFORMANCE.md) - Bundle analysis setup
- [Deployment Guide](../README.md#deployment) - Full deployment instructions
