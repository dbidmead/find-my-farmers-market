'use client';

import Image from 'next/image';
import { getAssetPath } from '../../utils/assetPath';

export default function TestPage() {
  // Test both methods of loading images
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl mb-2">Using Next.js Image component:</h2>
          <div className="relative h-64 w-full">
            <Image 
              src="/images/crop-field.jpg"
              alt="Test image with direct path"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Using getAssetPath utility:</h2>
          <div className="relative h-64 w-full">
            <Image 
              src={getAssetPath("/images/crop-field.jpg")}
              alt="Test image with getAssetPath"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Using regular img tag with direct path:</h2>
          <img 
            src="/images/crop-field.jpg"
            alt="Test image with direct path"
            className="h-64 object-cover"
          />
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Using regular img tag with getAssetPath:</h2>
          <img 
            src={getAssetPath("/images/crop-field.jpg")}
            alt="Test image with getAssetPath"
            className="h-64 object-cover"
          />
        </div>
      </div>
      
      <div className="mt-8">
        <p>Current NODE_ENV: {process.env.NODE_ENV}</p>
        <p>Current NEXT_PUBLIC_BASE_PATH: {process.env.NEXT_PUBLIC_BASE_PATH}</p>
      </div>
    </div>
  );
} 