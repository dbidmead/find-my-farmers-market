'use client';

import React from 'react';
import ApiTest from '@/components/ApiTest';
import { getAssetPath } from '@/utils/assetPath';

export default function ApiTestPage() {
  return (
    <div className="p-8">
      <div className="mb-4">
        <a 
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          Back to Home
        </a>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">API Testing Page</h1>
      
      <p className="mb-6">
        This page tests the API implementation to ensure requests are properly formatted.
        The URL should match: <code className="bg-gray-100 px-1">https://www.usdalocalfoodportal.com/api/farmersmarket/?apikey=***&zip=ZIP&radius=RADIUS</code>
      </p>
      
      <ApiTest />
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Environment Info:</h2>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
        <p>NEXT_PUBLIC_BASE_PATH: {process.env.NEXT_PUBLIC_BASE_PATH}</p>
        <p>API Key Set: {process.env.NEXT_PUBLIC_USDA_API_KEY ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
} 