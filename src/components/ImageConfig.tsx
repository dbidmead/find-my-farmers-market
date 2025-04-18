import React from 'react';
import { getAssetPath } from '@/utils/assetPath';
import { isProd, basePath } from '@/utils/env';

/**
 * A component that displays the current image configuration.
 * Useful for debugging image loading issues.
 */
const ImageConfig: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4 text-sm">
      <h3 className="font-semibold mb-2">Image Configuration</h3>
      <ul className="space-y-1">
        <li><span className="font-medium">Environment:</span> {isProd ? 'Production' : 'Development'}</li>
        <li><span className="font-medium">Base Path:</span> {basePath || '(none)'}</li>
        <li><span className="font-medium">Using:</span> {isProd ? 'Static HTML img tags' : 'Next.js Image component'}</li>
        <li>
          <span className="font-medium">Test Image:</span>
          <img 
            src={getAssetPath('/farm-basket-logo.svg')} 
            alt="Test image" 
            className="inline-block ml-2 h-6 w-6" 
          />
        </li>
      </ul>
      <p className="mt-2 text-xs text-amber-800">
        If the test image is visible, basic image loading is working correctly.
      </p>
    </div>
  );
};

export default ImageConfig; 