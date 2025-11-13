/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://clemson-stats.netlify.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Small site, no need for index sitemap

  // Exclude paths
  exclude: [
    '/api/*',
    '/404',
  ],

  // Additional paths to include (if needed)
  additionalPaths: async (config) => {
    const result = [];

    // Add any additional custom paths here if needed
    // For now, Next.js will auto-discover all static routes

    return result;
  },

  // robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*'],
      },
    ],
    additionalSitemaps: [
      // Add additional sitemaps here if needed in the future
      // e.g., 'https://clemson-stats.netlify.app/sitemap-images.xml',
    ],
  },

  // Change frequency and priority settings
  changefreq: 'weekly',
  priority: 0.7,

  // Transform each entry in the sitemap
  transform: async (config, path) => {
    // Custom priority for different page types
    let priority = 0.7;
    let changefreq = 'weekly';

    // Homepage gets highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Game detail pages
    else if (path.startsWith('/games/')) {
      priority = 0.8;
      changefreq = 'monthly'; // Game stats don't change often
    }
    // Comparison page
    else if (path === '/compare') {
      priority = 0.6;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
