/**
 * Cached API Client Base Class
 * Enterprise-grade API client with caching, retries, and error handling
 */

import { APIBase, FetchClient, APIRequest, APIResult, APIError } from '@ba-calderonmorales/clean-api';
import { APIConfig, CacheEntry, Environment, API_ENVIRONMENTS, getCurrentEnvironment } from '../config/apiConfig';
import { RequestInterceptor } from './requestInterceptor';
import { ErrorHandler, EnhancedError } from './errorHandler';

export abstract class CachedAPIClient extends APIBase {
  protected cache = new Map<string, CacheEntry>();
  protected config: APIConfig;
  protected interceptor: RequestInterceptor;
  protected environment: Environment;
  
  constructor(environment?: Environment) {
    super();
    
    this.environment = environment || getCurrentEnvironment();
    this.config = API_ENVIRONMENTS[this.environment];
    this.interceptor = new RequestInterceptor({ config: this.config });
    
    this.setupClient();
    this.setupRoutes();
  }
  
  /**
   * Configure the underlying FetchClient
   */
  private setupClient(): void {
    this.client = new FetchClient();
    this.setConfig('baseURL', this.config.baseURL);
    this.setConfig('timeout', this.config.timeout);
  }
  
  /**
   * Setup routes - implemented by subclasses
   */
  protected abstract setupRoutes(): void;
  
  /**
   * Cached request with automatic fallback
   */
  protected async cachedRequest<T>(
    cacheKey: string,
    request: APIRequest,
    fallbackFn?: () => T
  ): Promise<APIResult<T>> {
    // Check cache first
    const cached = this.getCachedData<T>(cacheKey);
    if (cached) {
      return { data: cached };
    }
    
    // Attempt API request with retries
    const result = await this.requestWithRetries<T>(request);
    
    if (result.data) {
      // Cache successful response
      this.setCachedData(cacheKey, result.data);
      return result;
    }
    
    // Fallback if API fails and fallback provided
    if (fallbackFn) {
      const fallbackData = fallbackFn();
      ErrorHandler.logError(result.error as EnhancedError);
      return { 
        data: fallbackData,
        error: result.error // Include error for logging/debugging
      };
    }
    
    return result;
  }
  
  /**
   * Standard request without caching
   */
  protected async request<T>(request: APIRequest): Promise<APIResult<T>> {
    return this.requestWithRetries<T>(request);
  }
  
  /**
   * Request with automatic retries and error handling
   */
  private async requestWithRetries<T>(request: APIRequest): Promise<APIResult<T>> {
    let lastError: EnhancedError | null = null;
    
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        // Apply request interceptor
        const enhancedRequest = await this.interceptor.beforeRequest(request);
        
        // Make the request
        const response = await this.client.request(enhancedRequest);
        
        // Apply response interceptor
        const enhancedResponse = await this.interceptor.afterResponse(response, enhancedRequest);
        
        return { data: enhancedResponse.data };
        
      } catch (error) {
        // Handle error through interceptor
        try {
          await this.interceptor.onError(error, request);
        } catch (interceptorError) {
          lastError = ErrorHandler.handle(interceptorError, {
            attempt,
            url: request.url,
            method: request.method
          });
        }
        
        // Check if we should retry
        if (lastError && ErrorHandler.shouldRetry(lastError, attempt, this.config.retries)) {
          const delay = ErrorHandler.getRetryDelay(attempt, this.config.retryDelay);
          await this.sleep(delay);
          continue;
        }
        
        break;
      }
    }
    
    // All retries exhausted
    if (lastError) {
      ErrorHandler.logError(lastError);
      return { 
        error: new APIError(lastError.message, { 
          cause: lastError,
          context: lastError.context 
        })
      };
    }
    
    return { 
      error: new APIError('Request failed after all retries', {
        context: { url: request.url, method: request.method }
      })
    };
  }
  
  /**
   * Get cached data if valid
   */
  protected getCachedData<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * Store data in cache with TTL
   */
  protected setCachedData<T>(key: string, data: T, customTTL?: number): void {
    const ttl = customTTL || this.config.cacheTTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl,
      key
    };
    
    this.cache.set(key, entry);
    this.cleanupCache();
  }
  
  /**
   * Clean up expired cache entries and enforce size limits
   */
  private cleanupCache(): void {
    const now = Date.now();
    
    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
    
    // Enforce cache size limit (LRU eviction)
    if (this.cache.size > this.config.maxCacheSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, this.cache.size - this.config.maxCacheSize);
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }
  
  /**
   * Clear all cached data
   */
  protected clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics for monitoring
   */
  protected getCacheStats(): {
    size: number;
    hitRate: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(this.cache.values());
    
    return {
      size: this.cache.size,
      hitRate: 0, // Would need to track hits vs misses
      oldestEntry: entries.length ? Math.min(...entries.map(e => e.timestamp)) : 0,
      newestEntry: entries.length ? Math.max(...entries.map(e => e.timestamp)) : 0
    };
  }
  
  /**
   * Utility sleep function for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}