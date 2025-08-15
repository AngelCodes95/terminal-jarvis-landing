/**
 * Live Statistics Service
 * Handles real-time data fetching from Terminal Jarvis statistics endpoints
 */

import { APIResult } from '@ba-calderonmorales/clean-api';
import { CachedAPIClient } from '../core/cachedApiClient';
import { buildRoute } from '../config/routes';
import { HealthStatus, Environment } from '../config/apiConfig';

// Import existing types from the current client
import { LiveUpdates } from '../terminalClient';

export class LiveStatsService extends CachedAPIClient {
  constructor(environment?: Environment) {
    super(environment);
  }
  
  protected setupRoutes(): void {
    this.addRoute('liveStats', buildRoute('stats', 'live'));
    this.addRoute('health', buildRoute('stats', 'health'));
  }
  
  /**
   * Get live statistics with caching and fallback
   */
  async getLiveStats(): Promise<APIResult<LiveUpdates>> {
    // In development, return mock data directly to avoid API errors
    if (this.environment === 'development') {
      return { data: this.getMockStats() };
    }
    
    return this.cachedRequest<LiveUpdates>(
      'live-stats',
      {
        url: this.routes.liveStats,
        method: 'GET'
      },
      () => this.getMockStats()
    );
  }
  
  /**
   * Get service health status
   */
  async getHealth(): Promise<APIResult<HealthStatus>> {
    return this.request<HealthStatus>({
      url: this.routes.health,
      method: 'GET'
    });
  }
  
  /**
   * Force refresh of live stats (bypass cache)
   */
  async refreshLiveStats(): Promise<APIResult<LiveUpdates>> {
    // Clear cache for this key
    this.clearCacheKey('live-stats');
    
    return this.getLiveStats();
  }
  
  /**
   * Get cached stats if available, otherwise return null
   */
  getCachedLiveStats(): LiveUpdates | null {
    return this.getCachedData<LiveUpdates>('live-stats');
  }
  
  /**
   * Dynamic mock data for development and fallback scenarios
   * MOCK DATA: Generates realistic random variations for development testing
   * This data cycles on each page reload to simulate live changes
   */
  private getMockStats(): LiveUpdates {
    // Generate realistic variations around base values
    const baseDownloads = 2200;
    const baseStars = 48;
    const baseForks = 7;
    
    // MOCK: Random variations within realistic ranges
    const downloadVariation = Math.floor(Math.random() * 400) - 200; // ±200
    const starVariation = Math.floor(Math.random() * 10) - 5; // ±5
    const forkVariation = Math.floor(Math.random() * 4) - 2; // ±2
    const issueCount = Math.floor(Math.random() * 3); // 0-2 issues
    
    // MOCK: Generate realistic version number (patch increments)
    const patchVersion = 55 + Math.floor(Math.random() * 10); // 55-64
    const mockVersion = `0.0.${patchVersion}`;
    
    return {
      version: mockVersion,
      downloadStats: {
        npmWeeklyDownloads: Math.max(1800, baseDownloads + downloadVariation),
        npmVersion: mockVersion,
        // MOCK: Crates.io typically has lower download numbers than NPM
        cratesVersion: mockVersion,
        cratesDownloads: Math.max(200, Math.floor((baseDownloads + downloadVariation) * 0.15)) // ~15% of NPM downloads
      },
      communityStats: {
        githubStars: Math.max(40, baseStars + starVariation),
        githubForks: Math.max(5, baseForks + forkVariation),
        openIssues: issueCount,
        // MOCK: Simulate recent activity (last 24 hours)
        lastCommit: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      },
      toolStatus: {
        supportedTools: ['Claude', 'Gemini', 'Qwen', 'OpenCode', 'LLXPRT', 'Codex', 'Crush'],
        totalToolCount: 7
      }
    };
  }
  
  /**
   * Clear specific cache key
   */
  private clearCacheKey(key: string): void {
    this.cache.delete(key);
  }
}