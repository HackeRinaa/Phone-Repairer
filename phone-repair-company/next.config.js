/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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