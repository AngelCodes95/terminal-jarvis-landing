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

export interface EnhancedRequest extends APIRequest {
  headers?: Record<string, string>;
  metadata?: {
    requestId: string;
    timestamp: string;
  };
}

export interface EnhancedResponse extends APIResponse {
  headers?: Record<string, string>;
  metadata?: {
    responseTime: number;
  };
}

export class RequestInterceptor {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  
  constructor(private options: InterceptorOptions) {}
  
  /**
   * Pre-request interceptor
   * Handles rate limiting, request ID generation, and header injection
   */
  async beforeRequest(request: APIRequest): Promise<EnhancedRequest> {
    // Generate request ID for tracing
    const requestId = this.generateRequestId();
    const timestamp = new Date().toISOString();
    
    // Check rate limits
    await this.checkRateLimit();
    
    // Enhance request with standard headers and metadata
    const enhancedRequest: EnhancedRequest = {
      ...request,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'X-Client-Version': '1.0.0',
        'X-Timestamp': timestamp,
      },
      metadata: {
        requestId,
        timestamp
      }
    };
    
    return enhancedRequest;
  }
  
  /**
   * Post-response interceptor
   * Handles response transformation and error enrichment
   */
  async afterResponse(response: APIResponse, request: EnhancedRequest): Promise<EnhancedResponse> {
    // Log response time for monitoring
    const responseTime = this.calculateResponseTime(request);
    
    // Enhance response with metadata
    const enhancedResponse: EnhancedResponse = {
      ...response,
      headers: {
        'X-Response-Time': responseTime.toString()
      },
      metadata: {
        responseTime
      }
    };
    
    return enhancedResponse;
  }
  
  /**
   * Error interceptor
   * Standardizes error responses and adds context
   */
  async onError(error: unknown, request: EnhancedRequest): Promise<never> {
    // Type guard for error objects
    const isErrorLike = (err: unknown): err is Record<string, unknown> => {
      return typeof err === 'object' && err !== null;
    };
    
    const baseError = isErrorLike(error) ? error : {};
    
    const enhancedError = {
      ...baseError,
      context: {
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        requestId: request.metadata?.requestId
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
  
  private calculateResponseTime(request: EnhancedRequest): number {
    const startTime = request.metadata?.timestamp;
    if (!startTime) return 0;
    
    return Date.now() - new Date(startTime).getTime();
  }
}