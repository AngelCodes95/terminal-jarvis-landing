/**
 * Tools Service
 * Handles Terminal Jarvis tools data and metadata
 */

import { APIResult } from '@ba-calderonmorales/clean-api';
import { CachedAPIClient } from '../core/cachedApiClient';
import { buildRoute } from '../config/routes';
import { Environment } from '../config/apiConfig';

// Import existing types from the current client
import { ToolsResponse, ToolDetails } from '../terminalClient';

export class ToolsService extends CachedAPIClient {
  constructor(environment?: Environment) {
    super(environment);
  }
  
  protected setupRoutes(): void {
    this.addRoute('toolsList', buildRoute('tools', 'list'));
    this.addRoute('toolDetails', buildRoute('tools', 'details'));
  }
  
  /**
   * Get all available tools with caching
   */
  async getTools(): Promise<APIResult<ToolsResponse>> {
    // In development, return mock data directly to avoid API errors
    if (this.environment === 'development') {
      return { data: this.getMockTools() };
    }
    
    return this.cachedRequest<ToolsResponse>(
      'tools-list',
      {
        url: this.routes.toolsList,
        method: 'GET'
      },
      () => this.getMockTools()
    );
  }
  
  /**
   * Get detailed information about a specific tool
   */
  async getToolDetails(toolName: string): Promise<APIResult<ToolDetails>> {
    const cacheKey = `tool-details-${toolName}`;
    
    return this.cachedRequest<ToolDetails>(
      cacheKey,
      {
        url: this.routes.toolDetails.replace(':toolName', encodeURIComponent(toolName)),
        method: 'GET'
      },
      () => this.getMockToolDetails(toolName)
    );
  }
  
  /**
   * Get tools with fallback (for existing component compatibility)
   */
  async getToolsWithFallback(): Promise<APIResult<ToolsResponse>> {
    return this.getTools();
  }
  
  /**
   * Force refresh of tools list (bypass cache)
   */
  async refreshTools(): Promise<APIResult<ToolsResponse>> {
    this.clearCacheKey('tools-list');
    return this.getTools();
  }
  
  /**
   * Dynamic mock tools data for development and fallback
   * MOCK DATA: Generates realistic random variations for development testing
   */
  private getMockTools(): ToolsResponse {
    // MOCK: Helper function to generate realistic API limits
    const generateMockLimits = () => ({
      tokensRemaining: Math.floor(Math.random() * 200000) + 50000, // 50k-250k
      rateLimit: `${[25, 50, 60, 75, 90, 100][Math.floor(Math.random() * 6)]} req/min`,
      resetTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
    });

    return {
      tools: [
        {
          name: 'claude',
          description: 'Anthropic client for code analysis and generation',
          command: 'tjarvis claude',
          category: 'ai',
          status: 'active',
          apiLimits: generateMockLimits()
        },
        {
          name: 'cursor',
          description: 'Enhanced code editor with smart suggestions',
          command: 'tjarvis cursor',
          category: 'coding',
          status: 'active',
          apiLimits: generateMockLimits()
        },
        {
          name: 'opencode',
          description: 'Code generation and analysis tool',
          command: 'tjarvis opencode',
          category: 'ai',
          status: 'active',
          apiLimits: generateMockLimits()
        },
        {
          name: 'gemini',
          description: 'Google solution for advanced code understanding',
          command: 'tjarvis gemini',
          category: 'ai',
          status: 'active',
          apiLimits: generateMockLimits()
        },
        {
          name: 'qwen',
          description: 'Alibaba solution for complex reasoning and analysis',
          command: 'tjarvis qwen',
          category: 'analysis',
          status: 'active',
          apiLimits: generateMockLimits()
        },
        {
          name: 'llxprt',
          description: 'Language model expert for code assistance',
          command: 'tjarvis llxprt',
          category: 'coding',
          status: 'active',
          apiLimits: generateMockLimits()
        },
        {
          name: 'codex',
          description: 'Advanced coding assistant',
          command: 'tjarvis codex',
          category: 'coding',
          status: 'active',
          apiLimits: generateMockLimits()
        },
        {
          name: 'crush',
          description: 'Powerful tool for code optimization',
          command: 'tjarvis crush',
          category: 'ai',
          status: 'active',
          apiLimits: generateMockLimits()
        }
      ],
      totalCount: 8,
      categories: ['ai', 'coding', 'utility', 'analysis']
    };
  }
  
  /**
   * Mock tool details for fallback
   */
  private getMockToolDetails(toolName: string): ToolDetails {
    const baseTool = this.getMockTools().tools.find(t => t.name === toolName);
    
    if (!baseTool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    
    return {
      ...baseTool,
      documentation: `Comprehensive documentation for ${toolName}`,
      examples: [
        `tjarvis ${toolName} --analyze src/`,
        `tjarvis ${toolName} --prompt "Explain this function"`,
        `tjarvis ${toolName} --file main.js`
      ],
      dependencies: ['node', 'npm'],
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Clear specific cache key
   */
  private clearCacheKey(key: string): void {
    this.cache.delete(key);
  }
}