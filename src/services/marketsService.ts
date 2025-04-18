import { FarmersMarket, SearchParams, ApiResponse } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY;
const API_BASE_URL = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc';

/**
 * Searches for farmers markets based on location parameters
 */
export async function searchMarkets(params: SearchParams): Promise<FarmersMarket[]> {
  try {
    let endpoint = '';
    
    // Determine which endpoint to use based on provided parameters
    if (params.zip) {
      endpoint = `${API_BASE_URL}/zipSearch?zip=${params.zip}`;
    } else if (params.lat && params.lng) {
      endpoint = `${API_BASE_URL}/locSearch?lat=${params.lat}&lng=${params.lng}`;
    } else {
      throw new Error('Either zip code or latitude/longitude must be provided');
    }

    // Add API key if available
    if (API_KEY) {
      endpoint += `&apikey=${API_KEY}`;
    }

    // Add radius if provided
    if (params.radius) {
      endpoint += `&radius=${params.radius}`;
    }

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as ApiResponse;
    return data.results || [];
  } catch (error) {
    console.error('Error searching markets:', error);
    throw error;
  }
}

/**
 * Gets detailed information for a specific market
 */
export async function getMarketDetails(marketId: string): Promise<FarmersMarket | null> {
  try {
    let endpoint = `${API_BASE_URL}/mktDetail?id=${marketId}`;
    
    // Add API key if available
    if (API_KEY) {
      endpoint += `&apikey=${API_KEY}`;
    }

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.marketdetails || null;
  } catch (error) {
    console.error('Error getting market details:', error);
    throw error;
  }
} 