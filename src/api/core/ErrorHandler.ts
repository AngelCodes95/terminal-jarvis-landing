/**
 * Centralized Error Handler
 * Standardizes error handling across all API services
 */

import { APIError } from '@ba-calderonmorales/clean-api';

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CACHE_ERROR = 'CACHE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface EnhancedError extends Error {
  code: ErrorCode;
  statusCode?: number;
  context?: Record<string, unknown>;
  timestamp: string;
  retryable: boolean;
}

export class ErrorHandler {
  /**
   * Transform various error types into standardized EnhancedError
   */
  static handle(error: unknown, context?: Record<string, unknown>): EnhancedError {
    const timestamp = new Date().toISOString();
    
    // Type guard for error objects
    const isErrorLike = (err: unknown): err is { name?: string; message?: string; statusCode?: number } => {
      return typeof err === 'object' && err !== null;
    };
    
    const errorObj = isErrorLike(error) ? error : {};
    const errorMessage = errorObj.message || 'An unexpected error occurred';
    
    // Handle network errors
    if (errorObj.name === 'TypeError' && errorMessage.includes('fetch')) {
      return {
        name: 'NetworkError',
        message: 'Network connection failed',
        code: ErrorCode.NETWORK_ERROR,
        context,
        timestamp,
        retryable: true
      } as EnhancedError;
    }
    
    // Handle timeout errors
    if (errorObj.name === 'AbortError' || errorMessage.includes('timeout')) {
      return {
        name: 'TimeoutError',
        message: 'Request timeout exceeded',
        code: ErrorCode.TIMEOUT_ERROR,
        context,
        timestamp,
        retryable: true
      } as EnhancedError;
    }
    
    // Handle rate limit errors
    if (errorMessage.includes('rate limit') || errorObj.statusCode === 429) {
      return {
        name: 'RateLimitError',
        message: 'API rate limit exceeded',
        code: ErrorCode.RATE_LIMIT_ERROR,
        statusCode: 429,
        context,
        timestamp,
        retryable: true
      } as EnhancedError;
    }
    
    // Handle service unavailable
    if (errorObj.statusCode && errorObj.statusCode >= 500 && errorObj.statusCode < 600) {
      return {
        name: 'ServiceUnavailableError',
        message: 'External service temporarily unavailable',
        code: ErrorCode.SERVICE_UNAVAILABLE,
        statusCode: errorObj.statusCode,
        context,
        timestamp,
        retryable: true
      } as EnhancedError;
    }
    
    // Handle validation errors
    if (errorObj.statusCode && errorObj.statusCode >= 400 && errorObj.statusCode < 500) {
      return {
        name: 'ValidationError',
        message: errorMessage,
        code: ErrorCode.VALIDATION_ERROR,
        statusCode: errorObj.statusCode,
        context,
        timestamp,
        retryable: false
      } as EnhancedError;
    }
    
    // Handle APIError from clean-api
    if (error instanceof APIError) {
      return {
        name: 'APIError',
        message: error.message,
        code: ErrorCode.SERVICE_UNAVAILABLE,
        context,
        timestamp,
        retryable: true
      } as EnhancedError;
    }
    
    // Default unknown error
    return {
      name: 'UnknownError',
      message: errorMessage,
      code: ErrorCode.UNKNOWN_ERROR,
      context,
      timestamp,
      retryable: false
    } as EnhancedError;
  }
  
  /**
   * Determine if error should trigger a retry
   */
  static shouldRetry(error: EnhancedError, attempt: number, maxRetries: number): boolean {
    if (attempt >= maxRetries) return false;
    if (!error.retryable) return false;
    
    // Don't retry validation errors
    if (error.code === ErrorCode.VALIDATION_ERROR) return false;
    
    return true;
  }
  
  /**
   * Calculate retry delay with exponential backoff
   */
  static getRetryDelay(attempt: number, baseDelay: number): number {
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
    
    return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
  }
  
  /**
   * Log error for monitoring (in production this would integrate with monitoring service)
   */
  static logError(error: EnhancedError): void {
    if (import.meta.env.PROD) {
      // In production, send to monitoring service
      console.error('[API Error]', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        context: error.context,
        timestamp: error.timestamp
      });
    } else {
      // Development logging
      console.warn('[API Error]', error.message, error.context);
    }
  }
}