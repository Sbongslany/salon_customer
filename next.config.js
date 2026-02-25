/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination:
            'https://salon-api-8bxj.onrender.com/api/v1/:path*',
      },
    ]
  },
}
module.exports = nextConfig
