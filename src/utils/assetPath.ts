/**
 * Utility functions for handling asset paths
 */

/**
 * Get asset path with the base path prefix (if in production)
 * 
 * @param path The path to the asset
 * @returns The asset path with base path prefix if needed
 */
export function getAssetPath(path: string): string {
  // Only add the base path in production
  const basePath = process.env.NODE_ENV === 'production' 
    ? (process.env.NEXT_PUBLIC_BASE_PATH || '') 
    : '';
  
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}

/**
 * Get image path, ensuring it has the correct prefix
 * 
 * @param path The path to the image
 * @returns The image path with correct prefix
 */
export function getImagePath(path: string): string {
  // Check if path already includes /images/
  if (path.includes('/images/')) {
    return getAssetPath(path);
  }
  return getAssetPath(`/images${path.startsWith('/') ? path : `/${path}`}`);
}

/**
 * Generate a full URL for an image based on environment
 * 
 * @param path The path to the image
 * @returns The full URL to the image
 */
export function getFullImageUrl(path: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  const baseDomain = isDev 
    ? 'http://localhost:3000' 
    : 'https://dbidmead.github.io';
  
  return `${baseDomain}${getAssetPath(path)}`;
} 