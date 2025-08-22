import { APIBase, FetchClient, APIResult, APIError } from '@ba-calderonmorales/clean-api';

// Terminal Jarvis API client types and interfaces
export interface TerminalTool {
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

export interface ToolsResponse {
  tools: TerminalTool[];
  totalCount: number;
  categories: string[];
}

export interface ToolDetails extends TerminalTool {
  documentation: string;
  examples: string[];
  dependencies: string[];
  lastUpdated: string;
}

export interface CommandResponse {
  output: string;
  success: boolean;
  executionTime: number;
  toolUsed: string;
}

export interface SystemStatus {
  jarvisAlive: boolean;
  activeTools: number;
  systemLoad: number;
  lastHeartbeat: string;
}

export interface LiveUpdates {
  version: string;
  downloadStats: {
    npmWeeklyDownloads: number;
    npmVersion: string;
    cratesVersion: string;
    cratesDownloads: number;
  };
  communityStats: {
    githubStars: number;
    githubForks: number;
    openIssues: number;
    lastCommit: string;
  };
  toolStatus: {
    supportedTools: string[];
    totalToolCount: number;
  };
}

/**
 * Terminal Jarvis API Client
 * Handles data fetching for Terminal Jarvis tools and live statistics
 * Uses Clean-API patterns for proper error handling and type safety
 */
export class TerminalJarvisClient extends APIBase {
  private client: FetchClient;
  private static instance: TerminalJarvisClient;

  constructor() {
    super();
    this.client = new FetchClient();
    
    // Define Terminal Jarvis API routes
    this.addRoute('getTools', '/api/tools');
    this.addRoute('getToolDetails', '/api/tools/:toolName');
    this.addRoute('executeCommand', '/api/run');
    this.addRoute('getSystemStatus', '/api/status');
    this.addRoute('getToolCategories', '/api/categories');
    this.addRoute('getLiveUpdates', '/api/live-updates');
    this.addRoute('getDownloadStats', '/api/stats/downloads');
    this.addRoute('getGitHubMetrics', '/api/stats/github');
    
    // Configuration for API client
    this.setConfig('timeout', 10000);
    this.setConfig('baseURL', import.meta.env.VITE_API_URL || '');
    this.setConfig('retries', 3);
  }

  /**
   * Singleton pattern for consistent client across components
   */
  static getInstance(): TerminalJarvisClient {
    if (!TerminalJarvisClient.instance) {
      TerminalJarvisClient.instance = new TerminalJarvisClient();
    }
    return TerminalJarvisClient.instance;
  }

  /**
   * Fetch all available Terminal Jarvis tools
   */
  async getTools(): Promise<APIResult<ToolsResponse>> {
    try {
      const response = await this.client.request({
        url: this.routes.getTools,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return { data: response.data };
    } catch (error) {
      return { 
        error: new APIError('Failed to fetch Terminal Jarvis tools', { 
          cause: error,
          context: 'Tool discovery'
        }) 
      };
    }
  }

  /**
   * Get detailed information about a specific tool
   */
  async getToolDetails(toolName: string): Promise<APIResult<ToolDetails>> {
    try {
      const url = this.routes.getToolDetails.replace(':toolName', encodeURIComponent(toolName));
      const response = await this.client.request({
        url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return { data: response.data };
    } catch (error) {
      return { 
        error: new APIError(`Failed to fetch details for tool: ${toolName}`, { 
          cause: error,
          context: `Tool details showcase for ${toolName}`
        }) 
      };
    }
  }

  /**
   * Execute a demo command for showcase purposes
   * Used by CRTTerminal for interactive demonstrations
   */
  async executeCommand(command: string, toolName?: string): Promise<APIResult<CommandResponse>> {
    try {
      const response = await this.client.request({
        url: this.routes.executeCommand,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: { 
          command,
          tool: toolName,
          mode: 'showcase' // Indicate this is for landing page demo
        }
      });
      
      return { data: response.data };
    } catch (error) {
      return { 
        error: new APIError('Command execution failed in showcase mode', { 
          cause: error,
          context: `Demo command: ${command}`
        }) 
      };
    }
  }

  /**
   * Get Terminal Jarvis system status for alive indicators
   * Used by all components for electrified status effects
   */
  async getSystemStatus(): Promise<APIResult<SystemStatus>> {
    try {
      const response = await this.client.request({
        url: this.routes.getSystemStatus,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return { data: response.data };
    } catch (error) {
      return { 
        error: new APIError('Failed to get Terminal Jarvis system status', { 
          cause: error,
          context: 'System alive status check'
        }) 
      };
    }
  }

  /**
   * Get live statistics from GitHub and NPM APIs
   */
  async getLiveStats(): Promise<APIResult<LiveUpdates>> {
    try {
      // For development/demo purposes, return mock data to avoid CORS issues
      const mockLiveData: LiveUpdates = {
        version: '0.0.55',
        downloadStats: {
          npmWeeklyDownloads: 2198,
          npmVersion: '0.0.55'
        },
        communityStats: {
          githubStars: 48,
          githubForks: 7,
          openIssues: 0,
          lastCommit: new Date().toISOString()
        },
        toolStatus: {
          supportedTools: ['Claude', 'Gemini', 'Qwen', 'OpenCode', 'LLXPRT', 'Codex', 'Crush'],
          totalToolCount: 7
        }
      };
      
      return { data: mockLiveData };
    } catch (error) {
      return { 
        error: new APIError('Failed to fetch live statistics', { 
          cause: error,
          context: 'Live stats from GitHub/NPM APIs'
        }) 
      };
    }
  }

  /**
   * Mock data for development when API is not available
   * Maintains the electrified theme with realistic tool data
   */
  getMockTools(): ToolsResponse {
    return {
      tools: [
        {
          name: 'claude',
          description: 'Anthropic AI for code analysis and generation',
          command: 'tjarvis claude',
          category: 'ai',
          status: 'active',
          apiLimits: {
            tokensRemaining: 187420,
            rateLimit: '50 req/min',
            resetTime: '14:23'
          }
        },
        {
          name: 'cursor',
          description: 'AI-powered code editor with smart suggestions',
          command: 'tjarvis cursor',
          category: 'coding',
          status: 'active',
          apiLimits: {
            tokensRemaining: 95600,
            rateLimit: '100 req/min',
            resetTime: '08:45'
          }
        },
        {
          name: 'opencode',
          description: 'AI code generation and analysis tool',
          command: 'tjarvis opencode',
          category: 'ai',
          status: 'active',
          apiLimits: {
            tokensRemaining: 45200,
            rateLimit: '25 req/min',
            resetTime: '22:10'
          }
        },
        {
          name: 'gemini',
          description: 'Google AI for advanced code understanding',
          command: 'tjarvis gemini',
          category: 'ai',
          status: 'active',
          apiLimits: {
            tokensRemaining: 156800,
            rateLimit: '60 req/min',
            resetTime: '11:30'
          }
        },
        {
          name: 'qwen',
          description: 'Alibaba AI for complex reasoning and analysis',
          command: 'tjarvis qwen',
          category: 'analysis',
          status: 'active',
          apiLimits: {
            tokensRemaining: 73900,
            rateLimit: '40 req/min',
            resetTime: '16:55'
          }
        },
        {
          name: 'llxprt',
          description: 'Language model expert for code assistance',
          command: 'tjarvis llxprt',
          category: 'coding',
          status: 'active',
          apiLimits: {
            tokensRemaining: 124500,
            rateLimit: '75 req/min',
            resetTime: '19:15'
          }
        },
        {
          name: 'codex',
          description: 'Advanced AI coding assistant',
          command: 'tjarvis codex',
          category: 'coding',
          status: 'active',
          apiLimits: {
            tokensRemaining: 89300,
            rateLimit: '60 req/min',
            resetTime: '12:40'
          }
        },
        {
          name: 'crush',
          description: 'Powerful AI tool for code optimization',
          command: 'tjarvis crush',
          category: 'ai',
          status: 'active',
          apiLimits: {
            tokensRemaining: 203100,
            rateLimit: '90 req/min',
            resetTime: '15:20'
          }
        }
      ],
      totalCount: 7,
      categories: ['ai', 'coding', 'utility', 'analysis']
    };
  }

  /**
   * Development helper to use mock data when API unavailable
   */
  async getToolsWithFallback(): Promise<APIResult<ToolsResponse>> {
    const result = await this.getTools();
    
    if (result.error) {
      // Fallback to mock data for development
      return { data: this.getMockTools() };
    }
    
    return result;
  }
}

// Export singleton instance for component use
export const terminalClient = TerminalJarvisClient.getInstance();