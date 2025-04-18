'use client';

import React, { useState } from 'react';
import { fetchMarkets } from '../lib/api';

// Sample ZIP codes that likely have farmers markets
const SAMPLE_ZIP_CODES = [
  { zip: "20500", location: "Washington DC" },
  { zip: "10001", location: "New York City, NY" },
  { zip: "90210", location: "Beverly Hills, CA" },
  { zip: "94103", location: "San Francisco, CA" },
  { zip: "02108", location: "Boston, MA" },
  { zip: "60601", location: "Chicago, IL" },
  { zip: "98101", location: "Seattle, WA" },
  { zip: "19103", location: "Philadelphia, PA" },
];

const ApiTest = () => {
  const [zip, setZip] = useState('20500');
  const [radius, setRadius] = useState('20');
  const [results, setResults] = useState<any>(null);
  const [responseInfo, setResponseInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alternativeUrl, setAlternativeUrl] = useState(false);

  const handleTest = async () => {
    try {
      setLoading(true);
      setError(null);
      setResponseInfo(null);
      
      if (alternativeUrl) {
        // Directly test with alternative URL format
        const API_BASE_URL = 'https://www.usdalocalfoodportal.com/api';
        const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
        const url = `${API_BASE_URL}/farmersmarket/?apikey=${API_KEY}&zip=${zip}&radius=${radius}`;
        
        console.log('Trying alternative URL format (API key hidden):', 
          url.replace(API_KEY, '***API_KEY***'));
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'FarmersMarketDirectory/1.0'
          },
          credentials: 'omit'
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        setResults(data);
        setResponseInfo({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()]),
          size: typeof data === 'object' ? JSON.stringify(data).length : 'unknown'
        });
      } else {
        // Use standard API function
        const data = await fetchMarkets({
          zip: zip,
          radius: radius
        });
        
        setResults(data);
      }
    } catch (err) {
      console.error('API test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">API Test</h2>
      
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm mb-1">ZIP Code:</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="px-2 py-1 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Radius (miles):</label>
            <input
              type="text"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="px-2 py-1 border rounded"
            />
          </div>
          
          <div className="self-end flex gap-2">
            <button
              onClick={handleTest}
              disabled={loading}
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test API'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={alternativeUrl}
              onChange={() => setAlternativeUrl(!alternativeUrl)}
              className="mr-2"
            />
            <span>Use alternative URL format</span>
          </label>
          
          <div className="ml-4 text-xs text-gray-500">
            Current format: {alternativeUrl ? 
              'api/farmersmarket/?apikey=***&zip=ZIP&radius=RADIUS' : 
              'api/farmersmarket/?apikey=***&zip=ZIP&radius=RADIUS (standard)'}
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Note: Try checking this box if you&apos;re getting empty results. The USDA API may require a specific format.
        </div>
        
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <h3 className="font-medium mb-2">Sample ZIP Codes to Try:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SAMPLE_ZIP_CODES.map((item) => (
              <button
                key={item.zip}
                onClick={() => setZip(item.zip)}
                className={`text-xs p-1 rounded ${zip === item.zip ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200'}`}
              >
                {item.zip} - {item.location}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {responseInfo && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <h3 className="font-medium mb-2">Response Info:</h3>
          <div><span className="font-medium">Status:</span> {responseInfo.status} {responseInfo.statusText}</div>
          <div><span className="font-medium">Size:</span> {responseInfo.size} bytes</div>
          <div><span className="font-medium">Content-Type:</span> {responseInfo.headers['content-type'] || 'N/A'}</div>
        </div>
      )}
      
      {results && (
        <div>
          <h3 className="font-medium mb-2">Results:</h3>
          <div className="mb-2 text-sm">
            {Array.isArray(results) 
              ? `Received array with ${results.length} items` 
              : `Received ${typeof results} with ${typeof results === 'object' ? Object.keys(results).length : 0} keys`}
          </div>
          <pre className="bg-gray-100 p-3 text-sm overflow-auto max-h-80 rounded">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 