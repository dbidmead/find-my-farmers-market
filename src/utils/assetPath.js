/**
 * Utility to get the correct asset path in both dev and production
 */
export function getAssetPath(path) {
  // Log the initial path
  console.log('getAssetPath js input:', path);
  
  const basePath = '/find-my-farmers-market';
  const isProd = process.env.NODE_ENV === 'production';
  
  // If we're not in production, just clean the path
  if (!isProd) {
    const result = path.startsWith('/') ? path : `/${path}`;
    console.log('DEV mode - returning:', result);
    return result;
  }
  
  // Ensure path is clean
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  console.log('Cleaned path:', cleanPath);
  
  // More thorough check for duplicate paths:
  // 1. Check if it starts with the basePath exactly
  const startsWithBase = cleanPath.startsWith(basePath);
  // 2. Check for any occurrences of the basePath in the middle of the path
  const hasBaseInMiddle = cleanPath.includes(`${basePath}/`);
  // 3. Check if it exactly equals the basePath
  const equalsBase = cleanPath === basePath;
  
  console.log('Path checks:', { 
    startsWithBase, 
    hasBaseInMiddle, 
    equalsBase,
    cleanPath, 
    basePath 
  });
  
  if (startsWithBase || hasBaseInMiddle || equalsBase) {
    // Log that we're preventing duplication
    console.log('Path already contains basePath, returning as-is:', cleanPath);
    return cleanPath;
  }
  
  // Add base path in production
  const finalPath = `${basePath}${cleanPath}`;
  console.log('getAssetPath js output:', finalPath);
  return finalPath;
}

/**
 * Get correct path for Next.js chunks and static assets
 */
export function getStaticPath(path) {
  const isProduction = process.env.NODE_ENV === 'production';
  const basePath = isProduction ? '/find-my-farmers-market' : '';
  
  // If not in production, just return the path
  if (!isProduction) {
    return path;
  }
  
  // For Next.js chunks and assets, ensure they have the correct path
  if (path.startsWith('/_next/')) {
    // Check if path already includes basePath
    if (path.startsWith(`${basePath}/_next/`)) {
      return path;
    }
    return `${basePath}${path}`;
  }
  
  // Ensure path is clean
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Check for existing basePath
  if (cleanPath.startsWith(basePath) || 
     cleanPath.includes(`${basePath}/`) || 
     cleanPath === basePath) {
    return cleanPath;
  }
  
  // Add basePath
  return `${basePath}${cleanPath}`;
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