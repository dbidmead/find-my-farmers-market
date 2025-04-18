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
  const distance = typeof market.distance === 'number' ? `${market.distance.toFixed(1)} miles away` : '';
  const updatedAt = market.updateTime ? new Date(market.updateTime).toLocaleDateString() : '';
  
  const contactInfo = [
    market.contact_name,
    market.contact_email,
    market.contact_phone
  ].filter(Boolean);

  const hasLocation = market.location_x && market.location_y;
  const mapUrl = hasLocation 
    ? `https://maps.google.com/?q=${market.location_y},${market.location_x}`
    : '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
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
          <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
            {distance}
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{name}</h2>
        
        {description && (
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">{description}</p>
        )}
        
        {address && (
          <div className="mb-3 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-600 text-sm">{address}</p>
          </div>
        )}
        
        {contactInfo.length > 0 && (
          <div className="mb-3 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <div className="text-sm text-gray-600">
              {contactInfo.map((info, index) => (
                <p key={index}>{info}</p>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <Link
            href={getAssetPath(`/markets/${market.id}`)}
            className="text-green-600 hover:text-green-800 font-medium text-sm"
          >
            View Details →
          </Link>
          
          {mapUrl && (
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Open in Maps
            </a>
          )}
        </div>
        
        {updatedAt && (
          <div className="mt-2 text-xs text-gray-400">
            Updated: {updatedAt}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketCard; 