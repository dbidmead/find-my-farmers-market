import { NextRequest, NextResponse } from 'next/server';
import { applyCorsHeaders } from '../middleware';

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}

export async function GET(request: NextRequest) {
  // Get the URL parameters
  const searchParams = request.nextUrl.searchParams;
  const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY;
  
  try {
    // Build the URL with appropriate parameters for the USDA API
    const params = new URLSearchParams();
    
    // Copy all search parameters
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    
    // Add API key if available
    if (apiKey) {
      params.append('apikey', apiKey);
    }
    
    // Use appropriate URL for the main market listing endpoint
    const apiUrl = `https://www.usdalocalfoodportal.com/api/farmersmarket?${params.toString()}`;
    console.log('Fetching from external API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FarmersMarketDirectory/1.0'
      },
      // Make sure we're not sending cookies or credentials
      credentials: 'omit'
    });
    
    if (!response.ok) {
      console.warn(`API returned status: ${response.status}`);
      const errorResponse = NextResponse.json(
        { error: `API responded with status ${response.status}` },
        { status: response.status }
      );
      return applyCorsHeaders(errorResponse);
    }
    
    const data = await response.json();
    return applyCorsHeaders(NextResponse.json(data));
  } catch (error) {
    console.error('Error proxying request:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch from API' },
      { status: 500 }
    );
    return applyCorsHeaders(errorResponse);
  }
} 