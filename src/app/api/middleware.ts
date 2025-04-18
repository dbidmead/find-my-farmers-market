import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cors from 'cors';

// Helper method to initialize the middleware
function initMiddleware(middleware: any) {
  return (req: NextRequest, res: NextResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// Initialize the CORS middleware
export const cors = initMiddleware(
  Cors({
    // Allow requests from any origin
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

// Function to apply CORS headers to a response
export function applyCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
} 