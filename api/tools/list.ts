/**
 * Tools List API Endpoint
 * Vercel Function to provide Terminal Jarvis tools information
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

interface TerminalTool {
  name: string;
  description: string;
  command: string;
  category: 'ai' | 'coding' | 'utility' | 'analysis';
  status: 'active' | 'loading' | 'error';
  apiLimits: {
    tokensRemaining: number;
    rateLimit: string;
    resetTime: string;
  };
}

interface ToolsResponse {
  tools: TerminalTool[];
  totalCount: number;
  categories: string[];
}

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
    // In a real implementation, this would fetch from a database or external service
    // For now, return comprehensive mock data
    const toolsData: ToolsResponse = {
      tools: [
        {
          name: 'claude',
          description: 'Anthropic client for code analysis and generation',
          command: 'tjarvis claude',
          category: 'ai',
          status: 'active',
          apiLimits: {
            tokensRemaining: Math.floor(Math.random() * 200000) + 150000,
            rateLimit: '50 req/min',
            resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
          }
        },
        {
          name: 'cursor',
          description: 'Enhanced code editor with smart suggestions',
          command: 'tjarvis cursor',
          category: 'coding',
          status: 'active',
          apiLimits: {
            tokensRemaining: Math.floor(Math.random() * 100000) + 80000,
            rateLimit: '100 req/min',
            resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
          }
        },
        {
          name: 'opencode',
          description: 'Code generation and analysis tool',
          command: 'tjarvis opencode',
          category: 'ai',
          status: 'active',
          apiLimits: {
            tokensRemaining: Math.floor(Math.random() * 50000) + 40000,
            rateLimit: '25 req/min',
            resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
          }
        },
        {
          name: 'gemini',
          description: 'Google solution for advanced code understanding',
          command: 'tjarvis gemini',
          category: 'ai',
          status: 'active',
          apiLimits: {
            tokensRemaining: Math.floor(Math.random() * 160000) + 140000,
            rateLimit: '60 req/min',
            resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
          }
        },
        {
          name: 'qwen',
          description: 'Alibaba solution for complex reasoning and analysis',
          command: 'tjarvis qwen',
          category: 'analysis',
          status: 'active',
          apiLimits: {
            tokensRemaining: Math.floor(Math.random() * 80000) + 60000,
            rateLimit: '40 req/min',
            resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
          }
        },
        {
          name: 'llxprt',
          description: 'Language model expert for code assistance',
          command: 'tjarvis llxprt',
          category: 'coding',
          status: 'active',
          apiLimits: {
            tokensRemaining: Math.floor(Math.random() * 130000) + 110000,
            rateLimit: '75 req/min',
            resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
          }
        },
        {
          name: 'codex',
          description: 'Advanced coding assistant',
          command: 'tjarvis codex',
          category: 'coding',
          status: 'active',
          apiLimits: {
            tokensRemaining: Math.floor(Math.random() * 100000) + 70000,
            rateLimit: '60 req/min',
            resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
          }
        },
        {
          name: 'crush',
          description: 'Powerful tool for code optimization',
          command: 'tjarvis crush',
          category: 'ai',
          status: 'active',
          apiLimits: {
            tokensRemaining: Math.floor(Math.random() * 220000) + 180000,
            rateLimit: '90 req/min',
            resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
          }
        }
      ],
      totalCount: 8,
      categories: ['ai', 'coding', 'utility', 'analysis']
    };
    
    // Set caching headers
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('X-Generated-At', new Date().toISOString());
    res.setHeader('X-Tool-Count', toolsData.totalCount.toString());
    
    return res.status(200).json(toolsData);
    
  } catch (error) {
    console.error('[Tools List API] Error:', error);
    
    return res.status(500).json({
      error: 'Unable to fetch tools list',
      message: 'Tools service temporarily unavailable',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}