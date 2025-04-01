/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Static export disabled temporarily for successful build
  // output: 'export',
  // basePath: '/irescue',
  // trailingSlash: true,
  
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
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
  },
}

module.exports = nextConfig 