// src/lib/api.ts
// Client-side API utilities for direct calls to USDA API

const API_BASE_URL = 'https://www.usdalocalfoodportal.com/api';
const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';

// Add API key to URL if available
const addApiKey = (url: string) => {
  if (!API_KEY) return url;
  return url.includes('?') ? `${url}&apikey=${API_KEY}` : `${url}?apikey=${API_KEY}`;
};

// Fetch markets with search parameters
export async function fetchMarkets(params: Record<string, string>) {
  try {
    // Create URL with search parameters
    const searchParams = new URLSearchParams();
    
    // Add all provided parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    
    // Build the full URL
    const url = addApiKey(`${API_BASE_URL}/farmersmarket?${searchParams.toString()}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FarmersMarketDirectory/1.0'
      },
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching markets:', error);
    throw error;
  }
}

// Fetch a single market by ID
export async function fetchMarketById(id: string) {
  try {
    if (!id) {
      throw new Error('Market ID is required');
    }
    
    const url = addApiKey(`${API_BASE_URL}/farmersmarket/${id}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FarmersMarketDirectory/1.0'
      },
      credentials: 'omit',
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data) {
      throw new Error('No data returned from API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching market details:', error);
    throw error;
  }
} 