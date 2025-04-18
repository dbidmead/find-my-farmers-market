import { FarmersMarket, SearchParams, ApiResponse } from '../types';

// The base URL for our proxy server
const PROXY_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // Use relative path in production (assuming same domain)
  : 'http://localhost:3001/api'; // Use direct URL in development

/**
 * Searches for farmers markets based on location parameters
 */
export async function searchMarkets(params: SearchParams): Promise<FarmersMarket[]> {
  try {
    console.log('Searching with params:', params);
    
    // Build the URL to our Express proxy server
    let endpoint = `${PROXY_BASE_URL}/markets`;
    
    // Add query parameters
    const queryParams = new URLSearchParams();
    
    if (params.zip) {
      queryParams.append('zip', params.zip);
    } else if (params.lat && params.lng) {
      queryParams.append('lat', params.lat.toString());
      queryParams.append('lng', params.lng.toString());
    }
    
    if (params.radius) {
      queryParams.append('radius', params.radius.toString());
    }
    
    // Add query string to endpoint
    endpoint += `?${queryParams.toString()}`;

    console.log('Fetching from endpoint:', endpoint);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
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
    throw error;
  }
}

/**
 * Gets detailed information for a specific market
 */
export async function getMarketDetails(marketId: string): Promise<FarmersMarket | null> {
  try {
    console.log('Getting details for market ID:', marketId);
    
    // Use our Express proxy endpoint for market details
    const endpoint = `${PROXY_BASE_URL}/markets/${marketId}`;

    console.log('Fetching from endpoint:', endpoint);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Market details response:', data);
    
    return data || null;
  } catch (error) {
    console.error('Error getting market details:', error);
    throw error;
  }
} 