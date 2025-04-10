/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Static export disabled temporarily for successful build
  // output: 'export',
  // basePath: '/irescue',
  // trailingSlash: true,
  
  // Type checking and linting handled by Vercel build pipeline
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  eslint: {
    // Allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: process.env.NEXT_SKIP_TYPESCRIPT_AND_ESL_CHECK === 'true',
  },
  
  // Image optimization for better performance
  images: {
    // unoptimized: true, // Required for static export
    domains: [
      'example.com',
      'www.google.com',
      'images.google.com',
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      'i.imgur.com',
      'imgur.com',
      'cloudinary.com',
      'res.cloudinary.com',
      'picsum.photos',
      'placehold.co',
      'placeholdit.imgix.net',
      'loremflickr.com',
      'firebasestorage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimization settings
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },

  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  
  // For faster builds in production
  experimental: {
    // Only enable these in production
    ...(process.env.NODE_ENV === 'production' && {
      // Now we can enable optimizeCss since we've installed critters
      optimizeCss: true,
      optimizeServerReact: true,
      serverMinification: true,
    }),
  }
}

module.exports = nextConfig 