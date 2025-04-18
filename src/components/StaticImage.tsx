import React from 'react';
import { getAssetPath } from '@/utils/assetPath';

interface StaticImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
  skipPathProcessing?: boolean;
}

/**
 * A simple image component that uses HTML img tag
 * More reliable for static exports with GitHub Pages
 */
const StaticImage: React.FC<StaticImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  style,
  skipPathProcessing = false,
}) => {
  // Debugging: Log the input src
  console.log('StaticImage component input src:', src);

  // Ensure proper path handling using the assetPath utility
  const imagePath = skipPathProcessing ? src : getAssetPath(src);
  
  // Log the final path and check for duplicate /find-my-farmers-market/
  console.log('StaticImage component final path:', imagePath);
  const repeatedPath = imagePath.match(/\/find-my-farmers-market\//g);
  if (repeatedPath && repeatedPath.length > 1) {
    console.error(`DUPLICATE PATH DETECTED in StaticImage component: ${repeatedPath.length} repetitions of /find-my-farmers-market/`);
    console.error('Full path:', imagePath);
  }
  
  return (
    <img
      src={imagePath}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      style={style}
    />
  );
};

export default StaticImage; 