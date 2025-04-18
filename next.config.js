/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/farmers-market-directory' : '';

const nextConfig = {
  reactStrictMode: true,
  output: isProduction ? 'export' : undefined,
  basePath: basePath,
  assetPrefix: isProduction ? '/farmers-market-directory' : '',
  trailingSlash: true,
  // Ensure styles are loaded correctly in production
  optimizeFonts: true,
  swcMinify: true,
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
    // CSS handling for static export
    optimizeCss: true,
  },
  webpack: (config) => {
    // Add file loader for images/assets
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
    });
    
    // Ensure CSS is properly extracted and not ignored
    const cssRule = config.module.rules.find(rule => 
      rule.test && rule.test.toString().includes('.css')
    );
    
    if (cssRule) {
      cssRule.use = [
        ...cssRule.use,
      ];
    }
    
    return config;
  },
};

module.exports = nextConfig; 