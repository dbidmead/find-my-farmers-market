import { FarmersMarket, SearchParams, ApiResponse } from '../types';
import { fetchMarkets, fetchMarketById, testApiFormats } from '../lib/api';

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

    // Try a series of URL formats to find one that works
    const API_BASE_URL = 'https://www.usdalocalfoodportal.com/api';
    const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
    
    // Define the URL formats to try in order
    const urlFormats = [
      // Format 1 (most likely to work based on tests)
      `${API_BASE_URL}/farmersmarket/?apikey=${API_KEY}&zip=${params.zip || ''}&radius=${params.radius || '20'}`,
      // Format 2
      `${API_BASE_URL}/farmersmarket?apikey=${API_KEY}&zip=${params.zip || ''}&radius=${params.radius || '20'}`,
      // Format 3
      `${API_BASE_URL}/zipSearch?apikey=${API_KEY}&zip=${params.zip || ''}&radius=${params.radius || '20'}`,
    ];
    
    let responseData = null;
    let lastError = null;
    
    // Try each URL format until one works
    for (let i = 0; i < urlFormats.length; i++) {
      const url = urlFormats[i];
      try {
        console.log(`Trying API URL format ${i+1} (API key hidden):`, url.replace(API_KEY, '***API_KEY***'));
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'FarmersMarketDirectory/1.0'
          },
          credentials: 'omit'
        });
        
        if (!response.ok) {
          console.log(`Format ${i+1} failed with status ${response.status}`);
          continue; // Try next format
        }
        
        responseData = await response.json();
        console.log(`Format ${i+1} succeeded!`, responseData);
        break; // We got valid data, exit the loop
      } catch (err) {
        console.error(`Error with format ${i+1}:`, err);
        lastError = err;
      }
    }
    
    // If we didn't get any data from any format, fallback to the original fetchMarkets
    if (!responseData) {
      console.log('All direct formats failed, trying fetchMarkets as fallback');
      try {
        responseData = await fetchMarkets(apiParams);
        console.log('Fallback fetchMarkets response:', responseData);
      } catch (err) {
        console.error('Fallback fetchMarkets failed:', err);
        lastError = err;
      }
    }
    
    // Handle various response formats
    if (responseData && responseData.results) {
      return responseData.results;
    } else if (responseData && Array.isArray(responseData)) {
      return responseData;
    } else {
      console.error('Unexpected API response structure or all API calls failed:', responseData, lastError);
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
    
    // Similar approach to searchMarkets, try multiple formats
    const API_BASE_URL = 'https://www.usdalocalfoodportal.com/api';
    const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
    
    // Define the URL formats to try in order
    const urlFormats = [
      // Format 1 (most likely to work based on tests)
      `${API_BASE_URL}/farmersmarket/${marketId}?apikey=${API_KEY}`,
      // Format 2
      `${API_BASE_URL}/farmersmarket/${marketId}/?apikey=${API_KEY}`,
    ];
    
    let data = null;
    
    // Try each URL format until one works
    for (let i = 0; i < urlFormats.length; i++) {
      const url = urlFormats[i];
      try {
        console.log(`Trying market details URL format ${i+1} (API key hidden):`, url.replace(API_KEY, '***API_KEY***'));
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'FarmersMarketDirectory/1.0'
          },
          credentials: 'omit'
        });
        
        if (!response.ok) {
          console.log(`Market details format ${i+1} failed with status ${response.status}`);
          continue; // Try next format
        }
        
        data = await response.json();
        console.log(`Market details format ${i+1} succeeded!`, data);
        break; // We got valid data, exit the loop
      } catch (err) {
        console.error(`Error with market details format ${i+1}:`, err);
      }
    }
    
    // If all direct formats failed, try the original fetchMarketById as fallback
    if (!data) {
      console.log('All direct formats failed, trying fetchMarketById as fallback');
      try {
        data = await fetchMarketById(marketId);
        console.log('Fallback fetchMarketById response:', data);
      } catch (err) {
        console.error('Fallback fetchMarketById failed:', err);
      }
    }
    
    return data || null;
  } catch (error) {
    console.error('Error getting market details:', error);
    return null; // Return null rather than throwing to increase resilience
  }
} 