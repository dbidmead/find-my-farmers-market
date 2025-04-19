'use client';

import Link from 'next/link';
import { getAssetPath } from '../utils/assetPath';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a 
          href="/"
          className="inline-block bg-green-600 text-white py-2 px-6 rounded-md
                   hover:bg-green-700 transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
} 