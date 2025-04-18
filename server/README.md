# Express Proxy Server for USDA Farmers Market API

This server acts as a proxy between your Next.js application and the USDA Farmers Market API.
It avoids CORS issues by making server-to-server requests to the API.

## Why Use a Proxy Server?

1. **Bypass CORS Restrictions**: Browser security prevents direct API calls to other domains
2. **Hide API Keys**: Keep your API keys secure on the server-side
3. **Transform Responses**: Ability to modify API responses before sending to the client
4. **Caching**: Implement caching to reduce API calls
5. **Rate Limiting**: Better control over API request rates

## Running the Proxy Server

Run the proxy server in a separate terminal:

```bash
npm run proxy
```

The server will start on http://localhost:3001 by default.

## Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/markets` - Search for farmers markets (supports zip, lat/lng, radius)
- `GET /api/markets/:id` - Get details for a specific market

## Using with the Next.js App

1. Start the proxy server: `npm run proxy`
2. In a separate terminal, start the Next.js dev server: `npm run dev`
3. The frontend will automatically use the proxy server for API requests

## Production Deployment

For production, you can:

1. Deploy the Express server and Next.js app together
2. Update the `PROXY_BASE_URL` in `src/services/marketsService.ts` based on your deployment configuration
3. Consider using environment variables to configure the proxy URL based on environment 