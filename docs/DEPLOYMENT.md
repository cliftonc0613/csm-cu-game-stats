# Deployment Guide - Netlify

This guide provides step-by-step instructions for deploying the Clemson Sports Statistics Website to Netlify.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Deployment Setup](#initial-deployment-setup)
3. [Automatic Deployments Configuration](#automatic-deployments-configuration)
4. [Deploy Previews for Pull Requests](#deploy-previews-for-pull-requests)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)
8. [Deployment Workflow](#deployment-workflow)

---

## Prerequisites

Before deploying to Netlify, ensure you have:

- ✅ A GitHub account with access to this repository
- ✅ A Netlify account (free tier is sufficient for v1)
- ✅ Completed local build test (`npm run build` succeeds)
- ✅ All code committed and pushed to the `develop` branch
- ✅ Repository is public or Netlify has access to private repos

**Create a Netlify Account:**
1. Visit [https://app.netlify.com/signup](https://app.netlify.com/signup)
2. Sign up with GitHub (recommended for seamless integration)
3. Authorize Netlify to access your GitHub repositories

---

## Initial Deployment Setup

### Step 1: Connect GitHub Repository

1. **Log in to Netlify** at [https://app.netlify.com](https://app.netlify.com)

2. **Click "Add new site"** → **"Import an existing project"**

3. **Connect to Git provider:**
   - Click **"GitHub"**
   - Authorize Netlify if prompted
   - Search for and select `cliftonc0613/csm-cu-game-stats`

4. **Configure build settings:**

   Netlify should auto-detect Next.js settings. Verify the following:

   | Setting | Value |
   |---------|-------|
   | **Branch to deploy** | `develop` (or `main` for production) |
   | **Build command** | `npm run build` |
   | **Publish directory** | `.next` |
   | **Functions directory** | (leave blank) |

   > **Note:** The `netlify.toml` file in the repository will override these settings if present.

5. **Configure environment variables** (optional at this stage):

   - Click **"Show advanced"** → **"New variable"**
   - Add: `NEXT_PUBLIC_SITE_URL` = `https://YOUR-SITE-NAME.netlify.app`
   - You can update this later with your custom domain

6. **Click "Deploy site"**

   Netlify will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run the build command (`npm run build`)
   - Deploy the `.next` directory

   **Initial deploy typically takes 2-4 minutes.**

### Step 2: Monitor First Deployment

1. **Watch the build log** in real-time:
   - You'll see the deploy status on the site dashboard
   - Click on the deploy to view detailed logs

2. **Verify successful deployment:**
   - Look for ✅ **"Site is live"** message
   - Note your temporary Netlify URL: `https://YOUR-SITE-NAME.netlify.app`

3. **Test the deployed site:**
   - Click the site URL to visit your deployed application
   - Test all major routes: homepage, game detail pages, comparison page
   - Verify API endpoints are working

---

## Automatic Deployments Configuration

Netlify automatically deploys when you push to your configured branch. Here's how to customize this behavior:

### Configure Deploy Branches

1. **Navigate to Site Settings:**
   - Go to **Site configuration** → **Build & deploy** → **Continuous deployment**

2. **Production Branch:**
   - Set **Production branch** to `main` or `develop`
   - This branch will deploy to your production URL
   - Configured in `netlify.toml`:
     ```toml
     [context.production]
       command = "npm run build"
     ```

3. **Branch Deploys:**
   - Enable **"Deploy only the production branch"** for production-only deploys
   - OR enable **"Deploy all branches"** to create deploy previews for all branches
   - Recommended: Deploy only production branch + PR previews

### Deploy Hooks (Optional)

Create a deploy hook URL to trigger deployments from external services:

1. Go to **Site configuration** → **Build & deploy** → **Deploy hooks**
2. Click **"Add deploy hook"**
3. Name it (e.g., "Manual Deploy")
4. Select the branch to deploy
5. Use the generated webhook URL to trigger builds:
   ```bash
   curl -X POST https://api.netlify.com/build_hooks/YOUR_HOOK_ID
   ```

---

## Deploy Previews for Pull Requests

Deploy previews automatically create a unique URL for every pull request, allowing you to test changes before merging.

### Enable Deploy Previews

1. **Navigate to Deploy Settings:**
   - Go to **Site configuration** → **Build & deploy** → **Deploy contexts**

2. **Configure Deploy Previews:**
   - Under **"Deploy previews"**, select **"Any pull request against your production branch"**
   - This creates a preview deploy for every PR to `main`/`develop`

3. **Branch Deploy Configuration:**
   - Choose whether to deploy all branches or specific branches
   - Recommended: **"Deploy only production branch"** to save build minutes

### How Deploy Previews Work

When you create a pull request:

1. **Netlify automatically:**
   - Detects the new PR
   - Runs the build (`npm run build`)
   - Deploys to a unique preview URL

2. **Preview URL format:**
   ```
   https://deploy-preview-{PR_NUMBER}--{SITE_NAME}.netlify.app
   ```

3. **GitHub Integration:**
   - Netlify posts a status check to the PR
   - Shows "Deploy Preview ready" with a link
   - Updates on every new commit to the PR branch

4. **Preview Lifecycle:**
   - Deploys are kept for 30 days after PR is closed
   - Automatically deleted after 30 days to save storage

### Testing Deploy Previews

1. **Create a test branch:**
   ```bash
   git checkout -b feature/test-deploy-preview
   echo "Test change" >> README.md
   git add README.md
   git commit -m "test: verify deploy preview"
   git push origin feature/test-deploy-preview
   ```

2. **Open a pull request** on GitHub against `develop`

3. **Wait for Netlify bot comment** with the preview URL

4. **Click the preview URL** and verify your changes

---

## Custom Domain Setup

### Option 1: Netlify Subdomain (Free)

Your site is automatically available at:
```
https://YOUR-SITE-NAME.netlify.app
```

To customize the subdomain:
1. Go to **Site configuration** → **Domain management** → **Domains**
2. Click **"Options"** → **"Edit site name"**
3. Enter your desired name (e.g., `clemson-stats`)
4. Update `NEXT_PUBLIC_SITE_URL` environment variable to match

### Option 2: Custom Domain (Recommended for Production)

#### Using Netlify DNS (Easiest)

1. **Add your custom domain:**
   - Go to **Site configuration** → **Domain management** → **Domains**
   - Click **"Add domain"**
   - Enter your domain (e.g., `stats.clemson.edu`)

2. **Configure Netlify DNS:**
   - Click **"Set up Netlify DNS"**
   - Copy the nameservers provided
   - Update nameservers at your domain registrar
   - Wait for DNS propagation (up to 48 hours, usually < 1 hour)

3. **Enable HTTPS:**
   - Netlify automatically provisions a free SSL certificate via Let's Encrypt
   - Certificate renews automatically every 90 days

#### Using External DNS

1. **Add custom domain** in Netlify (same as above)

2. **Add DNS records** at your DNS provider:

   For apex domain (e.g., `clemson-stats.com`):
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

   For subdomain (e.g., `stats.clemson.edu`):
   ```
   Type: CNAME
   Name: stats
   Value: YOUR-SITE-NAME.netlify.app
   ```

3. **Verify DNS configuration:**
   ```bash
   dig stats.clemson.edu
   ```

4. **Enable HTTPS** (automatic after DNS verification)

### Update Environment Variables

After setting up a custom domain:

1. **Update `NEXT_PUBLIC_SITE_URL`:**
   - Go to **Site configuration** → **Environment variables**
   - Edit `NEXT_PUBLIC_SITE_URL`
   - Set to your custom domain (e.g., `https://stats.clemson.edu`)

2. **Redeploy the site:**
   - Go to **Deploys** → Click **"Trigger deploy"** → **"Clear cache and deploy site"**
   - This ensures SEO metadata uses the correct domain

---

## Post-Deployment Verification

After your first successful deployment, verify the following:

### 1. Site Accessibility

- [ ] Visit the Netlify URL and confirm the site loads
- [ ] Check homepage renders correctly
- [ ] Navigate to at least 2 game detail pages
- [ ] Test the comparison page with multiple games
- [ ] Verify search and filter functionality

### 2. SEO Metadata

View page source and verify:

- [ ] `<title>` tags are correct for each page
- [ ] Open Graph meta tags include the correct `og:url`
- [ ] Twitter Card meta tags are present
- [ ] Canonical URLs use the production domain

Example check:
```bash
curl -s https://YOUR-SITE.netlify.app/games/2024-09-07-appalachian-state | grep "og:url"
```

Expected output:
```html
<meta property="og:url" content="https://YOUR-SITE.netlify.app/games/2024-09-07-appalachian-state" />
```

### 3. API Endpoints

Test API routes are accessible:

```bash
# Test games API
curl https://YOUR-SITE.netlify.app/api/games

# Should return JSON array of games
```

### 4. Performance Check

Run a Lighthouse audit:

1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Select **"Performance"** and **"SEO"**
4. Click **"Analyze page load"**

**Target scores:**
- Performance: 90+
- SEO: 95+
- Accessibility: 95+
- Best Practices: 90+

See `docs/PERFORMANCE.md` for detailed performance optimization guide.

### 5. Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)

See `docs/BROWSER-TESTING.md` for comprehensive browser testing checklist.

### 6. Mobile Responsiveness

Test on real devices or using DevTools device emulation:
- [ ] iPhone (various sizes)
- [ ] iPad
- [ ] Android phones
- [ ] Android tablets

See `docs/DEVICE-TESTING.md` for mobile testing guide.

---

## Troubleshooting

### Build Fails with "Command not found: next"

**Cause:** Dependencies not installed correctly.

**Solution:**
1. Check `package.json` includes `next` in dependencies
2. Clear Netlify cache: **Site settings** → **Build & deploy** → **Clear cache and deploy site**
3. Verify `npm install` runs in build logs

### Build Fails with TypeScript Errors

**Cause:** Type errors in the codebase.

**Solution:**
1. Run `npm run type-check` locally
2. Fix all TypeScript errors
3. Commit and push fixes
4. Retry deployment

### Pages Return 404 on Direct Access

**Cause:** Next.js routing not configured correctly.

**Solution:**
1. Verify `netlify.toml` includes redirect rules
2. Ensure `publish = ".next"` is set (not `out/`)
3. Check that `@netlify/plugin-nextjs` plugin is enabled

### Environment Variables Not Working

**Cause:** Variable not set or incorrect naming.

**Solution:**
1. Verify variable is set in **Site settings** → **Environment variables**
2. Ensure variable starts with `NEXT_PUBLIC_` for client-side access
3. Redeploy after adding/updating variables

### Slow Build Times

**Cause:** Dependencies or build process taking too long.

**Solution:**
1. Enable **Build image selection**: Go to **Site settings** → **Build & deploy** → **Build image** → Select **"Ubuntu Focal 20.04"**
2. Review build logs for slow steps
3. Consider caching strategies in `netlify.toml`

### Deploy Preview Not Triggering

**Cause:** Deploy preview settings disabled or GitHub integration issue.

**Solution:**
1. Verify deploy previews are enabled: **Site settings** → **Build & deploy** → **Deploy contexts**
2. Check GitHub app permissions: **Site settings** → **Build & deploy** → **Continuous deployment** → **Manage repository**
3. Re-authorize Netlify GitHub app if needed

---

## Deployment Workflow

### Standard Development Workflow

```bash
# 1. Create a feature branch
git checkout develop
git pull origin develop
git checkout -b feature/new-game-page

# 2. Make changes and commit
git add .
git commit -m "feat: add new game statistics page"

# 3. Push to GitHub
git push origin feature/new-game-page

# 4. Create pull request on GitHub
# - Netlify automatically creates a deploy preview
# - Test the preview URL before merging

# 5. Merge PR to develop
# - Netlify automatically deploys to production (if develop is production branch)
# - Or merge develop → main to trigger production deploy
```

### Hotfix Workflow

For critical production fixes:

```bash
# 1. Create hotfix branch from main/develop
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. Make the fix
git add .
git commit -m "fix: resolve critical issue with game data"

# 3. Push and create PR
git push origin hotfix/critical-bug-fix

# 4. After PR approval, merge to main
# - Deploys immediately to production
```

### Rollback Procedure

If a deployment introduces issues:

1. **Go to Netlify dashboard** → **Deploys**
2. Find the last known good deployment
3. Click **"..."** → **"Publish deploy"**
4. The site instantly reverts to that version
5. Fix the issue in code and redeploy

---

## Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/overview/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Environment Variables Guide](./ENVIRONMENT-VARIABLES.md)
- [Performance Optimization Guide](./PERFORMANCE.md)
- [Browser Testing Guide](./BROWSER-TESTING.md)

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Code is committed and pushed
- [ ] `NEXT_PUBLIC_SITE_URL` is set to production domain
- [ ] Custom domain DNS is configured (if using)
- [ ] Environment variables are set in Netlify
- [ ] Deploy previews are enabled for PRs
- [ ] Production branch is set correctly

After deployment:

- [ ] Site is accessible at production URL
- [ ] All pages load without errors
- [ ] API endpoints are working
- [ ] SEO metadata is correct
- [ ] Lighthouse performance score > 90
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

---

## Support

For deployment issues or questions:

1. Check Netlify build logs for specific errors
2. Review this documentation and related guides
3. Consult [Netlify Support Docs](https://docs.netlify.com/)
4. Contact the development team
5. Open an issue in the GitHub repository

---

**Last Updated:** Task 9.4
**Deployment Status:** Ready for production
