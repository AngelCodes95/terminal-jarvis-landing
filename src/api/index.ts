/**
 * API Module Entry Point
 * Clean exports for enterprise API architecture
 */

// Core infrastructure
export { CachedAPIClient } from './core/cachedApiClient';
export { RequestInterceptor } from './core/requestInterceptor';
export { ErrorHandler, ErrorCode } from './core/errorHandler';

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
export { LiveStatsService } from './services/liveStatsService';
export { ToolsService } from './services/toolsService';

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
import { LiveStatsService } from './services/liveStatsService';
import { ToolsService } from './services/toolsService';
import { getCurrentEnvironment } from './config/apiConfig';

// Singleton service instances
export const liveStatsService = new LiveStatsService(getCurrentEnvironment());
export const toolsService = new ToolsService(getCurrentEnvironment());