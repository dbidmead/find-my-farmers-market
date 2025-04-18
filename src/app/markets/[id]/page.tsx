// This is now a Server Component

import ClientMarketDetail from './client';
import { getMarketDetails, searchMarkets } from '@/services/marketsService';
import { notFound } from 'next/navigation';
import { FarmersMarket } from '@/types';

// Sample market IDs as fallback
const sampleIds = ['1000073', '1000078', '1000079', '1000011'];

// Generate static params for pre-rendering
export async function generateStaticParams() {
  try {
    // For static export, just return the sample IDs directly
    if (process.env.NODE_ENV === 'production') {
      console.log('Using sample IDs for static generation');
      return sampleIds.map(id => ({ id }));
    }

    // In development, try to fetch real data
    console.log('Attempting to fetch markets for static generation');
    const marketsData = await searchMarkets({ zip: '20001', radius: 50 });
    
    if (marketsData && marketsData.length > 0) {
      // Return the first 20 market IDs for static generation
      return marketsData.slice(0, 20).map(market => ({
        id: market.id
      }));
    }
    
    // Fallback to sample IDs if no markets found
    return sampleIds.map(id => ({ id }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return sample IDs in case of error
    return sampleIds.map(id => ({ id }));
  }
}

// The server component for the market detail page
export default async function MarketDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  if (!id) {
    notFound();
  }

  try {
    // In production static export, don't try to fetch data
    if (process.env.NODE_ENV === 'production') {
      console.log('Static export mode - returning null data for client-side fetching');
      // Just pass the ID and let the client component handle it with fallback data
      return <ClientMarketDetail marketId={id} initialData={null} />;
    }

    // In development, try to fetch market details on the server
    console.log('Development mode - fetching market data on server');
    const marketData = await getMarketDetails(id);
    
    if (!marketData) {
      notFound();
    }
    
    // Pass the pre-fetched data to the client component
    return <ClientMarketDetail marketId={id} initialData={marketData} />;
  } catch (error) {
    console.error('Error fetching market details:', error);
    // We'll let the client component handle the error state
    return <ClientMarketDetail marketId={id} initialData={null} />;
  }
} 