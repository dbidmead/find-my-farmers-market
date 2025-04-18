import { FarmersMarket, SearchParams, ApiResponse } from '../types';
import { fetchMarkets, fetchMarketById } from '../lib/api';

/**
 * Searches for farmers markets based on location parameters
 */
export async function searchMarkets(params: SearchParams): Promise<FarmersMarket[]> {
  try {
    // In static export production mode, return empty results to avoid API calls
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      console.log('Static export mode - skipping API call for market search');
      return [];
    }
    
    console.log('Searching with params:', params);
    
    // Convert params to format expected by the API
    const apiParams: Record<string, string> = {};
    
    if (params.zip) {
      apiParams.zip = params.zip;
    } else if (params.lat && params.lng) {
      apiParams.lat = params.lat.toString();
      apiParams.lng = params.lng.toString();
    }
    
    if (params.radius) {
      apiParams.radius = params.radius.toString();
    }

    // Call our direct API client
    const data = await fetchMarkets(apiParams);
    console.log('API Response:', data);
    
    // Handle various response formats
    if (data && data.results) {
      return data.results;
    } else if (data && Array.isArray(data)) {
      return data;
    } else {
      console.error('Unexpected API response structure:', data);
      return [];
    }
  } catch (error) {
    console.error('Error searching markets:', error);
    return []; // Return empty array rather than throwing to increase resilience
  }
}

/**
 * Gets detailed information for a specific market
 */
export async function getMarketDetails(marketId: string): Promise<FarmersMarket | null> {
  try {
    // In static export production mode, return null to avoid API calls
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      console.log('Static export mode - skipping API call for market details');
      return null;
    }
    
    console.log('Getting details for market ID:', marketId);
    
    // Use our direct API client
    const data = await fetchMarketById(marketId);
    console.log('Market details response:', data);
    
    return data || null;
  } catch (error) {
    console.error('Error getting market details:', error);
    return null; // Return null rather than throwing to increase resilience
  }
} 