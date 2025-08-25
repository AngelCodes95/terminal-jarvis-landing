/**
 * Real Data Client for Terminal Jarvis
 * Fetches actual data from GitHub, NPM, and other sources
 */

// GitHub API Response Types
interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  updated_at: string;
  language: string;
  topics: string[];
}

interface GitHubContent {
  name: string;
  type: 'file' | 'dir';
  download_url: string | null;
  content?: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
}

// Application Types
export interface RealRepositoryData {
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: string;
  topics: string[];
  language: string;
  description: string;
}

export interface RealToolData {
  name: string;
  description: string;
  command: string;
  status: 'active';
}

export interface RealPackageData {
  version: string;
  weeklyDownloads: number;
  totalDownloads: number;
  description: string;
  publishedAt: string;
}

export class RealDataClient {
  private readonly GITHUB_API = 'https://api.github.com';
  private readonly REPO_OWNER = 'BA-CalderonMorales';
  private readonly REPO_NAME = 'terminal-jarvis';
  private readonly PACKAGE_NAME = 'terminal-jarvis';

  // Simple in-memory cache with TTL
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get headers for GitHub API requests with optional token
   */
  private getGitHubHeaders(): HeadersInit {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'terminal-jarvis-landing',
    };

    // Use token if available (for higher rate limits)
    const token = import.meta.env.GH_TOKEN || process.env.GH_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Check cache for fresh data
   */
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Store data in cache
   */
  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear all cached data
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Fetch real repository statistics from GitHub
   */
  async getRepositoryData(): Promise<RealRepositoryData> {
    // Prevent API calls during build time
    if (typeof window === 'undefined') {
      return {
        stars: 80,
        forks: 11,
        openIssues: 0,
        lastCommit: new Date().toISOString(),
        topics: ['cli', 'rust', 'terminal'],
        language: 'Rust',
        description: 'Terminal Jarvis CLI tool',
      };
    }

    const cacheKey = 'repository-data';
    const cachedData = this.getCachedData<RealRepositoryData>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await fetch(
        `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}`,
        {
          headers: this.getGitHubHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repo: GitHubRepo = await response.json();

      const result: RealRepositoryData = {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        lastCommit: repo.updated_at,
        topics: repo.topics || [],
        language: repo.language || 'Unknown',
        description: repo.description || 'Terminal Jarvis CLI tool',
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.warn('Failed to fetch real repository data:', error);
      // Return reasonable fallback data
      return {
        stars: 0,
        forks: 0,
        openIssues: 0,
        lastCommit: new Date().toISOString(),
        topics: ['cli', 'ai', 'terminal'],
        language: 'JavaScript',
        description: 'Terminal Jarvis - AI-powered terminal command center',
      };
    }
  }

  /**
   * Fetch real tools from tools-manifest.toml
   */
  async getToolsData(): Promise<RealToolData[]> {
    // Prevent API calls during build time
    if (typeof window === 'undefined') {
      return [
        {
          name: 'Claude',
          description: 'Anthropic Claude for code assistance',
          command: 'jarvis claude',
          status: 'active',
        },
        {
          name: 'Gemini',
          description: 'Google Gemini CLI tool',
          command: 'jarvis gemini',
          status: 'active',
        },
        {
          name: 'Qwen',
          description: 'Qwen coding assistant',
          command: 'jarvis qwen',
          status: 'active',
        },
        {
          name: 'OpenCode',
          description: 'Terminal-based AI coding agent',
          command: 'jarvis opencode',
          status: 'active',
        },
      ];
    }

    const cacheKey = 'tools-data';
    const cachedData = this.getCachedData<RealToolData[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Fetch the tools-manifest.toml file which contains the actual tool definitions
      const manifestResponse = await fetch(
        `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/tools-manifest.toml`,
        { headers: this.getGitHubHeaders() }
      );

      if (manifestResponse.ok) {
        const manifestData: GitHubContent = await manifestResponse.json();
        if (manifestData.content) {
          const manifestContent = atob(manifestData.content);
          const tools = this.parseToolsManifest(manifestContent);
          if (tools.length > 0) {
            this.setCachedData(cacheKey, tools);
            return tools;
          }
        }
      }

      // Fallback: return known Terminal Jarvis tools
      const fallbackTools = this.getKnownTools();
      this.setCachedData(cacheKey, fallbackTools);
      return fallbackTools;
    } catch (error) {
      console.warn('Failed to fetch tools from manifest:', error);
      return this.getKnownTools();
    }
  }

  /**
   * Fetch real package data - get version from Cargo.toml and downloads from crates.io
   */
  async getPackageData(): Promise<RealPackageData> {
    // Prevent API calls during build time
    if (typeof window === 'undefined') {
      return {
        version: '0.0.61',
        description: 'Terminal Jarvis CLI tool',
        weeklyDownloads: 3030,
        totalDownloads: 3030,
        publishedAt: new Date().toISOString(),
      };
    }

    const cacheKey = 'package-data';
    const cachedData = this.getCachedData<RealPackageData>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      let version = '0.0.1';
      let description = 'Terminal Jarvis CLI tool';
      let weeklyDownloads = 0;

      // Get version and description from Cargo.toml
      const cargoResponse = await fetch(
        `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/Cargo.toml`,
        { headers: this.getGitHubHeaders() }
      );

      if (cargoResponse.ok) {
        const cargoData: GitHubContent = await cargoResponse.json();
        if (cargoData.content) {
          const cargoContent = atob(cargoData.content);
          const versionMatch = cargoContent.match(/version\s*=\s*"([^"]+)"/);
          const descriptionMatch = cargoContent.match(/description\s*=\s*"([^"]+)"/);

          if (versionMatch) version = versionMatch[1];
          if (descriptionMatch) description = descriptionMatch[1];
        }
      }

      // Try to get download stats from crates.io
      try {
        const cratesResponse = await fetch(`https://crates.io/api/v1/crates/${this.PACKAGE_NAME}`);
        if (cratesResponse.ok) {
          const cratesData = await cratesResponse.json();
          weeklyDownloads = cratesData.crate?.downloads || 0;
        }
      } catch (cratesError) {
        console.warn('Could not fetch crates.io data:', cratesError);
      }

      const result: RealPackageData = {
        version,
        weeklyDownloads,
        totalDownloads: weeklyDownloads,
        description,
        publishedAt: new Date().toISOString(),
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.warn('Failed to fetch real package data:', error);
      return {
        version: '0.0.1',
        weeklyDownloads: 0,
        totalDownloads: 0,
        description: 'Terminal Jarvis CLI tool',
        publishedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Parse tools-manifest.toml file
   */
  private parseToolsManifest(manifestContent: string): RealToolData[] {
    const tools: RealToolData[] = [];
    const lines = manifestContent.split('\n');
    let currentTool: Partial<RealToolData> = {};

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) continue;

      // New tool section
      if (trimmed === '[[tools]]') {
        // Save previous tool if complete
        if (currentTool.name && currentTool.description) {
          tools.push(this.createToolFromManifest(currentTool));
        }
        currentTool = {};
        continue;
      }

      // Parse tool properties
      const match = trimmed.match(/^(\w+)\s*=\s*"([^"]+)"/);
      if (match) {
        const [, key, value] = match;
        switch (key) {
          case 'name':
          case 'display_name':
            currentTool.name = value;
            break;
          case 'description':
            currentTool.description = value;
            break;
          case 'status':
            // Status is handled but not mapped to category anymore
            break;
        }
      }
    }

    // Don't forget the last tool
    if (currentTool.name && currentTool.description) {
      tools.push(this.createToolFromManifest(currentTool));
    }

    return tools;
  }

  /**
   * Get latest release information
   */
  async getLatestRelease(): Promise<{ version: string; publishedAt: string } | null> {
    try {
      const response = await fetch(
        `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/releases/latest`,
        { headers: this.getGitHubHeaders() }
      );

      if (response.ok) {
        const release: GitHubRelease = await response.json();
        return {
          version: release.tag_name,
          publishedAt: release.published_at,
        };
      }
    } catch (error) {
      console.warn('Failed to fetch latest release:', error);
    }

    return null;
  }

  /**
   * Create tool data from manifest entry
   */
  private createToolFromManifest(tool: Partial<RealToolData>): RealToolData {
    return {
      name: tool.name || 'Unknown Tool',
      description: tool.description || 'Terminal Jarvis tool',
      command: `tjarvis ${tool.name?.toLowerCase() || 'unknown'}`,
      status: 'active',
    };
  }

  /**
   * Fallback tools when manifest isn't available - matches tools-manifest.toml
   */
  private getKnownTools(): RealToolData[] {
    return [
      {
        name: 'Claude',
        description: 'Anthropic Claude integration',
        command: 'tjarvis claude',
        status: 'active',
      },
      {
        name: 'Gemini',
        description: 'Google Gemini CLI tool',
        command: 'tjarvis gemini',
        status: 'active',
      },
      {
        name: 'Qwen',
        description: 'Qwen development assistant',
        command: 'tjarvis qwen',
        status: 'active',
      },
      {
        name: 'OpenCode',
        description: 'Terminal-based AI coding agent',
        command: 'tjarvis opencode',
        status: 'active',
      },
      {
        name: 'LLXPRT',
        description: 'Multi-provider AI development tool',
        command: 'tjarvis llxprt',
        status: 'active',
      },
      {
        name: 'Codex',
        description: 'OpenAI Codex CLI for local development',
        command: 'tjarvis codex',
        status: 'active',
      },
      {
        name: 'Crush',
        description: 'Multi-model AI assistant with LSP support',
        command: 'tjarvis crush',
        status: 'active',
      },
    ];
  }
}

// Export singleton instance
export const realDataClient = new RealDataClient();
