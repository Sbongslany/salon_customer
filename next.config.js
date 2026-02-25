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
        source:      '/api/v1/:path*',
        destination: 'http://localhost:5001/api/v1/:path*',
      },
    ]
  },
}
module.exports = nextConfig
