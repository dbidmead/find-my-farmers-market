'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FarmersMarket } from '../../../types';
import { getMarketDetails } from '../../../services/marketsService';

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [market, setMarket] = useState<FarmersMarket | null>(null);
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
        const result = await getMarketDetails(marketId);
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
            <h1 className="text-3xl font-bold mb-4">{market.marketname}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-3">Location</h2>
                <div className="space-y-2">
                  {market.street && <p>{market.street}</p>}
                  {market.city && market.state && market.zip && (
                    <p>{market.city}, {market.state} {market.zip}</p>
                  )}
                  {(market.lat && market.lon) && (
                    <div className="mt-4">
                      <a
                        href={`https://maps.google.com/?q=${market.lat},${market.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white py-2 px-4 rounded-md
                                  hover:bg-blue-700 focus:outline-none focus:ring-2
                                  focus:ring-blue-500 focus:ring-offset-2 inline-block"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Hours</h2>
                <div className="space-y-2">
                  {market.season1date && (
                    <div>
                      <p className="font-medium">Season 1</p>
                      <p>{market.season1date}</p>
                      <p>{market.season1time}</p>
                    </div>
                  )}
                  {market.season2date && (
                    <div className="mt-3">
                      <p className="font-medium">Season 2</p>
                      <p>{market.season2date}</p>
                      <p>{market.season2time}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-3">Payment Options</h2>
                <ul className="list-disc list-inside space-y-1">
                  {market.credit === "Y" && <li>Credit Cards</li>}
                  {market.wic === "Y" && <li>WIC Accepted</li>}
                  {market.wiccash === "Y" && <li>WIC Cash Accepted</li>}
                  {market.sfmnp === "Y" && <li>Senior Farmers Market Nutrition Program</li>}
                  {market.snap === "Y" && <li>SNAP Accepted</li>}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Products</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {market.bakedgoods === "Y" && <p>Baked Goods</p>}
                  {market.cheese === "Y" && <p>Cheese</p>}
                  {market.crafts === "Y" && <p>Crafts</p>}
                  {market.flowers === "Y" && <p>Flowers</p>}
                  {market.eggs === "Y" && <p>Eggs</p>}
                  {market.seafood === "Y" && <p>Seafood</p>}
                  {market.herbs === "Y" && <p>Herbs</p>}
                  {market.vegetables === "Y" && <p>Vegetables</p>}
                  {market.honey === "Y" && <p>Honey</p>}
                  {market.jams === "Y" && <p>Jams</p>}
                  {market.maple === "Y" && <p>Maple</p>}
                  {market.meat === "Y" && <p>Meat</p>}
                  {market.nuts === "Y" && <p>Nuts</p>}
                  {market.plants === "Y" && <p>Plants</p>}
                  {market.poultry === "Y" && <p>Poultry</p>}
                  {market.prepared === "Y" && <p>Prepared Food</p>}
                  {market.soap === "Y" && <p>Soap</p>}
                  {market.trees === "Y" && <p>Trees</p>}
                  {market.wine === "Y" && <p>Wine</p>}
                </div>
              </div>
            </div>
            
            {market.website && (
              <div className="mt-8">
                <a
                  href={market.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Visit Website →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 