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
  id: string;
  name: string;
  description: string;
  command: string;
  status: 'active';
}

/**
 * Cargo.toml version as of the last manual sync with the upstream repo. Used
 * only when the live fetch (below) hasn't resolved yet or fails outright.
 */
export const FALLBACK_VERSION = '0.1.15';

export interface RealPackageData {
  version: string;
  description: string;
  npmWeeklyDownloads: number;
  cratesTotalDownloads: number;
  cratesRecentDownloads: number;
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
   * fetch() has no built-in timeout, so a slow or blocked host would hang
   * the whole loading sequence indefinitely with nothing rendered. Every
   * outbound request goes through this instead.
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs = 8000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Get headers for GitHub API requests.
   *
   * No auth token here on purpose: this is client-side browser code, so any
   * token embedded in the bundle would be public. Calls per page load stay
   * well under the unauthenticated 60/hour limit (repo info, Cargo.toml,
   * one harnesses directory listing).
   */
  private getGitHubHeaders(): HeadersInit {
    return {
      Accept: 'application/vnd.github.v3+json',
    };
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

  // In-flight /repos request, so concurrent callers that both miss the
  // cache (getRepositoryData() and getDefaultBranch(), fired together via
  // Promise.all on page load) await the same request instead of each
  // firing their own before either has had a chance to populate the cache.
  private repoInfoRequest: Promise<GitHubRepo | null> | null = null;

  /**
   * Fetch (or reuse the cached/in-flight) raw GitHub repo object. Shared by
   * getRepositoryData() and getDefaultBranch() so both derive from a single
   * network call instead of each fetching /repos/{owner}/{repo} on their own.
   */
  private async fetchRepoInfo(): Promise<GitHubRepo | null> {
    const cacheKey = 'repo-raw';
    const cachedData = this.getCachedData<GitHubRepo>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    if (!this.repoInfoRequest) {
      this.repoInfoRequest = this.requestRepoInfo(cacheKey).finally(() => {
        this.repoInfoRequest = null;
      });
    }
    return this.repoInfoRequest;
  }

  private async requestRepoInfo(cacheKey: string): Promise<GitHubRepo | null> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}`,
        { headers: this.getGitHubHeaders() }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repo: GitHubRepo = await response.json();
      this.setCachedData(cacheKey, repo);
      return repo;
    } catch (error) {
      console.warn('Failed to fetch repository data:', error);
      return null;
    }
  }

  /**
   * Resolve the repo's default branch for building raw.githubusercontent.com
   * URLs, instead of assuming "main". Falls back to "main" only if the fetch
   * itself fails, which matches the repo's actual branch today.
   */
  private async getDefaultBranch(): Promise<string> {
    const repo = await this.fetchRepoInfo();
    return repo?.default_branch ?? 'main';
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

    const repo = await this.fetchRepoInfo();
    if (!repo) {
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

    return {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      lastCommit: repo.updated_at,
      topics: repo.topics || [],
      language: repo.language || 'Unknown',
      description: repo.description || 'Terminal Jarvis CLI tool',
    };
  }

  /**
   * Fetch the current harness catalog: one directory per coding agent under
   * harnesses/<name>/index.toml (the tools-manifest.toml this used to read
   * was replaced by that layout and no longer exists in the repo).
   */
  async getToolsData(): Promise<RealToolData[]> {
    // Prevent API calls during build time
    if (typeof window === 'undefined') {
      return this.getKnownTools();
    }

    const cacheKey = 'tools-data';
    const cachedData = this.getCachedData<RealToolData[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const listResponse = await this.fetchWithTimeout(
        `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/harnesses`,
        { headers: this.getGitHubHeaders() }
      );

      if (!listResponse.ok) {
        throw new Error(`GitHub API error: ${listResponse.status}`);
      }

      const entries: GitHubContent[] = await listResponse.json();
      const harnessNames = entries.filter((entry) => entry.type === 'dir').map((e) => e.name);

      if (harnessNames.length === 0) {
        throw new Error('No harness directories found');
      }

      // Fetched from raw.githubusercontent.com (not the REST API), so this
      // doesn't count against the 60/hour unauthenticated rate limit above.
      const branch = await this.getDefaultBranch();
      const tools = await Promise.all(
        harnessNames.map((name) => this.fetchHarnessTool(name, branch))
      );
      const validTools = tools.filter((tool): tool is RealToolData => tool !== null);

      if (validTools.length === 0) {
        throw new Error('Failed to parse any harness definitions');
      }

      this.setCachedData(cacheKey, validTools);
      return validTools;
    } catch (error) {
      console.warn('Failed to fetch harness catalog, using known-tools fallback:', error);
      return this.getKnownTools();
    }
  }

  /**
   * Fetch and parse a single harnesses/<name>/index.toml
   */
  private async fetchHarnessTool(name: string, branch: string): Promise<RealToolData | null> {
    try {
      const response = await this.fetchWithTimeout(
        `https://raw.githubusercontent.com/${this.REPO_OWNER}/${this.REPO_NAME}/${branch}/harnesses/${name}/index.toml`
      );
      if (!response.ok) return null;

      const content = await response.text();
      const displayMatch = content.match(/^display\s*=\s*["']([^"']+)["']/m);
      const descriptionMatch = content.match(/^description\s*=\s*["']([^"']+)["']/m);

      if (!displayMatch || !descriptionMatch) return null;

      return {
        id: name,
        name: displayMatch[1],
        description: descriptionMatch[1],
        command: `npx terminal-jarvis show ${name}`,
        status: 'active',
      };
    } catch (error) {
      console.warn(`Failed to fetch harness definition for ${name}:`, error);
      return null;
    }
  }

  /**
   * Fetch real package data: version from Cargo.toml, weekly installs from
   * the npm registry, and crates.io's own download counters (total +
   * trailing 90-day "recent"; crates.io does not expose a weekly figure, so
   * we report what it actually gives us instead of estimating one).
   */
  async getPackageData(): Promise<RealPackageData> {
    // Prevent API calls during build time
    if (typeof window === 'undefined') {
      return {
        version: FALLBACK_VERSION,
        description: 'Terminal Jarvis CLI tool',
        npmWeeklyDownloads: 0,
        cratesTotalDownloads: 0,
        cratesRecentDownloads: 0,
        publishedAt: new Date().toISOString(),
      };
    }

    const cacheKey = 'package-data';
    const cachedData = this.getCachedData<RealPackageData>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    let version = FALLBACK_VERSION;
    let description = 'Terminal Jarvis CLI tool';

    try {
      const cargoResponse = await this.fetchWithTimeout(
        `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/Cargo.toml`,
        { headers: this.getGitHubHeaders() }
      );

      if (cargoResponse.ok) {
        const cargoData: GitHubContent = await cargoResponse.json();
        if (cargoData.content) {
          const cargoContent = atob(cargoData.content);
          const versionMatch = cargoContent.match(/version\s*=\s*["']([^"']+)["']/);
          const descriptionMatch = cargoContent.match(/description\s*=\s*["']([^"']+)["']/);

          if (versionMatch) version = versionMatch[1];
          if (descriptionMatch) description = descriptionMatch[1];
        }
      }
    } catch (error) {
      console.warn('Failed to fetch Cargo.toml:', error);
    }

    let npmWeeklyDownloads = 0;
    try {
      const npmResponse = await this.fetchWithTimeout(
        `https://api.npmjs.org/downloads/point/last-week/${this.PACKAGE_NAME}`
      );
      if (npmResponse.ok) {
        const npmData = await npmResponse.json();
        npmWeeklyDownloads = npmData.downloads || 0;
      }
    } catch (error) {
      console.warn('Could not fetch npm download stats:', error);
    }

    let cratesTotalDownloads = 0;
    let cratesRecentDownloads = 0;
    try {
      const cratesResponse = await this.fetchWithTimeout(`https://crates.io/api/v1/crates/${this.PACKAGE_NAME}`);
      if (cratesResponse.ok) {
        const cratesData = await cratesResponse.json();
        cratesTotalDownloads = cratesData.crate?.downloads || 0;
        cratesRecentDownloads = cratesData.crate?.recent_downloads || 0;
      }
    } catch (error) {
      console.warn('Could not fetch crates.io data:', error);
    }

    const result: RealPackageData = {
      version,
      description,
      npmWeeklyDownloads,
      cratesTotalDownloads,
      cratesRecentDownloads,
      publishedAt: new Date().toISOString(),
    };

    this.setCachedData(cacheKey, result);
    return result;
  }

  /**
   * Get latest release information
   */
  async getLatestRelease(): Promise<{ version: string; publishedAt: string } | null> {
    try {
      const response = await this.fetchWithTimeout(
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
   * Fallback catalog for build time / offline / API failure, and for the
   * initial synchronous render before the live fetch resolves. Mirrors the
   * repository's harnesses/ directory as of the 0.1.15 release; the live
   * path in getToolsData() supersedes this whenever the network is up.
   */
  getKnownTools(): RealToolData[] {
    const harnesses: Array<[name: string, display: string, description: string]> = [
      ['aider', 'Aider', 'AI pair programming assistant that edits code in your local git repository'],
      ['amp', 'Amp', "Sourcegraph's AI-powered code assistant with advanced context awareness"],
      ['claude', 'Claude', "Anthropic's Claude for code assistance"],
      ['code', 'Code', 'Fork of Codex AI - multi-provider coding agent'],
      ['codex', 'OpenAI Codex', 'OpenAI coding agent CLI'],
      ['copilot', 'Copilot', 'GitHub Copilot CLI - AI pair programming directly in your terminal'],
      ['crush', 'Crush', "Charm's multi-model AI assistant with LSP"],
      ['cursor-agent', 'Cursor Agent', "AI agent replicating Cursor's capabilities in the CLI"],
      ['droid', 'Droid', "Factory AI's Droid - Automated coding engineer"],
      ['eca', 'ECA', 'Editor Code Assistant'],
      ['forge', 'Forge', 'AI-Enhanced Terminal Development Environment'],
      ['gemini', 'Gemini', "Google's Gemini CLI tool"],
      ['goose', 'Goose', "Block's AI-powered coding assistant with developer toolkit integration"],
      ['hermes', 'Hermes Agent', "Nous Research's terminal AI agent with CLI, TUI, tools, skills, and messaging gateway support"],
      ['jules', 'Jules', "Google's asynchronous coding agent in the terminal"],
      ['kilocode', 'Kilocode', 'Open-source AI coding agent'],
      ['letta', 'Letta', 'Memory-first coding agent'],
      ['llxprt', 'LLXPRT', 'Multi-provider AI coding assistant'],
      ['nanocoder', 'Nanocoder', 'Local-first coding agent'],
      ['ollama', 'Ollama', 'Get up and running with large language models locally'],
      ['openclaw', 'OpenClaw', 'Open-source AI coding assistant and multi-channel local gateway'],
      ['opencode', 'OpenCode', 'Terminal-based AI coding agent'],
      ['pi', 'Pi', 'Terminal-based coding agent'],
      ['qwen', 'Qwen', 'Qwen coding assistant'],
      ['vibe', 'Mistral Vibe', 'Minimal CLI coding agent by Mistral AI'],
    ];

    return harnesses.map(([name, display, description]) => ({
      id: name,
      name: display,
      description,
      command: `npx terminal-jarvis show ${name}`,
      status: 'active',
    }));
  }
}

// Export singleton instance
export const realDataClient = new RealDataClient();
