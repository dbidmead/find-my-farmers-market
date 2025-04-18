import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { getAssetPath } from '@/utils/assetPath';

interface CustomImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
  fallback?: string;
}

/**
 * Custom Image component that handles asset path translation for both
 * development and production environments
 */
const Image: React.FC<CustomImageProps> = ({ 
  src, 
  fallback = '/farm-basket-logo.svg',
  alt,
  ...props 
}) => {
  // Use getAssetPath to ensure the correct path is used
  const imagePath = getAssetPath(src);
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If the image fails to load, use the fallback
    if (fallback) {
      const imgElement = e.currentTarget;
      imgElement.src = getAssetPath(fallback);
    }
  };

  return (
    <img
      src={imagePath}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};

export default Image; 