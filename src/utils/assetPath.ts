/**
 * Utility functions for handling asset paths
 */

import { basePath, baseDomain } from './env';

/**
 * Get asset path with the base path prefix (if in production)
 * 
 * @param path The path to the asset
 * @returns The asset path with base path prefix if needed
 */
export function getAssetPath(path: string): string {
  // If basePath is empty (development), just ensure it starts with a slash
  if (!basePath) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // Ensure path is clean
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // More thorough check for duplicate paths:
  // 1. Check if it starts with the basePath exactly
  // 2. Check for any occurrences of the basePath in the middle of the path
  if (cleanPath.startsWith(basePath) || 
     cleanPath.includes(`${basePath}/`) || 
     cleanPath === basePath) {
    return cleanPath;
  }
  
  // Add base path in production
  return `${basePath}${cleanPath}`;
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
  return `${baseDomain}${getAssetPath(path)}`;
} 