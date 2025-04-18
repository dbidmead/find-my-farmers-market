// This is now a Server Component

import ClientMarketDetail from './client';
import { getMarketDetails, searchMarkets } from '@/services/marketsService';
import { notFound } from 'next/navigation';
import { FarmersMarket } from '@/types';

// Generate static params for pre-rendering
export async function generateStaticParams() {
  try {
    // Use a sample zip and radius to get a list of markets
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

// Sample market IDs as fallback
const sampleIds = ['1000073', '1000078', '1000079', '1000011'];

// The server component for the market detail page
export default async function MarketDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  if (!id) {
    notFound();
  }

  try {
    // Fetch market details on the server
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