/**
 * API Route Definitions
 * Centralized route management for all services
 */

export const API_ROUTES = {
  // Statistics endpoints
  stats: {
    live: '/api/stats/live',
    health: '/api/stats/health'
  },
  
  // Tools endpoints
  tools: {
    list: '/api/tools/list',
    details: '/api/tools/:toolName'
  },
  
  // System endpoints
  system: {
    status: '/api/system/status',
    version: '/api/system/version'
  }
} as const;

export type RouteKey = keyof typeof API_ROUTES;
export type SubRouteKey<T extends RouteKey> = keyof typeof API_ROUTES[T];

/**
 * Build a complete route path
 */
export function buildRoute<T extends RouteKey>(
  category: T,
  route: SubRouteKey<T>,
  params?: Record<string, string>
): string {
  let path = API_ROUTES[category][route] as string;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, encodeURIComponent(value));
    });
  }
  
  return path;
}