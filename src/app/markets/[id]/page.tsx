'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMarketDetails } from '../../../services/marketsService';

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [market, setMarket] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const marketId = params.id as string;

  useEffect(() => {
    async function fetchMarketDetails() {
      if (!marketId) {
        setError('Market ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching market with ID:', marketId);
        const result = await getMarketDetails(marketId);
        console.log('Market details result:', result);
        setMarket(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching market details:', err);
        setError('Failed to fetch market details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchMarketDetails();
  }, [marketId]);

  const handleBack = () => {
    router.back();
  };

  // Helper functions to extract data from various API response formats
  const getMarketName = () => {
    if (!market) return '';
    if (typeof market === 'string') return 'Farmers Market';
    
    if (market.marketname) return market.marketname;
    if (market.MarketName) return market.MarketName;
    
    return 'Farmers Market Details';
  };

  const getAddress = () => {
    if (!market) return [];
    
    const parts = [];
    
    if (market.Address) parts.push(market.Address);
    if (market.street) parts.push(market.street);
    
    let cityStateZip = '';
    if (market.city || market.City) cityStateZip += (market.city || market.City);
    if ((market.state || market.State) && cityStateZip) cityStateZip += `, ${market.state || market.State}`;
    else if (market.state || market.State) cityStateZip += (market.state || market.State);
    if (market.zip || market.Zip) cityStateZip += ` ${market.zip || market.Zip}`;
    
    if (cityStateZip) parts.push(cityStateZip);
    
    return parts;
  };

  const getSchedule = () => {
    if (!market) return null;
    
    if (market.Schedule) return market.Schedule;
    if (market.season1date) {
      let schedule = `Season 1: ${market.season1date}`;
      if (market.season1time) schedule += ` - ${market.season1time}`;
      return schedule;
    }
    
    return null;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-green-600 hover:text-green-800"
        >
          ← Back to results
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        ) : !market ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Market not found. It may have been removed or is temporarily unavailable.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{getMarketName()}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Address */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Location</h2>
                {getAddress().length > 0 ? (
                  <div className="space-y-1">
                    {getAddress().map((line, i) => (
                      <p key={i} className="text-gray-700">{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Address not available</p>
                )}
                
                {/* Map link if coordinates available */}
                {((market.lat && market.lon) || (market.Latitude && market.Longitude)) && (
                  <a 
                    href={`https://maps.google.com/?q=${market.lat || market.Latitude},${market.lon || market.Longitude}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
              
              {/* Schedule */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Hours</h2>
                {getSchedule() ? (
                  <p className="text-gray-700">{getSchedule()}</p>
                ) : (
                  <p className="text-gray-500 italic">Hours not available</p>
                )}
              </div>
            </div>
            
            {/* Products if available */}
            {market.Products && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Products</h2>
                <p className="text-gray-700">{market.Products}</p>
              </div>
            )}
            
            {/* Website if available */}
            {(market.Website || market.website) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Website</h2>
                <a 
                  href={market.Website || market.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800"
                >
                  {market.Website || market.website}
                </a>
              </div>
            )}
            
            {/* Raw data for debugging */}
            <details className="mt-8 border border-gray-200 rounded-md p-4">
              <summary className="text-gray-600 cursor-pointer font-semibold">Raw Market Data</summary>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs mt-4">
                {JSON.stringify(market, null, 2)}
              </pre>
            </details>
            
            <div className="mt-8">
              <button
                onClick={handleBack}
                className="bg-green-600 text-white py-2 px-4 rounded-md
                         hover:bg-green-700 focus:outline-none focus:ring-2
                         focus:ring-green-500 focus:ring-offset-2"
              >
                Back to Markets
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 