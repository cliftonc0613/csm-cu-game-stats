import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,

  // Enable static HTML export for SSG deployment
  // Uncomment this line when ready to deploy as a static site
  // output: 'export',

  // Image optimization configuration
  images: {
    // For static export, use unoptimized images
    // When deploying to Netlify/Vercel with server, this can be set to false
    unoptimized: false,

    // Supported image formats
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Allowed image domains (add external image sources here)
    domains: [],

    // Remote patterns for external images (Next.js 13+)
    remotePatterns: [
      // Example: Allow images from external sources
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Ensure server-only packages aren't bundled for client
  serverExternalPackages: ['sanitize-html'],

  // Experimental features for better SSG performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@/components', '@/lib'],
  },

  // Strict mode for better React practices
  reactStrictMode: true,

  // Power optimization for static pages
  poweredByHeader: false,

  // Compression
  compress: true,

  // Trailing slash behavior
  trailingSlash: false,

  // Generate ETags for caching
  generateEtags: true,
};

export default nextConfig;
