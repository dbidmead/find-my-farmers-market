/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/farmers-market-directory' : '';

const nextConfig = {
  reactStrictMode: true,
  output: isProduction ? 'export' : undefined,
  basePath: basePath,
  assetPrefix: isProduction ? '/farmers-market-directory/' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
    path: `${basePath}/_next/image`,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dbidmead.github.io',
        pathname: '/farmers-market-directory/**',
      },
    ],
  },
  // Make image handling more robust
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config) => {
    // Add file loader for images/assets
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig; 