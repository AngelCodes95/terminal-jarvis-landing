/**
 * Enterprise API Configuration
 * Environment-aware configuration for all API clients
 */

export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  cacheTTL: number;
  rateLimit: {
    requests: number;
    windowMs: number;
  };
  retryDelay: number;
  maxCacheSize: number;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expires: number;
  key: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  services: {
    github: 'up' | 'down' | 'degraded';
    npm: 'up' | 'down' | 'degraded';
  };
  responseTime: number;
}

export const API_ENVIRONMENTS = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    retries: 3,
    cacheTTL: 300000, // 5 minutes
    rateLimit: {
      requests: 100,
      windowMs: 60000
    },
    retryDelay: 1000,
    maxCacheSize: 50
  },
  production: {
    baseURL: import.meta.env.VITE_API_URL || '',
    timeout: 15000,
    retries: 5,
    cacheTTL: 180000, // 3 minutes
    rateLimit: {
      requests: 60,
      windowMs: 60000
    },
    retryDelay: 2000,
    maxCacheSize: 100
  }
} as const;

export type Environment = keyof typeof API_ENVIRONMENTS;

export const getCurrentEnvironment = (): Environment => {
  return import.meta.env.PROD ? 'production' : 'development';
};