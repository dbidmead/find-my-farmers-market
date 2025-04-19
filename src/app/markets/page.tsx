'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FarmersMarket } from '../../types';
import { getAssetPath } from '../../utils/assetPath';
import MarketCard from '@/components/MarketCard';

export default function MarketsPage() {
  const searchParams = useSearchParams();
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const zip = searchParams?.get('zip') || '';
  const radius = searchParams?.get('radius') ? parseInt(searchParams?.get('radius') || '20') : 20;

  useEffect(() => {
    async function fetchMarkets() {
      if (!zip) {
        setError('ZIP code is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Direct API call
        const API_BASE_URL = 'https://www.usdalocalfoodportal.com/api';
        const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
        const url = `${API_BASE_URL}/farmersmarket/?apikey=${API_KEY}&zip=${zip}&radius=${radius}`;
        
        console.log('Making direct API call to USDA API (API key hidden):', 
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
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setMarkets(data);
        } else if (data && data.results && Array.isArray(data.results)) {
          setMarkets(data.results);
        } else if (data && data.data && Array.isArray(data.data)) {
          // Handle the {data: Array} format
          setMarkets(data.data);
        } else {
          console.error('Unexpected API response format:', data);
          setMarkets([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching markets:', err);
        setError('Failed to fetch farmers markets. Please try again.');
        setMarkets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
  }, [zip, radius]);

  return (
    <div className="markets-page container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Farmers Markets Near {zip}</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading markets...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <a href="/">
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Try New Search
            </button>
          </a>
        </div>
      ) : markets.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4">No markets found near ZIP code {zip}.</p>
          <a href="/">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Try New Search
            </button>
          </a>
        </div>
      ) : (
        <>
          <p className="mb-6">Found {markets.length} markets within {radius} miles of {zip}</p>
          
          <a href="/">
            <button className="mb-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              New Search
            </button>
          </a>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market: FarmersMarket, index: number) => (
              <MarketCard key={index} market={market} />
            ))}
          </div>
        </>
      )}
    </div>
  );
} 