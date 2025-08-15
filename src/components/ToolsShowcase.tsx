import { type ToolsResponse } from '../api/terminalClient';

interface ToolsShowcaseProps {
  tools: ToolsResponse;
}

function getToolUseCase(toolName: string): string {
  const useCases: { [key: string]: string } = {
    'claude': 'Debug React hooks',
    'gemini': 'Explain complex code',
    'qwen': 'Algorithm analysis',
    'opencode': 'Generate clean code',
    'llxprt': 'Expert code review',
    'codex': 'Natural language to code',
    'crush': 'Optimize performance'
  };
  
  return useCases[toolName] || 'Code assistance';
}

export function ToolsShowcase({ tools }: ToolsShowcaseProps) {
  return (
    <div className="w-full">
      <div className="max-w-responsive-6xl mx-auto px-responsive-md">
        <div className="text-center mb-12">
          <h3 className="terminal-title text-3xl-responsive theme-text-accent mb-responsive-sm">
            SUPPORTED TOOLS ({tools.totalCount})
          </h3>
          <p className="terminal-body text-base-responsive theme-text-secondary max-w-responsive-2xl mx-auto">
            All tools accessible through one unified command interface
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-responsive-lg">
          {tools.tools.map((tool, index) => (
            <div
              key={tool.name}
              className="group theme-bg-secondary theme-border border rounded-lg p-5 hover:theme-border-primary hover:theme-bg-tertiary transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              style={{ 
                animationDelay: `${index * 50}ms`,
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              {/* Tool header */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                  tool.status === 'active' ? 'bg-green-500 shadow-green-500/50' :
                  tool.status === 'loading' ? 'bg-yellow-500 shadow-yellow-500/50 animate-spin' :
                  'bg-gray-400 shadow-gray-400/30'
                }`}></div>
                <span className="terminal-mono text-xs theme-text-secondary uppercase">
                  {tool.category}
                </span>
              </div>

              {/* Tool name */}
              <h4 className="terminal-text text-lg theme-text-accent mb-2 group-hover:theme-text-interactive transition-all duration-300">
                {tool.name}
                <span className="ml-2 opacity-0 group-hover:opacity-100 text-xs theme-text-interactive transition-opacity duration-300">●</span>
              </h4>

              {/* Description */}
              <p className="terminal-mono text-xs theme-text-secondary mb-3 leading-relaxed">
                {tool.description}
              </p>

              {/* Use case example */}
              <div className="theme-bg-tertiary rounded px-3 py-2 theme-border border group-hover:border-opacity-60 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="terminal-mono text-xs theme-text-interactive group-hover:theme-text-primary">
                    {getToolUseCase(tool.name)}
                  </span>
                  <div className="flex space-x-1">
                    <div className={`w-1 h-1 rounded-full theme-text-interactive opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 ${tool.status === 'active' ? 'animate-pulse' : ''}`} style={{ backgroundColor: 'var(--text-interactive)' }}></div>
                    <div className={`w-1 h-1 rounded-full theme-text-interactive opacity-0 group-hover:opacity-75 transition-all duration-300 delay-200 ${tool.status === 'active' ? 'animate-pulse' : ''}`} style={{ backgroundColor: 'var(--text-interactive)' }}></div>
                    <div className={`w-1 h-1 rounded-full theme-text-interactive opacity-0 group-hover:opacity-50 transition-all duration-300 delay-300 ${tool.status === 'active' ? 'animate-pulse' : ''}`} style={{ backgroundColor: 'var(--text-interactive)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="mt-responsive-2xl grid grid-cols-1 md:grid-cols-3 gap-responsive-md max-w-responsive-4xl mx-auto">
          <div className="text-center">
            <div className="terminal-title text-2xl-responsive theme-text-interactive mb-responsive-xs">
              {tools.totalCount}
            </div>
            <div className="terminal-mono text-sm-responsive theme-text-secondary">
              AI TOOLS INTEGRATED
            </div>
          </div>
          <div className="text-center">
            <div className="terminal-title text-2xl-responsive theme-text-interactive mb-responsive-xs">
              {tools.totalCount}
            </div>
            <div className="terminal-mono text-sm-responsive theme-text-secondary">
              TOOLS AVAILABLE
            </div>
          </div>
          <div className="text-center">
            <div className="terminal-title text-2xl-responsive theme-text-interactive mb-responsive-xs">
              MIT
            </div>
            <div className="terminal-mono text-sm-responsive theme-text-secondary">
              OPEN SOURCE LICENSE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}