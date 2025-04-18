import { NextRequest, NextResponse } from 'next/server';
import { sampleMarkets } from '../../../data/sampleMarkets';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zip = searchParams.get('zip');
  const radius = searchParams.get('radius') || '20';
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY;
  
  // Flag to use sample data (for development or if the API is down)
  const useSampleData = process.env.NODE_ENV === 'development' || process.env.USE_SAMPLE_DATA === 'true';

  if (!zip && !(lat && lng)) {
    return NextResponse.json(
      { error: 'Either zip code or latitude/longitude must be provided' },
      { status: 400 }
    );
  }

  // Return sample data if needed
  if (useSampleData) {
    console.log('Using sample farmers market data');
    return NextResponse.json(sampleMarkets);
  }

  try {
    // Build the URL based on the parameters
    let apiUrl = 'https://www.usdalocalfoodportal.com/api/farmersmarket';
    
    // Add parameters
    if (zip) {
      apiUrl += `?zip=${zip}`;
    } else if (lat && lng) {
      apiUrl += `?lat=${lat}&lng=${lng}`;
    }
    
    // Add radius
    if (radius) {
      apiUrl += `&radius=${radius}`;
    }
    
    // Add API key if available
    if (apiKey) {
      apiUrl += `&apikey=${apiKey}`;
    }

    console.log('Fetching from API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`API returned status: ${response.status}. Falling back to sample data.`);
      return NextResponse.json(sampleMarkets);
    }

    const data = await response.json();
    
    // If the API returns empty or invalid data, fall back to sample data
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.warn('API returned no results. Falling back to sample data.');
      return NextResponse.json(sampleMarkets);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching farmers market data:', error);
    console.warn('Falling back to sample data due to error');
    return NextResponse.json(sampleMarkets);
  }
} 