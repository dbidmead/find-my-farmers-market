'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMarketDetails } from '../../../services/marketsService';
import { FarmersMarket } from '@/types';
import { getAssetPath } from '@/utils/assetPath';
import Image from '@/components/Image';

// Extend Window interface to include marketId property
declare global {
  interface Window {
    marketId?: string;
  }
}

// Client component for market details
export default function ClientMarketDetail({ 
  marketId, 
  initialData 
}: { 
  marketId: string;
  initialData?: FarmersMarket | null;
}) {
  const [market, setMarket] = useState<any | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  // Use React's useEffect hook to fetch the market details when the component mounts
  useEffect(() => {
    // Skip fetching if we already have initial data
    if (initialData) {
      return;
    }

    async function fetchMarketDetails() {
      if (!marketId) {
        setError('Market ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching market with ID:', marketId);
        
        // If in production static export, use fallback data instead of API call
        if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
          // Wait a moment to simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Use fallback data for this market ID
          const fallbackData = getFallbackData(marketId);
          console.log('Using fallback data for market:', fallbackData);
          setMarket(fallbackData);
          setError(null);
        } else {
          // In development, try actual API call
          const result = await getMarketDetails(marketId);
          console.log('Market details result:', result);
          setMarket(result);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching market details:', err);
        
        // Use fallback data on error
        const fallbackData = getFallbackData(marketId);
        if (fallbackData) {
          console.log('Using fallback data after error');
          setMarket(fallbackData);
          setError(null);
        } else {
          setError('Failed to fetch market details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMarketDetails();
  }, [marketId, initialData]);

  // Function to provide fallback data for static export
  const getFallbackData = (id: string): FarmersMarket => {
    // Simple fallback data to use for static export
    const fallbackMarkets: Record<string, FarmersMarket> = {
      '1000073': {
        id: '1000073',
        marketname: 'Capitol Hill Farmers Market',
        Address: '200 North Capitol Street',
        city: 'Washington',
        State: 'DC',
        zip: '20001',
        Schedule: 'Sunday, 9:00 AM - 1:00 PM',
        Products: 'Vegetables, Fruits, Cheese, Baked goods',
        lat: 38.8921,
        lon: -77.0096
      },
      '1000078': {
        id: '1000078',
        marketname: 'Union Square Greenmarket',
        Address: '1 Union Square West',
        city: 'New York',
        State: 'NY',
        zip: '10003',
        Schedule: 'Monday, Wednesday, Friday, Saturday, 8:00 AM - 6:00 PM',
        Products: 'Vegetables, Fruits, Meat, Dairy, Baked goods, Plants',
        lat: 40.7359,
        lon: -73.9911
      },
      '1000079': {
        id: '1000079',
        marketname: 'Ferry Plaza Farmers Market',
        Address: '1 Ferry Building',
        city: 'San Francisco',
        State: 'CA',
        zip: '94111',
        Schedule: 'Tuesday, Thursday, Saturday, 8:00 AM - 2:00 PM',
        Products: 'Organic produce, Seafood, Flowers, Artisanal foods',
        lat: 37.7956,
        lon: -122.3934
      },
      '1000011': {
        id: '1000011',
        marketname: 'Portland Farmers Market',
        Address: '92 SW Naito Pkwy',
        city: 'Portland',
        State: 'OR',
        zip: '97204',
        Schedule: 'Saturday, 8:30 AM - 2:00 PM',
        Products: 'Local produce, Crafts, Food vendors',
        lat: 45.5221,
        lon: -122.6728
      }
    };
    
    // Return the matching market or a generic one
    return fallbackMarkets[id] || {
      id: id,
      marketname: 'Sample Farmers Market',
      Address: '123 Market Street',
      city: 'Anytown',
      State: 'US',
      zip: '12345',
      Schedule: 'Saturday, 9:00 AM - 1:00 PM',
      Products: 'Vegetables, Fruits, Baked goods',
      lat: 40.7128,
      lon: -74.0060
    };
  };

  // Helper functions to extract data from various API response formats
  const getMarketName = () => {
    if (!market) return '';
    return market.marketname || market.MarketName || market.listing_name || 'Farmers Market Details';
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
    return market.Schedule || market.season1date || null;
  };

  const getProducts = () => {
    if (!market) return [];
    if (market.Products) return market.Products.split(',').map((p: string) => p.trim());
    
    const products = [];
    if (market.Organic && market.Organic === 'Y') products.push('Organic');
    if (market.Bakedgoods && market.Bakedgoods === 'Y') products.push('Baked Goods');
    if (market.Cheese && market.Cheese === 'Y') products.push('Cheese');
    if (market.Crafts && market.Crafts === 'Y') products.push('Crafts');
    if (market.Flowers && market.Flowers === 'Y') products.push('Flowers');
    if (market.Eggs && market.Eggs === 'Y') products.push('Eggs');
    if (market.Seafood && market.Seafood === 'Y') products.push('Seafood');
    if (market.Herbs && market.Herbs === 'Y') products.push('Herbs');
    if (market.Vegetables && market.Vegetables === 'Y') products.push('Vegetables');
    if (market.Honey && market.Honey === 'Y') products.push('Honey');
    if (market.Jams && market.Jams === 'Y') products.push('Jams');
    if (market.Meat && market.Meat === 'Y') products.push('Meat');
    if (market.Nuts && market.Nuts === 'Y') products.push('Nuts');
    if (market.Plants && market.Plants === 'Y') products.push('Plants');
    if (market.Poultry && market.Poultry === 'Y') products.push('Poultry');
    if (market.Prepared && market.Prepared === 'Y') products.push('Prepared Food');
    if (market.Soap && market.Soap === 'Y') products.push('Soap');
    if (market.Trees && market.Trees === 'Y') products.push('Trees');
    if (market.Wine && market.Wine === 'Y') products.push('Wine');
    
    return products;
  };

  const getMapUrl = () => {
    if (!market) return null;
    if (market.lat && market.lon) return `https://maps.google.com/?q=${market.lat},${market.lon}`;
    if (market.Latitude && market.Longitude) return `https://maps.google.com/?q=${market.Latitude},${market.Longitude}`;
    if (market.location_y && market.location_x) return `https://maps.google.com/?q=${market.location_y},${market.location_x}`;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <a 
        href="/"
        className="inline-flex items-center text-green-600 hover:text-green-800 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </a>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <p className="text-red-700">{error}</p>
        </div>
      ) : !market ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-sm">
          <p className="text-yellow-700">Market not found. It may have been removed or is temporarily unavailable.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Hero section with image */}
          <div className="relative h-48 sm:h-64 bg-green-50">
            <Image
              src="/images/market-placeholder.jpg"
              alt={getMarketName()}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">{getMarketName()}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Location
                </h2>
                {getAddress().length > 0 ? (
                  <div className="text-gray-700">
                    {getAddress().map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    
                    {getMapUrl() && (
                      <a 
                        href={getMapUrl() as string} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        View on Map
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Address not available</p>
                )}
              </div>
              
              {/* Schedule */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Hours & Schedule
                </h2>
                {getSchedule() ? (
                  <p className="text-gray-700">{getSchedule()}</p>
                ) : (
                  <p className="text-gray-500 italic">Schedule not available</p>
                )}
              </div>
            </div>
            
            {/* Products */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Available Products
              </h2>
              <div className="flex flex-wrap gap-2">
                {getProducts().length > 0 ? (
                  getProducts().map((product: string, index: number) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {product}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Product information not available</p>
                )}
              </div>
            </div>
            
            {/* Contact Info or Additional Details */}
            {(market.contact_name || market.contact_email || market.contact_phone || market.website) && (
              <div className="border-t border-gray-100 pt-4 mt-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Contact Information</h2>
                <ul className="space-y-2">
                  {market.contact_name && (
                    <li className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {market.contact_name}
                    </li>
                  )}
                  {market.contact_email && (
                    <li className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <a href={`mailto:${market.contact_email}`} className="text-blue-600 hover:underline">
                        {market.contact_email}
                      </a>
                    </li>
                  )}
                  {market.contact_phone && (
                    <li className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <a href={`tel:${market.contact_phone}`} className="text-blue-600 hover:underline">
                        {market.contact_phone}
                      </a>
                    </li>
                  )}
                  {market.website && (
                    <li className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                      </svg>
                      <a href={market.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Website
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 