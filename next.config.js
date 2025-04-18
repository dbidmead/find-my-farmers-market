/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['maps.googleapis.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://www.usdalocalfoodportal.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 