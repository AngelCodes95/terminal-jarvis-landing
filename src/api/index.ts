/**
 * API Module Entry Point
 * Real data fetching for Terminal Jarvis
 */

// Real Data Service - fetches actual GitHub/NPM data
export { RealDataService, realDataService } from './services/RealDataService';

// Export types for components
export type { LiveUpdates, ToolsResponse, TerminalTool } from './services/RealDataService';

// Export real data client for direct access
export { realDataClient } from './realDataClient';
