/**
 * Real Data Service
 * Clean-API compatible service that fetches actual Terminal Jarvis data
 */

import { APIResult, APIError } from '@ba-calderonmorales/clean-api';
import {
  realDataClient,
  type RealRepositoryData,
  type RealPackageData,
  type RealToolData,
} from '../realDataClient';

// Maintain compatibility with existing types
export interface LiveUpdates {
  version: string;
  downloadStats: {
    npmWeeklyDownloads: number;
    npmVersion: string;
    cratesVersion: string;
    cratesTotalDownloads: number;
    cratesRecentDownloads: number;
  };
  communityStats: {
    githubStars: number;
    githubForks: number;
    openIssues: number;
    lastCommit: string;
  };
}

export interface TerminalTool {
  id: string;
  name: string;
  description: string;
  command: string;
  status: 'active' | 'loading' | 'error';
}

export interface ToolsResponse {
  tools: TerminalTool[];
  totalCount: number;
}

export class RealDataService {
  /**
   * Get live statistics from real sources
   */
  async getLiveStats(): Promise<APIResult<LiveUpdates>> {
    try {
      const [repoData, packageData] = await Promise.all([
        realDataClient.getRepositoryData(),
        realDataClient.getPackageData(),
      ]);

      const liveStats: LiveUpdates = {
        version: packageData.version,
        downloadStats: {
          npmWeeklyDownloads: packageData.npmWeeklyDownloads,
          npmVersion: packageData.version,
          cratesVersion: packageData.version,
          cratesTotalDownloads: packageData.cratesTotalDownloads,
          cratesRecentDownloads: packageData.cratesRecentDownloads,
        },
        communityStats: {
          githubStars: repoData.stars,
          githubForks: repoData.forks,
          openIssues: repoData.openIssues,
          lastCommit: repoData.lastCommit,
        },
      };

      return { data: liveStats };
    } catch (error) {
      console.error('Failed to fetch live statistics:', error);
      return {
        error: new APIError('Failed to fetch live statistics'),
      };
    }
  }

  /**
   * Get tools data from real sources
   */
  async getTools(): Promise<APIResult<ToolsResponse>> {
    try {
      const realTools = await realDataClient.getToolsData();
      return { data: this.toToolsResponse(realTools) };
    } catch (error) {
      console.error('Failed to fetch tools data:', error);
      return {
        error: new APIError('Failed to fetch tools data'),
      };
    }
  }

  /**
   * Synchronous fallback catalog for the initial render, before the live
   * fetch in getTools() has had a chance to resolve. Lets the page show
   * real content immediately instead of gating everything behind a loading
   * screen.
   */
  getFallbackTools(): ToolsResponse {
    return this.toToolsResponse(realDataClient.getKnownTools());
  }

  private toToolsResponse(realTools: RealToolData[]): ToolsResponse {
    const tools: TerminalTool[] = realTools.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      command: tool.command,
      status: 'active' as const,
    }));

    return { tools, totalCount: tools.length };
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo(): Promise<APIResult<RealRepositoryData>> {
    try {
      const repoData = await realDataClient.getRepositoryData();
      return { data: repoData };
    } catch (error) {
      console.error('Failed to fetch repository information:', error);
      return {
        error: new APIError('Failed to fetch repository information'),
      };
    }
  }

  /**
   * Get package information
   */
  async getPackageInfo(): Promise<APIResult<RealPackageData>> {
    try {
      const packageData = await realDataClient.getPackageData();
      return { data: packageData };
    } catch (error) {
      console.error('Failed to fetch package information:', error);
      return {
        error: new APIError('Failed to fetch package information'),
      };
    }
  }

  /**
   * Force refresh of all cached data
   */
  async refreshAllData() {
    const [tools, liveStats] = await Promise.all([this.getTools(), this.getLiveStats()]);

    return {
      tools,
      liveStats,
    };
  }
}

// Export singleton instance
export const realDataService = new RealDataService();
