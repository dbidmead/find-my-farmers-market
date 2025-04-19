'use client';

import React from 'react';
import Link from 'next/link';
import { getAssetPath } from '@/utils/assetPath';
import Image from '@/components/Image';

interface MarketCardProps {
  market: {
    id: string;
    updateTime?: string;
    // Using all possible field name variations
    marketname?: string;
    MarketName?: string;
    listing_name?: string;
    listing_desc?: string;
    brief_desc?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    location_address?: string;
    location_x?: number;
    location_y?: number;
    street?: string;
    Address?: string;
    city?: string;
    City?: string;
    state?: string;
    State?: string;
    distance?: number;
    listing_image?: string;
  };
}

const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  // Extract data handling different field names
  const name = market.listing_name || market.marketname || market.MarketName || 'Farmers Market';
  const description = market.listing_desc || market.brief_desc || '';
  const address = market.location_address || 
    [
      market.street || market.Address, 
      market.city || market.City, 
      market.state || market.State
    ].filter(Boolean).join(', ');
  
  const image = market.listing_image || '/images/market-placeholder.jpg';
  const distance = typeof market.distance === 'number' ? `${market.distance.toFixed(1)} mi` : '';
  
  const hasLocation = market.location_x && market.location_y;
  const mapUrl = hasLocation 
    ? `https://maps.google.com/?q=${market.location_y},${market.location_x}`
    : '';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        {image.startsWith('http') ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src="/images/market-placeholder.jpg"
            alt={name}
            fill
            className="object-cover"
          />
        )}
        {distance && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {distance}
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-lg font-semibold mb-1 text-gray-800 line-clamp-1">{name}</h2>
        
        {address && (
          <div className="flex items-start mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-500 text-sm line-clamp-1">{address}</p>
          </div>
        )}
        
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
          <Link
            href={getAssetPath(`/markets/${market.id}`)}
            className="text-green-600 hover:text-green-800 font-medium text-sm inline-flex items-center"
          >
            View Details 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          {mapUrl && (
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketCard; 