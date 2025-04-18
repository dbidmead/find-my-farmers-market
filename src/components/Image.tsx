import React from 'react';
import NextImage from 'next/image';
import { getAssetPath } from '@/utils/assetPath';
import StaticImage from './StaticImage';
import { isProd } from '@/utils/env';

interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  fallback?: string;
  sizes?: string;
  style?: React.CSSProperties;
}

/**
 * Custom Image component that handles asset path translation for both
 * development and production environments
 * 
 * For static exports in production, it uses a simple <img> tag instead of Next/Image
 * which is more reliable for GitHub Pages and other static hosts
 */
const Image: React.FC<CustomImageProps> = ({ 
  src, 
  alt,
  width,
  height,
  className = "",
  fill = false,
  priority = false,
  fallback = '/farm-basket-logo.svg',
  sizes,
  style,
  ...props 
}) => {
  // Debugging: Log the input src 
  console.log('Image component input src:', src);

  // Use getAssetPath to ensure the correct path is used
  const imagePath = getAssetPath(src);
  
  // Log the final path and check for duplicate /find-my-farmers-market/
  console.log('Image component final path:', imagePath);
  const repeatedPath = imagePath.match(/\/find-my-farmers-market\//g);
  if (repeatedPath && repeatedPath.length > 1) {
    console.error(`DUPLICATE PATH DETECTED in Image component: ${repeatedPath.length} repetitions of /find-my-farmers-market/`);
    console.error('Full path:', imagePath);
  }
  
  // For production/static export, use StaticImage (regular img tag)
  if (isProd) {
    return (
      <StaticImage
        src={imagePath}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        style={{
          ...style,
          objectFit: fill ? 'cover' : undefined,
          position: fill ? 'absolute' : undefined,
          width: fill ? '100%' : undefined,
          height: fill ? '100%' : undefined,
        }}
        // Skip additional path processing since we've already processed the path
        skipPathProcessing={true}
      />
    );
  }
  
  // In development, use Next/Image
  return (
    <NextImage
      src={imagePath}
      alt={alt}
      width={fill ? undefined : (width || 100)}
      height={fill ? undefined : (height || 100)}
      className={className}
      fill={fill}
      priority={priority}
      sizes={sizes}
      unoptimized={true}
      style={style}
      {...props}
    />
  );
};

export default Image; 