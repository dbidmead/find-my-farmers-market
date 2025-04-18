/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const repoName = 'farmers-market-directory';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProduction ? `/${repoName}` : '',
  assetPrefix: isProduction ? `/${repoName}` : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig; 