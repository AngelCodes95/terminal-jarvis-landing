/**
 * External API Service
 * Handles communication with GitHub and NPM APIs with caching and error handling
 */

interface CachedResponse<T = unknown> {
  data: T;
  timestamp: number;
  expires: number;
}

interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  name: string;
  description: string;
}

interface NPMDownloadResponse {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

interface NPMPackageResponse {
  'dist-tags': {
    latest: string;
  };
  versions: Record<string, unknown>;
  time: Record<string, string>;
}

interface CratesPackageResponse {
  crate: {
    id: string;
    name: string;
    newest_version: string;
    downloads: number;
    recent_downloads: number;
  };
  versions: Array<{
    num: string;
    downloads: number;
    created_at: string;
  }>;
}

export interface LiveStatsData {
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

export class ExternalAPIService {
  private cache = new Map<string, CachedResponse>();
  private readonly CACHE_TTL = 180000; // 3 minutes
  private readonly REQUEST_TIMEOUT = 8000; // 8 seconds
  
  private readonly GITHUB_REPO = 'BA-CalderonMorales/terminal-jarvis';
  private readonly NPM_PACKAGE = 'terminal-jarvis';
  private readonly CRATES_PACKAGE = 'terminal-jarvis';
  
  /**
   * Fetch live statistics from external APIs
   */
  async fetchLiveStats(): Promise<LiveStatsData> {
    const [githubResult, npmDownloadsResult, npmPackageResult, cratesResult] = await Promise.allSettled([
      this.fetchGitHubStats(),
      this.fetchNPMDownloads(),
      this.fetchNPMPackageInfo(),
      this.fetchCratesPackageInfo()
    ]);
    
    // Extract data with fallbacks
    const githubData = githubResult.status === 'fulfilled' ? githubResult.value : null;
    const npmDownloads = npmDownloadsResult.status === 'fulfilled' ? npmDownloadsResult.value : null;
    const npmPackage = npmPackageResult.status === 'fulfilled' ? npmPackageResult.value : null;
    const cratesData = cratesResult.status === 'fulfilled' ? cratesResult.value : null;
    
    return {
      version: npmPackage?.['dist-tags']?.latest || '0.0.55',
      downloadStats: {
        npmWeeklyDownloads: npmDownloads?.downloads || 2198,
        npmVersion: npmPackage?.['dist-tags']?.latest || '0.0.55',
        cratesVersion: cratesData?.crate?.newest_version || '0.0.55',
        cratesDownloads: cratesData?.crate?.recent_downloads || 330
      },
      communityStats: {
        githubStars: githubData?.stargazers_count || 48,
        githubForks: githubData?.forks_count || 7,
        openIssues: githubData?.open_issues_count || 0,
        lastCommit: githubData?.updated_at || new Date().toISOString()
      },
      toolStatus: {
        supportedTools: ['Claude', 'Gemini', 'Qwen', 'OpenCode', 'LLXPRT', 'Codex', 'Crush'],
        totalToolCount: 7
      }
    };
  }
  
  /**
   * Get service health status
   */
  async getServiceHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    timestamp: string;
    services: {
      github: 'up' | 'down' | 'degraded';
      npm: 'up' | 'down' | 'degraded';
    };
    responseTime: number;
  }> {
    const startTime = Date.now();
    
    const [githubHealth, npmHealth] = await Promise.allSettled([
      this.checkGitHubHealth(),
      this.checkNPMHealth()
    ]);
    
    const responseTime = Date.now() - startTime;
    
    const githubStatus = githubHealth.status === 'fulfilled' ? 'up' : 'down';
    const npmStatus = npmHealth.status === 'fulfilled' ? 'up' : 'down';
    
    let overallStatus: 'healthy' | 'degraded' | 'down';
    if (githubStatus === 'up' && npmStatus === 'up') {
      overallStatus = 'healthy';
    } else if (githubStatus === 'up' || npmStatus === 'up') {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'down';
    }
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        github: githubStatus,
        npm: npmStatus
      },
      responseTime
    };
  }
  
  /**
   * Fetch GitHub repository statistics
   */
  private async fetchGitHubStats(): Promise<GitHubRepoResponse> {
    const cacheKey = 'github-stats';
    const cached = this.getCachedData<GitHubRepoResponse>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const response = await this.fetchWithTimeout(
      `https://api.github.com/repos/${this.GITHUB_REPO}`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'terminal-jarvis-landing'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    this.setCachedData(cacheKey, data);
    
    return data;
  }
  
  /**
   * Fetch NPM download statistics
   */
  private async fetchNPMDownloads(): Promise<NPMDownloadResponse> {
    const cacheKey = 'npm-downloads';
    const cached = this.getCachedData<NPMDownloadResponse>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const response = await this.fetchWithTimeout(
      `https://api.npmjs.org/downloads/point/last-week/${this.NPM_PACKAGE}`
    );
    
    if (!response.ok) {
      throw new Error(`NPM Downloads API error: ${response.status}`);
    }
    
    const data = await response.json();
    this.setCachedData(cacheKey, data);
    
    return data;
  }
  
  /**
   * Fetch NPM package information
   */
  private async fetchNPMPackageInfo(): Promise<NPMPackageResponse> {
    const cacheKey = 'npm-package';
    const cached = this.getCachedData<NPMPackageResponse>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const response = await this.fetchWithTimeout(
      `https://registry.npmjs.org/${this.NPM_PACKAGE}`
    );
    
    if (!response.ok) {
      throw new Error(`NPM Registry API error: ${response.status}`);
    }
    
    const data = await response.json();
    this.setCachedData(cacheKey, data);
    
    return data;
  }
  
  /**
   * Fetch Crates.io package information
   */
  private async fetchCratesPackageInfo(): Promise<CratesPackageResponse> {
    const cacheKey = 'crates-package';
    const cached = this.getCachedData<CratesPackageResponse>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const response = await this.fetchWithTimeout(
      `https://crates.io/api/v1/crates/${this.CRATES_PACKAGE}`
    );
    
    if (!response.ok) {
      throw new Error(`Crates.io API error: ${response.status}`);
    }
    
    const data = await response.json();
    this.setCachedData(cacheKey, data);
    
    return data;
  }
  
  /**
   * Health check for GitHub API
   */
  private async checkGitHubHealth(): Promise<void> {
    const response = await this.fetchWithTimeout('https://api.github.com/rate_limit', {
      method: 'HEAD'
    });
    
    if (!response.ok) {
      throw new Error(`GitHub health check failed: ${response.status}`);
    }
  }
  
  /**
   * Health check for NPM API
   */
  private async checkNPMHealth(): Promise<void> {
    const response = await this.fetchWithTimeout('https://registry.npmjs.org/', {
      method: 'HEAD'
    });
    
    if (!response.ok) {
      throw new Error(`NPM health check failed: ${response.status}`);
    }
  }
  
  /**
   * Fetch with timeout wrapper
   */
  private async fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  /**
   * Get cached data if valid
   */
  private getCachedData<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * Store data in cache with TTL
   */
  private setCachedData<T>(key: string, data: T): void {
    const entry: CachedResponse<T> = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + this.CACHE_TTL
    };
    
    this.cache.set(key, entry);
  }
}