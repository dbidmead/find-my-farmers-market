/**
 * Environment configuration utilities
 * Centralizes environment-specific settings for consistent usage across the app
 */

// Whether the app is running in production mode
export const isProd = process.env.NODE_ENV === 'production';

// The base path for assets and navigation in production
export const basePath = isProd ? '/find-my-farmers-market' : '';

// The asset prefix for images and other static assets
export const assetPrefix = isProd ? '/find-my-farmers-market/' : '';

// Base domain for full URLs (useful for sharing, SEO, etc.)
export const baseDomain = isProd 
  ? 'https://dbidmead.github.io' 
  : 'http://localhost:3000';

/**
 * Combine baseDomain with path for absolute URLs
 */
export const getFullUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseDomain}${basePath}${normalizedPath}`;
}; 