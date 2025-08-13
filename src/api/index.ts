/**
 * API Module Entry Point
 * Clean exports for enterprise API architecture
 */

// Core infrastructure
export { CachedAPIClient } from './core/CachedAPIClient';
export { RequestInterceptor } from './core/RequestInterceptor';
export { ErrorHandler, ErrorCode } from './core/ErrorHandler';

// Configuration
export { 
  API_ENVIRONMENTS, 
  getCurrentEnvironment,
  type APIConfig,
  type CacheEntry,
  type HealthStatus,
  type Environment 
} from './config/apiConfig';

export { API_ROUTES, buildRoute } from './config/routes';

// Services
export { LiveStatsService } from './services/LiveStatsService';
export { ToolsService } from './services/ToolsService';

// Legacy compatibility - maintain existing exports
export { 
  terminalClient,
  TerminalJarvisClient,
  type LiveUpdates,
  type ToolsResponse,
  type ToolDetails,
  type TerminalTool,
  type CommandResponse,
  type SystemStatus
} from './terminalClient';

// Service instances for immediate use
import { LiveStatsService } from './services/LiveStatsService';
import { ToolsService } from './services/ToolsService';
import { getCurrentEnvironment } from './config/apiConfig';

// Singleton service instances
export const liveStatsService = new LiveStatsService(getCurrentEnvironment());
export const toolsService = new ToolsService(getCurrentEnvironment());