/**
 * Utility to get the correct asset path in both dev and production
 */
export function getAssetPath(path) {
  const basePath = process.env.NODE_ENV === 'production' ? '/farmers-market-directory' : '';
  
  // Remove any leading slash to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${basePath}/${cleanPath}`;
}

/**
 * Get correct path for Next.js chunks and static assets
 */
export function getStaticPath(path) {
  const isProduction = process.env.NODE_ENV === 'production';
  const basePath = isProduction ? '/farmers-market-directory' : '';
  
  // For Next.js chunks and assets, ensure they have the correct path
  if (path.startsWith('/_next/')) {
    return `${basePath}${path}`;
  }
  
  // Remove any leading slash to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${basePath}/${cleanPath}`;
} 