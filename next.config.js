/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/find-my-farmers-market' : '',
  assetPrefix: isProd ? '/find-my-farmers-market/' : '',
  images: {
    unoptimized: true,
    domains: ['localhost', 'dbidmead.github.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // This is crucial for handling CSS and image paths correctly
  trailingSlash: true,
  // Disable the ESLint rule for img elements since we need them for static exports
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 