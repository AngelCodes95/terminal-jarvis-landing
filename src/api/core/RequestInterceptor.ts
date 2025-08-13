/**
 * Request Interceptor
 * Handles request/response middleware, rate limiting, and request transformation
 */

import { APIRequest, APIResponse } from '@ba-calderonmorales/clean-api';
import { APIConfig } from '../config/apiConfig';

export interface InterceptorOptions {
  config: APIConfig;
  requestId?: string;
}

export class RequestInterceptor {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  
  constructor(private options: InterceptorOptions) {}
  
  /**
   * Pre-request interceptor
   * Handles rate limiting, request ID generation, and header injection
   */
  async beforeRequest(request: APIRequest): Promise<APIRequest> {
    // Generate request ID for tracing
    const requestId = this.generateRequestId();
    
    // Check rate limits
    await this.checkRateLimit();
    
    // Enhance request with standard headers
    const enhancedRequest: APIRequest = {
      ...request,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'X-Client-Version': '1.0.0',
        'X-Timestamp': new Date().toISOString(),
        ...request.headers
      }
    };
    
    return enhancedRequest;
  }
  
  /**
   * Post-response interceptor
   * Handles response transformation and error enrichment
   */
  async afterResponse(response: APIResponse, request: APIRequest): Promise<APIResponse> {
    // Log response time for monitoring
    const responseTime = this.calculateResponseTime(request);
    
    // Enhance response with metadata
    const enhancedResponse: APIResponse = {
      ...response,
      headers: {
        ...response.headers,
        'X-Response-Time': responseTime.toString()
      }
    };
    
    return enhancedResponse;
  }
  
  /**
   * Error interceptor
   * Standardizes error responses and adds context
   */
  async onError(error: any, request: APIRequest): Promise<never> {
    const enhancedError = {
      ...error,
      context: {
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        requestId: request.headers?.['X-Request-ID']
      }
    };
    
    throw enhancedError;
  }
  
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const windowKey = 'global';
    const limit = this.options.config.rateLimit;
    
    let bucket = this.requestCounts.get(windowKey);
    
    if (!bucket || now > bucket.resetTime) {
      bucket = {
        count: 0,
        resetTime: now + limit.windowMs
      };
      this.requestCounts.set(windowKey, bucket);
    }
    
    if (bucket.count >= limit.requests) {
      const waitTime = bucket.resetTime - now;
      throw new Error(`Rate limit exceeded. Try again in ${waitTime}ms`);
    }
    
    bucket.count++;
  }
  
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private calculateResponseTime(request: APIRequest): number {
    const startTime = request.headers?.['X-Timestamp'];
    if (!startTime) return 0;
    
    return Date.now() - new Date(startTime).getTime();
  }
}