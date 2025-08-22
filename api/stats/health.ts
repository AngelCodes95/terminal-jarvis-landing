/**
 * Health Check API Endpoint
 * Vercel Function to monitor external service availability
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { ExternalAPIService } from '../lib/externalApiService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
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
    const apiService = new ExternalAPIService();
    const healthData = await apiService.getServiceHealth();
    
    // Set response status based on health
    const statusCode = healthData.status === 'healthy' ? 200 : 
                      healthData.status === 'degraded' ? 207 : 503;
    
    // Set headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Health-Status', healthData.status);
    res.setHeader('X-Response-Time', healthData.responseTime.toString());
    
    return res.status(statusCode).json(healthData);
    
  } catch (error) {
    console.error('[Health Check API] Error:', error);
    
    return res.status(503).json({
      status: 'down',
      timestamp: new Date().toISOString(),
      services: {
        github: 'down',
        npm: 'down'
      },
      responseTime: 0,
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
}