'use client';

import React, { useState, useEffect } from 'react';
import { getAssetPath } from '@/utils/assetPath';

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

// API formats to test
const API_FORMATS = [
  {
    id: 'format1',
    name: 'Format 1',
    url: 'https://www.usdalocalfoodportal.com/api/farmersmarket/',
    description: 'With trailing slash after farmersmarket'
  },
  {
    id: 'format2',
    name: 'Format 2',
    url: 'https://www.usdalocalfoodportal.com/api/farmersmarket',
    description: 'Without trailing slash after farmersmarket'
  },
  {
    id: 'format3',
    name: 'Format 3',
    url: 'https://www.usdalocalfoodportal.com/api/zipSearch',
    description: 'Using zipSearch endpoint'
  },
  {
    id: 'format4',
    name: 'Format 4',
    url: 'https://www.ams.usda.gov/local-food-directories/farmersmarkets',
    description: 'Official AMS URL'
  }
];

export default function ApiMultiTestPage() {
  const [zip, setZip] = useState('20500');
  const [radius, setRadius] = useState('20');
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';

  const testAllFormats = async () => {
    try {
      setLoading(true);
      setError(null);
      const newResults: Record<string, any> = {};
      
      // Test each format in parallel
      const testPromises = API_FORMATS.map(async (format) => {
        try {
          const url = `${format.url}?apikey=${API_KEY}&zip=${zip}&radius=${radius}`;
          console.log(`Testing ${format.name} (API key hidden):`, url.replace(API_KEY, '***API_KEY***'));
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'FarmersMarketDirectory/1.0'
            },
            credentials: 'omit'
          });
          
          const responseInfo = {
            id: format.id,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries([...response.headers.entries()]),
          };
          
          if (!response.ok) {
            newResults[format.id] = {
              ...responseInfo,
              success: false,
              error: `API responded with status ${response.status}`
            };
            return;
          }
          
          const data = await response.json();
          newResults[format.id] = {
            ...responseInfo,
            success: true,
            data,
            dataType: typeof data,
            isArray: Array.isArray(data),
            itemCount: Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : 0)
          };
        } catch (err) {
          newResults[format.id] = {
            id: format.id,
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          };
        }
      });
      
      await Promise.all(testPromises);
      setResults(newResults);
    } catch (err) {
      console.error('API multi-test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAllFormats();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-4">
        <a 
          href="/"
          className="text-green-600 hover:underline"
        >
          ← Back to Home
        </a>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">API Multi-Format Testing Page</h1>
      
      <p className="mb-6">
        This page tests multiple API formats simultaneously to determine which one works with the USDA Farmers Market API.
      </p>
      
      <div className="flex flex-col gap-4 mb-6">
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
          
          <div className="self-end">
            <button
              onClick={testAllFormats}
              disabled={loading}
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test All Formats'}
            </button>
          </div>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {API_FORMATS.map((format) => {
          const result = results[format.id];
          return (
            <div
              key={format.id}
              className={`border rounded p-4 ${
                result?.success
                  ? 'bg-green-50 border-green-200'
                  : result
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <h3 className="font-bold text-lg mb-2">{format.name}</h3>
              <p className="text-sm mb-2">{format.description}</p>
              <div className="text-xs mb-2 break-all">
                <span className="font-medium">URL:</span> {format.url}?apikey=***&zip={zip}&radius={radius}
              </div>
              
              {!result && (
                <div className="text-gray-500 text-sm">Testing...</div>
              )}
              
              {result?.error && (
                <div className="text-red-600 text-sm mt-2">
                  Error: {result.error}
                </div>
              )}
              
              {result?.success && (
                <div className="mt-2">
                  <div className="text-sm mb-2">
                    <span className="font-medium">Status:</span> {result.status} {result.statusText}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Data type:</span> {result.dataType}
                    {result.isArray && ` (Array with ${result.itemCount} items)`}
                    {!result.isArray && result.dataType === 'object' && ` (Object with ${result.itemCount} keys)`}
                  </div>
                  
                  {result.data && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Sample Data:</div>
                      <pre className="bg-white p-2 text-xs overflow-auto max-h-40 rounded border">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Environment Info:</h2>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
        <p>NEXT_PUBLIC_BASE_PATH: {process.env.NEXT_PUBLIC_BASE_PATH}</p>
        <p>API Key Set: {process.env.NEXT_PUBLIC_USDA_API_KEY ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
} 