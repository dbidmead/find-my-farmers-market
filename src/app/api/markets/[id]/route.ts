import { NextRequest, NextResponse } from 'next/server';
import { sampleMarkets } from '../../../../data/sampleMarkets';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY;
  
  // Flag to use sample data (for development or if the API is down)
  const useSampleData = process.env.NODE_ENV === 'development' || process.env.USE_SAMPLE_DATA === 'true';

  if (!id) {
    return NextResponse.json(
      { error: 'Market ID is required' },
      { status: 400 }
    );
  }

  // Return sample data if needed
  if (useSampleData) {
    console.log('Using sample market data for ID:', id);
    const market = sampleMarkets.find(market => market.id === id);
    
    if (market) {
      return NextResponse.json(market);
    } else {
      // If ID not found in sample data, return the first sample market
      console.warn(`No sample market found with ID ${id}, using first available.`);
      return NextResponse.json(sampleMarkets[0]);
    }
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
      },
    });

    if (!response.ok) {
      console.warn(`API returned status: ${response.status}. Falling back to sample data.`);
      const market = sampleMarkets.find(market => market.id === id) || sampleMarkets[0];
      return NextResponse.json(market);
    }

    const data = await response.json();
    
    // If the API returns empty or invalid data, fall back to sample data
    if (!data) {
      console.warn('API returned no data. Falling back to sample data.');
      const market = sampleMarkets.find(market => market.id === id) || sampleMarkets[0];
      return NextResponse.json(market);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching market details:', error);
    console.warn('Falling back to sample data due to error');
    const market = sampleMarkets.find(market => market.id === id) || sampleMarkets[0];
    return NextResponse.json(market);
  }
} 