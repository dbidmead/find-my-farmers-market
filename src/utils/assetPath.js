/**
 * Utility to get the correct asset path in both dev and production
 */
export function getAssetPath(path) {
  // Log the initial path
  console.log('getAssetPath js input:', path);
  
  // Check for duplicate paths early
  const repeatedPath = path.match(/\/find-my-farmers-market\//g);
  if (repeatedPath && repeatedPath.length > 0) {
    console.error(`Input path already contains ${repeatedPath.length} repetitions of /find-my-farmers-market/`);
    console.error('Input path:', path);
  }

  const basePath = process.env.NODE_ENV === 'production' ? '/find-my-farmers-market' : '';
  
  // If we're not in production, just clean the path
  if (!basePath) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // Check if the path already contains the basePath anywhere
  if (path.includes(basePath) || path.includes(basePath.slice(1))) {
    // Already has the base path, return the path as is
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // Remove any leading slash to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Ensure no double slashes when concatenating
  const finalPath = `${basePath}/${cleanPath}`;
  console.log('getAssetPath js output:', finalPath);
  return finalPath;
}

/**
 * Get correct path for Next.js chunks and static assets
 */
export function getStaticPath(path) {
  const isProduction = process.env.NODE_ENV === 'production';
  const basePath = isProduction ? '/find-my-farmers-market' : '';
  
  // For Next.js chunks and assets, ensure they have the correct path
  if (path.startsWith('/_next/')) {
    return `${basePath}${path}`;
  }
  
  // Remove any leading slash to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${basePath}/${cleanPath}`;
}

/**
 * Get full URL for assets including domain
 */
export function getFullAssetUrl(path) {
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = isProduction ? 'https://dbidmead.github.io' : 'http://localhost:3000';
  const assetPath = getAssetPath(path);
  
  return `${domain}${assetPath}`;
} 