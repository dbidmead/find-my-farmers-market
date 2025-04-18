const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// Log environment loading
console.log('Loading environment from:', path.resolve(__dirname, '../.env.local'));
const envLocal = require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
console.log('Loading environment from:', path.resolve(__dirname, './.env'));
const envServer = require('dotenv').config({ path: path.resolve(__dirname, './.env') });

console.log('Env local loaded:', envLocal.parsed ? 'Yes' : 'No');
console.log('Env server loaded:', envServer.parsed ? 'Yes' : 'No');

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY;

// Debug API key loading
console.log('API Key loaded:', API_KEY ? 'Yes (length ' + API_KEY.length + ')' : 'No');

// Always use sample data based on environment setting
const USE_SAMPLE_DATA = process.env.USE_SAMPLE_DATA === 'true';
console.log('Using sample data:', USE_SAMPLE_DATA);

// Enable CORS for all routes
app.use(cors());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Load sample data
function getSampleData() {
  try {
    const samplePath = path.resolve(__dirname, '../src/data/sampleMarkets.js');
    const { sampleMarkets } = require(samplePath);
    return sampleMarkets;
  } catch (err) {
    console.error('Error loading sample data:', err);
    return [];
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint for market search
app.get('/api/markets', async (req, res) => {
  // If using sample data, return it directly
  if (USE_SAMPLE_DATA) {
    console.log('Using sample data for markets list');
    return res.json(getSampleData());
  }
  
  try {
    // Build the query parameters
    const params = new URLSearchParams();
    
    // Add API key first
    if (API_KEY) {
      params.append('apikey', API_KEY);
      console.log(`Using API key: ${API_KEY.substring(0, 3)}...${API_KEY.substring(API_KEY.length - 2)}`);
    } else {
      console.warn('No API key available for request!');
    }
    
    // Copy all query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'apikey') { // Avoid duplicating the API key
        params.append(key, value);
      }
    });
    
    // Try using the exact URL format from the example
    const apiUrl = `https://www.usdalocalfoodportal.com/api/farmersmarket/?${params.toString()}`;
    console.log(`Attempting request to: ${apiUrl}`);
    
    const response = await axios({
      method: 'GET',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      },
      maxRedirects: 10
    });
    
    if (response.data) {
      console.log('Received data from API');
      return res.json(response.data);
    } else {
      console.warn('API returned empty data');
      return res.json(getSampleData());
    }
  } catch (error) {
    console.error('Error making API request:', error.message);
    
    // Log additional error details if available
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', JSON.stringify(error.response.headers));
    }
    
    // Fall back to sample data on any error
    console.log('Falling back to sample data due to error');
    return res.json(getSampleData());
  }
});

// Proxy endpoint for market details
app.get('/api/markets/:id', async (req, res) => {
  const { id } = req.params;
  
  // If using sample data, return it directly
  if (USE_SAMPLE_DATA) {
    console.log('Using sample data for market details');
    const samples = getSampleData();
    const market = samples.find(m => m.id === id) || samples[0];
    return res.json(market);
  }
  
  try {
    // Build the URL for market details - notice the trailing slash
    let apiUrl = `https://www.usdalocalfoodportal.com/api/farmersmarket/${id}/`;
    
    // Add API key if available
    if (API_KEY) {
      apiUrl += `?apikey=${API_KEY}`;
      console.log(`Using API key: ${API_KEY.substring(0, 3)}...${API_KEY.substring(API_KEY.length - 2)}`);
    } else {
      console.warn('No API key available for market details request!');
    }
    
    console.log(`Attempting request to: ${apiUrl}`);
    
    const response = await axios({
      method: 'GET',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      },
      maxRedirects: 10
    });
    
    if (response.data) {
      console.log('Received data from API');
      return res.json(response.data);
    } else {
      console.warn('API returned empty data');
      const samples = getSampleData();
      const market = samples.find(m => m.id === id) || samples[0];
      return res.json(market);
    }
  } catch (error) {
    console.error('Error making API request:', error.message);
    
    // Log additional error details if available
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', JSON.stringify(error.response.headers));
    }
    
    // Fall back to sample data on any error
    console.log('Falling back to sample data due to error');
    const samples = getSampleData();
    const market = samples.find(m => m.id === id) || samples[0];
    return res.json(market);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Sample data mode: ${USE_SAMPLE_DATA ? 'ENABLED' : 'DISABLED'}`);
}); 