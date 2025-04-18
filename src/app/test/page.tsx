'use client';

import { getAssetPath } from '../../utils/assetPath';
import Image from '../../components/Image';
import StaticImage from '../../components/StaticImage';
import ImageConfig from '../../components/ImageConfig';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <ImageConfig />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-xl mb-2">Using Next.js Image component:</h2>
          <div className="relative h-64 w-full">
            <Image 
              src="/images/crop-field.jpg"
              alt="Test image with Next.js"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Using HTML img tag with proper paths:</h2>
          <StaticImage 
            src="/images/crop-field.jpg"
            alt="Test image with HTML img"
            className="w-full h-64 object-cover"
          />
        </div>
        
        <div>
          <h2 className="text-xl mb-2">SVG with Next.js Image:</h2>
          <Image 
            src="/farm-basket-logo.svg"
            alt="SVG Logo"
            width={200} 
            height={200}
            className="object-contain"
          />
        </div>
        
        <div>
          <h2 className="text-xl mb-2">SVG with HTML img:</h2>
          <StaticImage 
            src="/farm-basket-logo.svg"
            alt="SVG Logo"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        <div>
          <h2 className="text-xl mb-2">Direct URL test:</h2>
          <img 
            src="https://dbidmead.github.io/find-my-farmers-market/images/crop-field.jpg" 
            alt="Direct URL test"
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p>Current NODE_ENV: {process.env.NODE_ENV}</p>
        <p>Base Path: {getAssetPath("")}</p>
        <p>Logo path: {getAssetPath("/farm-basket-logo.svg")}</p>
        <p>Image path: {getAssetPath("/images/crop-field.jpg")}</p>
      </div>
    </div>
  );
} 