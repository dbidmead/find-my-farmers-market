'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FarmersMarket } from '../../types';
import { searchMarkets } from '../../services/marketsService';
import { getAssetPath } from '../../utils/assetPath';

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
        const results = await searchMarkets({ zip, radius });
        console.log('Markets results:', results);
        setMarkets(results);
        setError(null);
      } catch (err) {
        console.error('Error fetching markets:', err);
        setError('Failed to fetch farmers markets. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
  }, [zip, radius]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Farmers Markets</h1>
          <Link 
            href={getAssetPath("/")}
            className="bg-green-600 text-white py-2 px-4 rounded-md
                     hover:bg-green-700 focus:outline-none focus:ring-2
                     focus:ring-green-500 focus:ring-offset-2"
          >
            New Search
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        ) : markets.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>No farmers markets found in your area. Try expanding your search radius or searching for a different location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market, index) => (
              <div key={market.id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    {market.marketname || market.MarketName || "Farmers Market"}
                  </h2>
                  
                  {market.distance && (
                    <p className="text-gray-600 mb-2">{market.distance} miles away</p>
                  )}
                  
                  {(market.city || market.City) && (market.state || market.State) && (
                    <p className="text-gray-600 mb-2">
                      {market.city || market.City}, {market.state || market.State}
                    </p>
                  )}
                  
                  <Link
                    href={getAssetPath(`/markets/${market.id || index}`)}
                    className="text-green-600 hover:text-green-800 font-medium"
                    prefetch={false}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 