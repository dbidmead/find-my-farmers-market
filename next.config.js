/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/find-my-farmers-market',
  images: {
    domains: ['maps.googleapis.com'],
    unoptimized: true,
  },
  // Set to true to allow client-side navigation for dynamic routes
  trailingSlash: true,
};

module.exports = nextConfig; 