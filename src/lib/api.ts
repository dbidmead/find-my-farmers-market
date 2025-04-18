// src/lib/api.ts
// Client-side API utilities for direct calls to USDA API

const API_BASE_URL = 'https://www.usdalocalfoodportal.com/api';
const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
const DEBUG_MODE = true; // Enable for more detailed logging

// Construct URL with correct structure and API key
const buildApiUrl = (endpoint: string, params: Record<string, string> = {}) => {
  // Ensure endpoint has trailing slash
  const formattedEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
  
  // Create base URL with endpoint and API key
  const url = `${API_BASE_URL}${formattedEndpoint}?apikey=${API_KEY}`;
  
  // Add remaining parameters
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
    
  return queryParams ? `${url}&${queryParams}` : url;
};

// Fetch markets with search parameters
export async function fetchMarkets(params: Record<string, string>) {
  try {
    // Debug: Log parameters
    if (DEBUG_MODE) {
      console.log('Fetching markets with params:', params);
    }
    
    // Try different variations of the URL format

    // Variation 1: Standard format with trailing slash
    const url1 = buildApiUrl('/farmersmarket', params);
    
    // Variation 2: Alternative format with trailing slash after farmersmarket
    const url2 = `${API_BASE_URL}/farmersmarket/?apikey=${API_KEY}&zip=${params.zip || ''}&radius=${params.radius || '20'}`;
    
    // Variation 3: No trailing slash after farmersmarket
    const url3 = `${API_BASE_URL}/farmersmarket?apikey=${API_KEY}&zip=${params.zip || ''}&radius=${params.radius || '20'}`;
    
    if (DEBUG_MODE) {
      console.log('URL Variation 1 (API key hidden):', url1.replace(API_KEY, '***API_KEY***'));
      console.log('URL Variation 2 (API key hidden):', url2.replace(API_KEY, '***API_KEY***'));
      console.log('URL Variation 3 (API key hidden):', url3.replace(API_KEY, '***API_KEY***'));
    }
    
    // Use the second variation by default as it's most likely to work
    const url = url2;
    
    if (DEBUG_MODE) {
      console.log('Using URL (API key hidden):', url.replace(API_KEY, '***API_KEY***'));
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FarmersMarketDirectory/1.0'
      },
      credentials: 'omit'
    });
    
    if (DEBUG_MODE) {
      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
    }
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (DEBUG_MODE) {
      console.log('API Response data type:', typeof responseData);
      console.log('API Response is array:', Array.isArray(responseData));
      console.log('API Response structure:', 
        Array.isArray(responseData) 
          ? `Array with ${responseData.length} items` 
          : Object.keys(responseData).join(', '));
    }
    
    return responseData;
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
    
    // Build URL with correct structure
    const url = buildApiUrl(`/farmersmarket/${id}`);
    
    console.log('Fetching market details with URL (API key hidden):', 
      url.replace(API_KEY, '***API_KEY***'));
    
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

// Add this new function for direct API testing with multiple formats
export async function testApiFormats(zip: string, radius: string) {
  const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
  const results: Array<{
    format: string;
    success: boolean;
    url: string;
    status?: number;
    error?: string;
    data?: any;
  }> = [];
  const errors: string[] = [];
  
  // Test Format 1: /farmersmarket/?apikey=XXX&zip=YYY&radius=ZZZ
  try {
    const url1 = `${API_BASE_URL}/farmersmarket/?apikey=${API_KEY}&zip=${zip}&radius=${radius}`;
    console.log('Testing Format 1 (API key hidden):', url1.replace(API_KEY, '***API_KEY***'));
    
    const response1 = await fetch(url1, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response1.ok) {
      const data1 = await response1.json();
      results.push({ format: 'Format 1', success: true, url: url1.replace(API_KEY, '***API_KEY***'), data: data1 });
    } else {
      results.push({ format: 'Format 1', success: false, status: response1.status, url: url1.replace(API_KEY, '***API_KEY***') });
      errors.push(`Format 1 failed with status ${response1.status}`);
    }
  } catch (error) {
    results.push({ format: 'Format 1', success: false, error: String(error), url: `${API_BASE_URL}/farmersmarket/?apikey=***API_KEY***&zip=${zip}&radius=${radius}` });
    errors.push(`Format 1 exception: ${error}`);
  }
  
  // Test Format 2: /farmersmarket?apikey=XXX&zip=YYY&radius=ZZZ
  try {
    const url2 = `${API_BASE_URL}/farmersmarket?apikey=${API_KEY}&zip=${zip}&radius=${radius}`;
    console.log('Testing Format 2 (API key hidden):', url2.replace(API_KEY, '***API_KEY***'));
    
    const response2 = await fetch(url2, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response2.ok) {
      const data2 = await response2.json();
      results.push({ format: 'Format 2', success: true, url: url2.replace(API_KEY, '***API_KEY***'), data: data2 });
    } else {
      results.push({ format: 'Format 2', success: false, status: response2.status, url: url2.replace(API_KEY, '***API_KEY***') });
      errors.push(`Format 2 failed with status ${response2.status}`);
    }
  } catch (error) {
    results.push({ format: 'Format 2', success: false, error: String(error), url: `${API_BASE_URL}/farmersmarket?apikey=***API_KEY***&zip=${zip}&radius=${radius}` });
    errors.push(`Format 2 exception: ${error}`);
  }
  
  // Test Format 3: /farmersmarket/zipSearch?apikey=XXX&zip=YYY&radius=ZZZ
  try {
    const url3 = `${API_BASE_URL}/farmersmarket/zipSearch?apikey=${API_KEY}&zip=${zip}&radius=${radius}`;
    console.log('Testing Format 3 (API key hidden):', url3.replace(API_KEY, '***API_KEY***'));
    
    const response3 = await fetch(url3, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response3.ok) {
      const data3 = await response3.json();
      results.push({ format: 'Format 3', success: true, url: url3.replace(API_KEY, '***API_KEY***'), data: data3 });
    } else {
      results.push({ format: 'Format 3', success: false, status: response3.status, url: url3.replace(API_KEY, '***API_KEY***') });
      errors.push(`Format 3 failed with status ${response3.status}`);
    }
  } catch (error) {
    results.push({ format: 'Format 3', success: false, error: String(error), url: `${API_BASE_URL}/farmersmarket/zipSearch?apikey=***API_KEY***&zip=${zip}&radius=${radius}` });
    errors.push(`Format 3 exception: ${error}`);
  }
  
  // Test Format 4: /zipSearch?apikey=XXX&zip=YYY&radius=ZZZ
  try {
    const url4 = `${API_BASE_URL}/zipSearch?apikey=${API_KEY}&zip=${zip}&radius=${radius}`;
    console.log('Testing Format 4 (API key hidden):', url4.replace(API_KEY, '***API_KEY***'));
    
    const response4 = await fetch(url4, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response4.ok) {
      const data4 = await response4.json();
      results.push({ format: 'Format 4', success: true, url: url4.replace(API_KEY, '***API_KEY***'), data: data4 });
    } else {
      results.push({ format: 'Format 4', success: false, status: response4.status, url: url4.replace(API_KEY, '***API_KEY***') });
      errors.push(`Format 4 failed with status ${response4.status}`);
    }
  } catch (error) {
    results.push({ format: 'Format 4', success: false, error: String(error), url: `${API_BASE_URL}/zipSearch?apikey=***API_KEY***&zip=${zip}&radius=${radius}` });
    errors.push(`Format 4 exception: ${error}`);
  }
  
  console.log('API Format Test Results:', results);
  if (errors.length > 0) {
    console.error('API Format Test Errors:', errors);
  }
  
  return results;
} 