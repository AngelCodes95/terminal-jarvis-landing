/**
 * Live Statistics API Endpoint
 * Vercel Function to provide Terminal Jarvis live statistics
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { ExternalAPIService } from '../lib/externalApiService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }
  
  try {
    const startTime = Date.now();
    const apiService = new ExternalAPIService();
    
    // Fetch live statistics
    const liveData = await apiService.fetchLiveStats();
    
    const responseTime = Date.now() - startTime;
    
    // Set caching headers for optimal performance
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=300');
    res.setHeader('X-Response-Time', responseTime.toString());
    res.setHeader('X-Generated-At', new Date().toISOString());
    
    return res.status(200).json(liveData);
    
  } catch (error) {
    console.error('[Live Stats API] Error:', error);
    
    // Return structured error response
    return res.status(500).json({
      error: 'External API temporarily unavailable',
      message: 'Unable to fetch live statistics',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}