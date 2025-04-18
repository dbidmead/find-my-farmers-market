import { NextRequest, NextResponse } from 'next/server';
import { applyCorsHeaders } from '../../middleware';

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY;
  
  if (!id) {
    const errorResponse = NextResponse.json(
      { error: 'Market ID is required' },
      { status: 400 }
    );
    return applyCorsHeaders(errorResponse);
  }
  
  try {
    // Build the URL for market details
    let apiUrl = `https://www.usdalocalfoodportal.com/api/farmersmarket/${id}`;
    
    // Add API key if available
    if (apiKey) {
      apiUrl += `?apikey=${apiKey}`;
    }
    
    console.log('Fetching market details from API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FarmersMarketDirectory/1.0'
      },
      // Make sure we're not sending cookies or credentials
      credentials: 'omit',
      // Add cache control to avoid stale responses
      cache: 'no-store'
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
    
    // If the API returns empty or invalid data
    if (!data) {
      console.warn('API returned no data.');
      const errorResponse = NextResponse.json(
        { error: 'No data returned from API' },
        { status: 404 }
      );
      return applyCorsHeaders(errorResponse);
    }
    
    return applyCorsHeaders(NextResponse.json(data));
  } catch (error) {
    console.error('Error fetching market details:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch market details' },
      { status: 500 }
    );
    return applyCorsHeaders(errorResponse);
  }
} 